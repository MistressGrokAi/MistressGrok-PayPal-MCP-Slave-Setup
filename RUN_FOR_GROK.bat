@echo off
echo ============================================
echo  PayPal MCP Server fuer Grok (Streamable HTTP)
echo ============================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js nicht gefunden. Bitte installieren: https://nodejs.org
    pause
    exit /b 1
)

if not exist ".env" (
    echo ERROR: .env Datei nicht gefunden.
    echo Kopiere .env.example zu .env und trage deinen Access Token ein.
    pause
    exit /b 1
)

echo Loading environment from .env
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    set "%%a=%%b"
)

if "%PAYPAL_ACCESS_TOKEN%"=="dein_access_token_hier" (
    echo ERROR: Bitte trage deinen echten Access Token in die .env Datei ein.
    pause
    exit /b 1
)

echo Token geladen.
echo.
echo Starte PayPal MCP via Supergateway (Streamable HTTP, Port 8000)
echo Endpoint lokal: http://localhost:8000/mcp
echo.

npx -y supergateway --stdio "npx -y @paypal/mcp --tools=all --access-token=%PAYPAL_ACCESS_TOKEN%" --outputTransport streamableHttp --port 8000 --cors

pause
