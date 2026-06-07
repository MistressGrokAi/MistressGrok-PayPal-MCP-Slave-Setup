@echo off
cd /d "%~dp0"
echo ==================================================
echo  PayPal SEND-PAYMENT MCP fuer Grok (Streamable HTTP)
echo ==================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js nicht gefunden. Bitte installieren: https://nodejs.org
    pause
    exit /b 1
)

if not exist ".env" (
    echo ERROR: .env Datei nicht gefunden.
    echo Kopiere .env.example zu .env und trage CLIENT_ID + CLIENT_SECRET ein.
    pause
    exit /b 1
)

echo Loading environment from .env
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    set "%%a=%%b"
)

echo Installing dependencies (nur beim ersten Mal)...
cd paypal-send-mcp
call npm install --silent
cd ..

echo.
echo Starte send_payment Server via Supergateway (Streamable HTTP, Port 8000)
echo Endpoint lokal: http://localhost:8000/mcp
echo.

npx -y supergateway --stdio "node paypal-send-mcp/server.js" --outputTransport streamableHttp --port 8000 --cors

pause
