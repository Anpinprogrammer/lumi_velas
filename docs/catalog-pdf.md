# Catálogo PDF (Fase 6)

El PDF se genera **en el servidor** con `@react-pdf/renderer` a partir de los mismos datos del catálogo web (`getCatalog()`), así que cuando se conecte Supabase el PDF cambia solo con ese punto de acceso.

## Estructura (A4, solo colores del logo)
1. **Portada**: logo completo como protagonista dentro de un arco, «Catálogo de colección · Momentos que brillan · año».
2. **Marca**: «Cada vela cuenta una historia» (textos del prototipo aprobado).
3. **Eventos**: las 6 categorías con imagen y frase corta (omitida si no hay categorías).
4. **Productos**, 2 por página, por sección: «Colección» (velas individuales, con precio) y «Para eventos» (sin precio: «Precio a cotizar»). El orden de las secciones es configurable.
5. **Contraportada**: WhatsApp (solo si hay número configurado), Instagram (si hay) y enlace al catálogo en línea. Los enlaces son clicables.

Mientras el catálogo sea maqueta, cada página lleva la nota «Material de referencia…» (se quita sola cuando `source !== "mock"`).

## Rutas
| Ruta | Qué hace |
|---|---|
| `GET /catalogo/pdf` | PDF público: catálogo completo en orden por defecto. Es el que enlaza el botón «Descargar PDF» del catálogo web. |
| `GET /catalogo/pdf?productos=a,b&orden=eventos-primero` | Selección y orden (vista previa del generador). Slugs validados; los inexistentes u ocultos se ignoran. Máx. 60. |
| `…&descargar=1` | `Content-Disposition: attachment`. |
| `/admin/catalogo-pdf` | Generador en el panel (requiere sesión Supabase). |
| `/dev/catalogo-pdf` | El mismo generador para verlo sin Supabase. Solo en desarrollo o con `NEXT_PUBLIC_SHOW_DESIGN_SYSTEM=true`. |

## Decisiones técnicas
- Fuentes: WOFF locales en `src/features/pdf/fonts` (Cormorant Garamond y DM Sans, OFL). Son las tipografías **provisionales** del sitio; si el cliente valida otras, se cambian aquí también.
- Imágenes: React PDF solo admite PNG/JPG; los WebP de `/public` se convierten con `sharp` (JPG 80 % para fotos, PNG para logos con transparencia). Solo se leen rutas dentro de `/public`.
- Despliegue en Vercel: `serverExternalPackages` y `outputFileTracingIncludes` (en `next.config.ts`) incluyen fuentes e imágenes en la función.
- Respuesta con `s-maxage=3600`: el PDF público se cachea en el CDN una hora.

## Pendiente (requiere Supabase, Fase 5)
- Guardar **versiones** (tabla `catalog_versions` y bucket `catalogs` ya existen en las migraciones), marcar cuál está **publicada** y que `/catalogo/pdf` sirva esa versión.
- El PDF publicado **nunca** se reemplaza automáticamente: publicar será una acción explícita con confirmación.
- Reemplazar imágenes de muestra por las fotos reales (las leerá desde Storage en `images.ts`).
