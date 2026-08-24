@echo off
title Family Fibro - Servidor local
echo.
echo Family Fibro disponible en http://127.0.0.1:8080
echo Para detener el servidor presiona Ctrl+C.
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8080
) else (
  python -m http.server 8080
)
