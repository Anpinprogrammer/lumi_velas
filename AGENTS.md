<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Lumi · Velas · Recordatorios

Sitio de velas artesanales (Bogotá): Next.js 16 App Router + React 19 + TypeScript estricto + Tailwind v4 + Supabase. La documentación de fondo está en `docs/`; aquí solo lo que no se deduce leyendo archivos.

## Comandos

```bash
npm install
npm run dev            # Turbopack; /dev/design-system y /dev/panel en desarrollo
npm run lint           # ESLint 9 flat config
npx tsc --noEmit       # no hay script de typecheck
npm test               # Vitest completo (incluye RLS con PGlite)
npx vitest run src/features/pdf/pdf.test.ts   # una sola suite
npm run build
```

Antes de dar algo por terminado: `npm run lint` → `npx tsc --noEmit` → `npm test` → `npm run build` (orden de `docs/deployment.md`). En un clon nuevo no existe `node_modules/`, así que las guías de Next 16 no están disponibles hasta `npm install`.

## Convenciones que no son obvias

- **Todo en español**: UI (`es-CO`), textos, docs, comentarios, mensajes de error y commits (prefijo habitual `Fase N:`). Precios en COP.
- `src/app/` solo compone rutas; la lógica vive en `src/features/<dominio>/`; `features/` **no** importa de `app/`.
- `lumi-prototipo/index.html` es el prototipo aprobado (referencia de diseño, textos y datos), no forma parte del build.
- **Nunca** usar ni añadir `service_role`; todo va con la clave publicable + RLS.
- Cada página, layout y **Server Action** de `/admin` llama a `requireAdmin()`; el layout no protege a las acciones y `proxy.ts` es solo un filtro optimista.
- Tras mutar datos en el panel: `updateTag("linktree")` y `updateTag("catalog")`.
- Punto único de datos: `getCatalog()` (`src/features/catalog/data.ts`) y `getLinktreeData()`. No consultar Supabase desde páginas. Hoy el catálogo es maqueta (`source: "mock"`); el panel sí escribe en Supabase.
- Datos de contacto: Supabase → `WHATSAPP_NUMBER`/`INSTAGRAM_URL` → demo solo en desarrollo. Sin número, no se muestran botones de WhatsApp. No inventar contacto, precios ni contenido.
- Reglas comerciales fijas: evento nunca muestra precio (solo «Solicitar cotización»); sin carrito ni pagos; cursos sin fechas.

## Next 16 / caché

- `cacheComponents: true`: los datos de petición (cookies) van dentro de `<Suspense>` y tras `await connection()` (patrón en `src/lib/auth/admin.ts`).
- `middleware` se llama aquí **`proxy.ts`** (solo `/admin`).
- Lecturas públicas sin cookies (`src/lib/supabase/public.ts`) pueden usar `"use cache"` + `cacheLife`/`cacheTag`.
- El PDF lee fuentes/imágenes del disco en runtime: si usa un asset nuevo, añadirlo a `outputFileTracingIncludes` en `next.config.ts`.

## Base de datos y pruebas

- Migraciones en `supabase/migrations/` con orden `schema` → `rls` → `storage`; `seed.sql` debe seguir siendo **idempotente** (la suite lo ejecuta dos veces).
- `supabase/tests/rls.test.ts` aplica migraciones y seed sobre PostgreSQL real en memoria (PGlite) simulando `auth`/`storage`. Cualquier cambio de esquema o política debe pasar esa suite.
- **No hay proyecto Supabase real todavía**: login, proxy, consultas y acciones del panel compilan pero no se han probado contra Supabase. No afirmar que están verificados.
- Los tipos TypeScript de la BD aún no existen (se generarán con `supabase gen types`).

## UI y PDF

- Tailwind v4 CSS-first: no hay `tailwind.config`; tokens y `@theme inline` están en `src/app/globals.css`. Usar solo colores del logo y respetar el contraste AA documentado en `docs/design-system.md`.
- PDF editorial en servidor con `@react-pdf/renderer`; fuentes locales `.woff` en `src/features/pdf/fonts/`.
- Imágenes remotas permitidas: solo bucket `site-media` (patrón en `next.config.ts`). Subidas: firma de bytes, 5 MB.
- `/` y `/links` comparten el Linktree; la canónica es `/links`. La temporada se decide por mes en America/Bogota (hoy solo Navidad habilitada).

## Publicación

- `APP_MODE` decide qué se expone (independiente de `NODE_ENV`): `development` = todo; `production` = despliegue del cliente, donde `/catalogo/eventos*` y `/catalogo/velas` dan 404 y sus enlaces del Linktree van a WhatsApp (`src/lib/mode.ts`, `src/features/linktree/delivery.ts`). Si falta, se usa `NODE_ENV`.
- `ENABLE_STAGE_B` y `SITE_INDEXABLE` deben estar **ausentes en Production**; `SEASON_OVERRIDE` se ignora en Production. No tocar ese aislamiento.
- `(etapa-b)` y `/dev/*` responden 404 en producción: no son verificables en el deploy real.
- Docs por tema: `architecture`, `database-schema`, `catalog`, `catalog-pdf`, `admin-panel`, `seasonal-theme-engine`, `design-system`, `deployment`, `implementation-plan`.
