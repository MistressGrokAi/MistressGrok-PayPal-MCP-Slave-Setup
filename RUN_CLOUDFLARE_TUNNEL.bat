@echo off
echo ============================================
echo  Cloudflare Quick Tunnel fuer Port 8000
echo ============================================
echo.

where cloudflared >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: cloudflared nicht gefunden.
    echo Installation: winget install --id Cloudflare.cloudflared
    echo Oder: https://github.com/cloudflare/cloudflared/releases
    pause
    exit /b 1
)

echo Starte Tunnel. Suche im Output die URL mit trycloudflare.com
echo Die Grok-URL ist dann: https://DEINE-URL.trycloudflare.com/mcp
echo.

cloudflared tunnel --url http://localhost:8000

pause
