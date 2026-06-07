@echo off
echo Starting PayPal MCP Server...

echo Loading environment from .env
for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
    set "%%a=%%b"
)

echo Token loaded. Starting MCP server...
echo.

npx -y @paypal/mcp --tools=all

pause
