@echo off
echo Starting PayPal MCP Server for Mistress Grok AI...

echo Loading environment from .env
for /f "tokens=*" %%a in (.env) do (
    set %%a
)

echo Token loaded. Starting MCP server...

echo.
echo Run this command in another terminal if needed:
echo npx -y @paypal/mcp --tools=all

echo.
echo MCP server is ready for your Mistress commands.
pause