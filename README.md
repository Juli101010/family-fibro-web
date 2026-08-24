# Family Fibro — sitio web

Sitio comercial independiente con catálogo interactivo, selector de terminaciones, carrito de cotización, armado de frases, Pack PROMO 2026 y salida detallada por WhatsApp.

## Ver la web publicada

**[Abrir Family Fibro desde cualquier computadora](https://juli101010.github.io/family-fibro-web/)**

No requiere instalar VS Code, Git, Python ni Odoo para verla. Si se descarga el proyecto como ZIP, también se puede abrir el archivo `ABRIR_WEB.url`.

## Abrir en VS Code

```powershell
git clone https://github.com/Juli101010/family-fibro-web.git
code family-fibro-web
```

La guía completa para colaboradores está en [`EDITAR_EN_VSCODE.md`](EDITAR_EN_VSCODE.md).

## Ejecutar localmente

Desde la terminal integrada de VS Code:

```powershell
python -m http.server 8080
```

Abrir `http://127.0.0.1:8080`.

También se puede ejecutar `start.cmd` o usar la tarea de VS Code **Family Fibro: abrir en navegador**.

## Archivos principales

- `index.html`: estructura y contenido.
- `styles.css`: diseño responsive y sistema visual.
- `app.js`: catálogo, carrito, descuentos y WhatsApp.
- `assets/`: imágenes y recursos gráficos.

## Web publicada

https://juli101010.github.io/family-fibro-web/
