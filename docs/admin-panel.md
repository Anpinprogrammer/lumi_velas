# Panel administrativo (Fase 5)

Ruta `/admin` (protegida: `proxy.ts` filtra y **cada** página y Server Action llama a `requireAdmin()`; RLS es la última barrera). Sin Supabase configurado no se puede entrar.

| Ruta | Qué hace |
|---|---|
| `/admin` | Resumen real: productos publicados/ocultos/destacados, enlaces, categorías, última versión del PDF y avisos (sin WhatsApp, sin productos publicados, sin enlaces visibles) |
| `/admin/links`, `/nuevo`, `/[id]` | Enlaces del Linktree: crear, editar, ocultar/mostrar, subir/bajar, eliminar, imagen opcional, un solo destacado |
| `/admin/productos`, `/nuevo`, `/[id]` | Productos: crear, editar, publicar/ocultar, ordenar, categorías, eliminar; fotos (subir varias, texto alternativo, portada = la primera, ordenar, eliminar) |
| `/admin/catalogo-pdf` | Generador del PDF (Fase 6) |
| `/dev/panel` | Vista de **diseño** con datos inventados, solo en desarrollo (o con `NEXT_PUBLIC_SHOW_DESIGN_SYSTEM=true`); las acciones no hacen nada |

## Seguridad
- Validación con Zod **en el servidor** (`src/features/admin/schemas.ts`): destinos de enlace solo `https`, `mailto`, `tel` o ruta interna; icono y estilo de listas permitidas; slug con formato; evento ⇒ sin precio; ids como UUID.
- Imágenes: se comprueba la **firma de los bytes** (JPG/PNG/WebP/AVIF; SVG y PDF se rechazan), máximo 5 MB, ruta `products|links/{id}/{uuid}.ext` (nunca el nombre original). El bucket `site-media` repite el límite y los tipos.
- Todo se hace con la sesión de la administradora (clave publicable + RLS); no se usa `service_role`.
- Eliminar pide confirmación; al borrar un producto o enlace se borran sus archivos de Storage (mejor esfuerzo).

## Caché
Cada cambio llama a `updateTag("linktree")` y `updateTag("catalog")`: el Linktree se actualiza al instante. El catálogo público **todavía lee la maqueta** (`getCatalog()` en `src/features/catalog/data.ts`); cuando se conecte a Supabase usará la etiqueta `catalog` y los cambios del panel se verán sin redesplegar (ver `docs/catalog.md`).

## Sin probar contra Supabase real
La lógica pura (validaciones, orden, firma de imágenes) tiene pruebas; las consultas y acciones compilan con tipos estrictos pero **no se han ejecutado contra un proyecto Supabase**: se verifican al crear el proyecto (ver `docs/implementation-plan.md`, cierre de la Fase 2).

## Pendiente
- Ajustes de contacto editables (WhatsApp, Instagram, correo → `site_settings`); hoy se usa la variable `WHATSAPP_NUMBER` o SQL.
- Gestión de categorías (hoy vienen del `seed.sql`).
- Versiones y publicación del PDF (ver `docs/catalog-pdf.md`).
