# Lumi Velas Artesanales — Prototipo interactivo

Prototipo navegable de alta fidelidad para presentar a Lumi. Es una sola página en **HTML5, CSS3 y JavaScript vanilla (ES6+)**, sin frameworks, backend ni base de datos.

## Cómo abrirlo

1. Descomprime la carpeta.
2. Haz doble clic en `index.html`. Se abre en cualquier navegador moderno (Chrome, Edge, Safari o Firefox).

Necesita conexión a internet solo para dos cosas:
- **Google Fonts**: Cormorant Garamond y DM Sans. Sin conexión se usan fuentes de respaldo.
- **jsPDF** (desde cdnjs): genera el catálogo en PDF. Sin conexión, la página avisa que no pudo generarlo.

## Publicarlo con un enlace propio (gratis)

- **Netlify Drop**: arrastra la carpeta a https://app.netlify.com/drop y obtienes un enlace público.
- **GitHub Pages**: sube `index.html` a un repositorio y activa Pages en la configuración.
- **Vercel**: importa la carpeta como un proyecto estático.

## Vistas (navegación por hash)

| Vista | URL |
|---|---|
| Inicio | `#inicio` |
| Eventos | `#eventos` |
| Categoría de evento | `#evento-matrimonios`, `#evento-bautizos`, `#evento-cumpleanos`, `#evento-baby-shower`, `#evento-empresariales`, `#evento-otras` |
| Velas artesanales | `#velas` |
| Detalle de producto | `#producto-<slug>` (ej. `#producto-vela-aurora`) |
| Cursos y talleres | `#cursos` |
| Catálogo web (slider) | `#catalogo` |
| Lumi Studio (panel) | `#studio`, `#studio-productos`, `#studio-catalogo` |

## Estructura del código (`index.html`)

- **CSS**: tokens de marca en `:root`, seguidos de los bloques de cada sección (header, home, páginas interiores, modal, Studio y catálogo).
- **JavaScript**:
  - `Art`: genera las ilustraciones de referencia en SVG inline. Reemplazan las fotografías, que se cambiarán por fotos reales.
  - `COLLECTIONS`, `EVENTS`, `PERSONALIZATION`, `WORKSHOPS` y `state.products`: datos mockup. Es la fuente única que comparten el sitio, el panel y el PDF.
  - `view*()`: una función por vista.
  - `resolve()` / `render()`: el router por hash.
  - `quoteModal`, `workshopModal` y `waModal`: los formularios y la simulación de WhatsApp.
  - `productForm` y `confirmDelete`: el CRUD del panel.
  - `buildPDF()`: el catálogo con jsPDF.
  - `viewCatalogPublic()`, `lbGo()` y `bindLookbook()`: el catálogo web en modo slider.

## Notas de la demostración

- **Los cambios no se guardan**: lo que se haga en el panel se pierde al recargar la página.
- **WhatsApp no tiene número**: abre `wa.me` sin número. Para configurarlo, busca `https://wa.me/?text=` en `waModal` y cambia la URL por `https://wa.me/57XXXXXXXXXX?text=`.
- **Contenido ficticio**: los precios, productos y talleres son de ejemplo, en COP.
- **Imágenes ilustradas**: para usar fotos reales, cambia `imgSrc()` o asigna `img: 'ruta/foto.jpg'` a cada producto.

## Para la versión de producción (Next.js)

- Pasar `state.products` y los demás datos a una base de datos o un CMS.
- Convertir cada `view*()` en una ruta.
- Implementar autenticación real para Lumi Studio.
- Generar el PDF en el servidor.
