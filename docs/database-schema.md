# Esquema de base de datos

Migraciones en `supabase/migrations/` (orden: `schema` → `rls` → `storage`) y datos iniciales en `supabase/seed.sql` (idempotente). Probado en PostgreSQL real con `npm test` (PGlite).

## Tablas

| Tabla | Propósito | Claves y restricciones destacadas |
|---|---|---|
| `products` | Productos | `slug` único y con formato; `type` (`individual`/`evento`); `price_cop >= 0`; **evento ⇒ sin precio**; `status` (`published`/`hidden`, por defecto `hidden`); `is_featured`; `sort_order`; `created_at`/`updated_at` automáticos |
| `product_images` | Fotos de un producto | FK a `products` (cascade); `storage_path` único por producto; `sort_order` (0 = portada) |
| `categories` | Categorías | `slug` único; `kind` (`evento`/`vela`); `is_active`; `sort_order` |
| `product_categories` | Producto ↔ categoría (N:M) | PK compuesta; ambos FK con cascade |
| `linktree_links` | Enlaces del Linktree | `url` con CHECK de protocolo seguro; `style` (`featured`/`standard`/`compact`/`image`); `icon` (clave); **un solo destacado** (índice parcial); `is_active`; `sort_order` |
| `catalog_versions` | Versiones del PDF | `version` incremental; `storage_path`; `selection` (jsonb: snapshot de productos/orden); **una sola publicada** (índice parcial); `generated_by`, `generated_at`, `published_at` |
| `site_settings` | Ajustes clave/valor | `key` con formato; `value` jsonb; `is_public` |
| `admin_users` *(adicional, necesaria)* | Administradoras autorizadas | PK = `auth.users.id` |

Funciones: `set_updated_at()` (trigger) e `is_admin()` (`SECURITY DEFINER`, `search_path` vacío, evita recursión de RLS).

## Índices
`products(status, sort_order)`, `products(sort_order)` parcial para destacados publicados, `product_images(product_id, sort_order)`, `product_categories(category_id)`, `categories(kind, sort_order)`, `linktree_links(is_active, sort_order)`, y los índices únicos parciales de "un publicado" y "un destacado".

## RLS (resumen)

RLS activa en todas las tablas; `revoke all` y luego grants mínimos: `anon` solo `select`; `authenticated` CRUD filtrado por política.

| Tabla | Público (anon y no administradoras) | Administradora |
|---|---|---|
| `products` | solo `published` | todo |
| `product_images`, `product_categories` | solo si su producto está publicado (y categoría activa) | todo |
| `categories`, `linktree_links` | solo `is_active` | todo |
| `catalog_versions` | solo la publicada | todo |
| `site_settings` | solo `is_public` | todo |
| `admin_users` | nada | solo su propia fila (lectura); sin escritura por API |

## Storage

| Bucket | Acceso | Límites |
|---|---|---|
| `site-media` | lectura pública por URL; escritura solo administradoras | 5 MB; jpeg/png/webp/avif |
| `catalogs` | privado; el público solo lee el PDF de la versión publicada; administradoras todo | 30 MB; pdf |

> Las imágenes de productos ocultos son técnicamente accesibles por URL si alguien conoce la ruta (los nombres incluyen UUID). Si eso importara, se pasaría a URLs firmadas.

## Datos iniciales
Seis categorías de evento (matrimonios, bautizos y comuniones, cumpleaños y quinceañeros, baby showers, empresariales, otros eventos) y ajustes: `brand_tagline` = "Velas · Recordatorios"; `whatsapp_number`, `instagram_url` y `contact_email` en `null` (se completan desde el panel; **no se inventan**).

## Pruebas (qué cubren y qué no)
`supabase/tests/rls.test.ts` aplica las migraciones y el seed sobre PostgreSQL (PGlite) con roles `anon`/`authenticated` y comprueba lectura pública, bloqueo de escritura, auto-otorgamiento de permisos, y todas las restricciones. **Simula** los esquemas `auth` y `storage` de Supabase con lo mínimo; antes de producción debe repetirse una verificación manual contra un proyecto Supabase real (ver `docs/deployment.md`).
