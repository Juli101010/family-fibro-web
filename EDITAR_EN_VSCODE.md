# Guía para editar Family Fibro en VS Code

## 1. Instalar las herramientas

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/downloads)
- [Python](https://www.python.org/downloads/) para ejecutar la web localmente

Al abrir el proyecto, VS Code ofrecerá instalar las extensiones recomendadas. Aceptar la instalación.

## 2. Descargar y abrir el proyecto

Abrir PowerShell y ejecutar:

```powershell
git clone https://github.com/Juli101010/family-fibro-web.git
cd family-fibro-web
code .
```

## 3. Ver la web mientras se edita

La opción más simple es hacer doble clic en `start.cmd`. También se puede usar la terminal de VS Code:

```powershell
.\start.cmd
```

Después abrir `http://127.0.0.1:8080`.

Otra opción es hacer clic derecho sobre `index.html` y elegir **Open with Live Server**.

## 4. Qué archivo modificar

| Necesidad | Archivo |
| --- | --- |
| Textos, enlaces y orden de secciones | `index.html` |
| Colores, tamaños, espacios y responsive | `styles.css` |
| Guardado visual del pedido | `persistence.css` |
| Catálogo, precios, descuentos y carrito | `app.js` |
| Fotografías y logo | `assets/` |

## 5. Probar antes de guardar cambios

- Revisar portada, promoción y catálogo.
- Agregar letras y números al pedido.
- Probar las tres terminaciones.
- Confirmar descuentos de 10, 20 piezas y serie completa.
- Verificar el mensaje generado para WhatsApp.
- Revisar la web en computadora y celular.

## 6. Subir cambios a GitHub

```powershell
git pull
git checkout -b cambio-descripcion
git add .
git commit -m "Describe brevemente el cambio"
git push -u origin cambio-descripcion
```

Después crear un **Pull Request** en GitHub para revisar y aprobar el cambio antes de incorporarlo a `main`.

> Para subir ramas directamente al repositorio, la persona necesita ser agregada como colaboradora. Sin ese permiso puede crear un fork y enviar un Pull Request.

## 7. Publicación

La rama `main` se publica automáticamente en:

https://juli101010.github.io/family-fibro-web/

No es necesario tocar Docker ni Odoo para editar esta versión.
