# Catálogo (Fase 4) — maqueta

Por decisión de Andres (23-nov-2026) el catálogo se entrega como **maqueta sin backend** hasta que el cliente entregue fotos y descripciones definitivas.

## Rutas
| Ruta | Contenido |
|---|---|
| `/catalogo` | Entrada: eventos / velas, accesos por tipo de evento, favoritas, contacto |
| `/catalogo/eventos` | 6 categorías de evento, personalización, cómo cotizar |
| `/catalogo/eventos/[slug]` | Presentación, ideas, productos del evento, cotización |
| `/catalogo/velas` | Velas individuales con filtro por colección (`?categoria=`) y orden |
| `/catalogo/producto/[slug]` | Galería, precio o "Precio a cotizar", ficha, categorías, WhatsApp, compartir, relacionados |

Todas se prerenderizan (estáticas). Un slug desconocido responde 404.

## Datos de muestra (qué es provisional)
- `src/features/catalog/mock-data.ts`: textos, precios y fichas **del prototipo aprobado** (no son productos reales).
- `public/mock/catalogo/*.webp`: ilustraciones generadas con la paleta del logo (2 por producto + 1 por categoría de evento).
- Colecciones de velas **Botánica / Serenidad / Origen**: vienen del prototipo y **no están confirmadas** por el cliente.
- Opciones de personalización y pasos para cotizar: textos del prototipo (`personalization.ts`), editables.
- El pie de página avisa "Imágenes ilustrativas" mientras `source === "mock"`.

## Reglas comerciales (implementadas y probadas)
- Individual: muestra precio en COP. Evento: nunca precio, muestra "Solicitar cotización".
- Consultas y cotizaciones abren WhatsApp con un mensaje contextual (nombre del producto, precio, enlace; o evento, fecha, cantidad, personalización e idea). Sin checkout ni pagos.
- La cotización valida con Zod (`quoteSchema`) y muestra el mensaje antes de enviarlo (copiar o abrir WhatsApp). No se guarda nada.
- Sin número de WhatsApp configurado, los botones de WhatsApp no se muestran (no se publican botones que no llevan a ningún lado).

## Número de WhatsApp
Orden: `site_settings.whatsapp_number` (Supabase) → variable `WHATSAPP_NUMBER` → número de demostración solo en desarrollo.
Para publicar la maqueta sin Supabase basta con definir `WHATSAPP_NUMBER` (internacional, sin "+") en Vercel y redesplegar.

## Cómo conectar Supabase cuando lleguen fotos y textos
1. Cargar productos, categorías e imágenes (panel de la Fase 5 o SQL); fotos en el bucket `site-media`.
2. Reescribir **solo** `getCatalog()` en `src/features/catalog/data.ts` para leer `products` + `product_images` + `product_categories` + `categories` (RLS ya filtra lo publicado) y devolver el mismo tipo `Catalog`; envolver en `"use cache"` con `cacheTag("catalog")`.
3. Campos que la maqueta usa y el esquema aún no tiene (migración pequeña en ese momento): `products.specs` (jsonb), `categories.intro`, `categories.ideas`, `categories.image_path`.
4. Generar tipos con `supabase gen types typescript` y quitar `mock-data.ts` y `public/mock/catalogo`.
