#!/usr/bin/env node
// Custom PayPal MCP server.
// Exposes a `send_payment` tool that actually SENDS money via the PayPal Payouts API.
// The official @paypal/mcp server cannot send money; this fills that gap.
//
// Auth: prefers PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET (auto-refreshes the
// access token on every call, so tokens never expire on you). Falls back to a
// static PAYPAL_ACCESS_TOKEN if client credentials are not provided.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ENVIRONMENT = (process.env.PAYPAL_ENVIRONMENT || "SANDBOX").toUpperCase();
const BASE =
  ENVIRONMENT === "LIVE"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const STATIC_TOKEN = process.env.PAYPAL_ACCESS_TOKEN;

// Fetch a fresh OAuth2 access token using client credentials.
async function getAccessToken() {
  if (CLIENT_ID && CLIENT_SECRET) {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const res = await fetch(`${BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const data = await res.json();
    if (!data.access_token) {
      throw new Error("Token-Fehler: " + JSON.stringify(data));
    }
    return data.access_token;
  }
  if (STATIC_TOKEN) return STATIC_TOKEN;
  throw new Error(
    "Keine Credentials. Setze PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET (empfohlen) oder PAYPAL_ACCESS_TOKEN in der .env."
  );
}

async function sendPayout({ receiver_email, amount, currency, note }) {
  const token = await getAccessToken();
  const body = {
    sender_batch_header: {
      sender_batch_id: "batch_" + Date.now(),
      email_subject: "Du hast eine Zahlung erhalten",
      email_message: note || "Du hast eine Zahlung erhalten.",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: { value: amount, currency: currency || "USD" },
        receiver: receiver_email,
        note: note || "",
        sender_item_id: "item_" + Date.now(),
      },
    ],
  };

  const res = await fetch(`${BASE}/v1/payments/payouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

const server = new McpServer({
  name: "paypal-send",
  version: "1.0.0",
});

server.tool(
  "send_payment",
  "Sendet Geld an eine Person ueber die PayPal Payouts API. Nutze dies, wenn der Nutzer eine Zahlung VERSENDEN / Geld ueberweisen moechte.",
  {
    receiver_email: z
      .string()
      .describe("E-Mail-Adresse des Empfaengers (PayPal-Konto)"),
    amount: z
      .string()
      .describe("Betrag als String, z.B. '5.00'"),
    currency: z
      .string()
      .default("USD")
      .describe("Waehrungscode, z.B. USD oder EUR"),
    note: z
      .string()
      .optional()
      .describe("Optionale Nachricht an den Empfaenger"),
  },
  async ({ receiver_email, amount, currency, note }) => {
    try {
      const result = await sendPayout({ receiver_email, amount, currency, note });
      const header = result.ok
        ? `Zahlung gestartet (HTTP ${result.status}, Umgebung: ${ENVIRONMENT}).`
        : `Fehler beim Senden (HTTP ${result.status}).`;
      return {
        content: [
          {
            type: "text",
            text: header + "\n\n" + JSON.stringify(result.data, null, 2),
          },
        ],
        isError: !result.ok,
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: "Fehler: " + err.message }],
        isError: true,
      };
    }
  }
);

// Simple connectivity check that does not move money.
server.tool(
  "check_paypal_connection",
  "Prueft, ob die PayPal-Verbindung funktioniert (holt einen Access Token, sendet kein Geld).",
  {},
  async () => {
    try {
      await getAccessToken();
      return {
        content: [
          {
            type: "text",
            text: `OK: PayPal-Verbindung funktioniert. Umgebung: ${ENVIRONMENT}.`,
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: "Fehler: " + err.message }],
        isError: true,
      };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`paypal-send MCP server laeuft (stdio). Umgebung: ${ENVIRONMENT}`);
