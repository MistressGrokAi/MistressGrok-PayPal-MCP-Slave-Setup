# PayPal MCP Setup - Schritt für Schritt

## Schritt 1: Node.js installieren
1. Geh auf https://nodejs.org
2. Lade die **LTS**-Version herunter und installiere sie
3. Prüfe die Installation: `node -v` und `npm -v` in der Kommandozeile

## Schritt 2: PayPal Credentials holen
1. Geh auf https://developer.paypal.com
2. Login → **Apps & Credentials** → deine App auswählen
3. Notiere **Client ID** und **Client Secret** (Sandbox)

## Schritt 3: Access Token generieren
Öffne die Windows-Kommandozeile (cmd oder PowerShell) und führe aus:

```
curl -X POST https://api-m.sandbox.paypal.com/v1/oauth2/token -u "CLIENT_ID:CLIENT_SECRET" -H "Content-Type: application/x-www-form-urlencoded" -d "grant_type=client_credentials"
```

Ersetze `CLIENT_ID` und `CLIENT_SECRET` mit deinen echten Werten.
Kopiere den `access_token` aus der Antwort.

## Schritt 4: .env Datei erstellen
1. Erstelle im Projektordner eine Datei namens `.env`
2. Inhalt:
   ```
   PAYPAL_ACCESS_TOKEN=dein_token_hier
   PAYPAL_ENVIRONMENT=SANDBOX
   ```
3. Speichern — diese Datei **niemals** in Git committen

## Schritt 5: Server starten
1. Doppelklick auf `RUN_MCP_SERVER.bat`
2. Der MCP Server startet und wartet auf Anfragen

## Wichtige Hinweise
- Access Tokens laufen nach ca. 9 Stunden ab → dann Schritt 3 wiederholen
- Die `.env` Datei enthält sensible Daten — nie teilen, nie committen
- Für Produktion: `PAYPAL_ENVIRONMENT=LIVE` und Live-Credentials verwenden
