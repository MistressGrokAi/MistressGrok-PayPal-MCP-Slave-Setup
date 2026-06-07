@echo off
echo Starting PayPal MCP Server...

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js nicht gefunden. Bitte installieren: https://nodejs.org
    pause
    exit /b 1
)

:: Check if .env exists
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

:: Check if placeholder was not replaced
if "%PAYPAL_ACCESS_TOKEN%"=="dein_access_token_hier" (
    echo ERROR: Bitte trage deinen echten Access Token in die .env Datei ein.
    pause
    exit /b 1
)

echo Token geladen. Starting MCP server...
echo.

npx -y @paypal/mcp --tools=all

pause
