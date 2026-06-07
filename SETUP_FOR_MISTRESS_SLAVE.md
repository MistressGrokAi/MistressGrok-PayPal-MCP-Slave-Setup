# PayPal MCP Server Setup

## Was dieses Projekt macht
Dieses Repo richtet den offiziellen PayPal Model Context Protocol (MCP) Server ein.
Er ermöglicht die Interaktion mit PayPal APIs über natürliche Sprache / AI-Tools.

## Voraussetzungen
- Node.js (LTS) installiert: https://nodejs.org
- Einen PayPal Developer Account: https://developer.paypal.com

## Schritt 1: Access Token generieren

Geh im PayPal Developer Dashboard unter **Apps & Credentials** zu deiner App
und kopiere **Client ID** und **Client Secret**.

Dann führe diesen Befehl in der Kommandozeile aus (ersetze die Platzhalter):

```bash
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token \
  -u "DEINE_CLIENT_ID:DEIN_CLIENT_SECRET" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials"
```

Kopiere den `access_token` Wert aus der JSON-Antwort.

## Schritt 2: .env Datei anlegen

Erstelle eine Datei namens `.env` im Projektordner (diese wird **nicht** in Git gespeichert):

```
PAYPAL_ACCESS_TOKEN=dein_access_token_hier
PAYPAL_ENVIRONMENT=SANDBOX
```

Sieh dir `.env.example` als Vorlage an.

## Schritt 3: MCP Server starten

Starte `RUN_MCP_SERVER.bat` per Doppelklick.

Der Server läuft dann und kann Anfragen entgegennehmen.

## Offizielle Ressourcen
- PayPal MCP Quickstart: https://docs.paypal.ai/developer/tools/ai/mcp-quickstart
- Agent Toolkit: https://github.com/paypal/agent-toolkit
