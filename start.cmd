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
  where node >nul 2>nul
  if %errorlevel%==0 (
    node -e "require('http').createServer((req,res)=>require('fs').createReadStream('.'+(req.url==='/'?'/index.html':req.url)).on('error',()=>{res.statusCode=404;res.end()}).pipe(res)).listen(8080)"
  ) else (
    echo No se encontro Python ni Node.js. Abre la pagina publicada:
    echo https://juli101010.github.io/family-fibro-web/
    pause
  )
)
