# Arquitectura — Lumi

**Estado:** Fase 2 implementada (estructura, rutas, aislamiento, clientes Supabase, auth del panel, esquema/RLS). Lo que sigue siendo marcador está indicado como tal.

## Stack

Next.js 16 (App Router, Cache Components) · React 19 · TypeScript estricto · Tailwind v4 · Supabase (Postgres, Auth, Storage) · Zod · Vitest. Despliegue en Vercel. Pendientes para sus fases: Motion (Fase 3), React PDF (Fase 6).
> Esta versión de Next renombra `middleware` a **`proxy`** (`src/proxy.ts`). La guía local está en `node_modules/next/dist/docs/`.

## Estructura

```text
src/
├── app/                      # solo rutas y composición
│   ├── page.tsx · links/     # Linktree (hoy marcador)
│   ├── catalogo/             # catálogo público (marcadores; Fase 4)
│   ├── admin/
│   │   ├── login/            # acceso (público)
│   │   └── (panel)/          # TODO lo privado; layout con requireAdmin()
│   ├── (etapa-b)/            # web completa: 404 salvo ENABLE_STAGE_B=true
│   ├── dev/design-system/    # showcase: 404 en producción
│   └── robots.ts · sitemap.ts
├── components/ui/            # sistema de diseño (Fase 1)
├── features/                 # lógica por dominio (linktree hoy; catalog, admin, seasonal después)
├── lib/
│   ├── supabase/             # client · server · proxy (sesión)
│   ├── auth/admin.ts         # getAdminUser · requireAdmin
│   ├── validation/           # zod: URLs seguras, slugs
│   ├── env.ts · stage.ts
└── proxy.ts
supabase/
├── migrations/               # esquema, RLS, storage
├── seed.sql                  # categorías de eventos y ajustes
└── tests/rls.test.ts         # prueba políticas en PostgreSQL real (PGlite)
```
Regla: las rutas importan de `features/` y `components/`; `features/` no importa de `app/`. Componentes de cliente solo cuando hay interacción.

## Rutas

| Ruta | Estado | Notas |
|---|---|---|
| `/` y `/links` | marcador (Fase 3) | Mismo componente. **Canónica: `/links`**. |
| `/catalogo`, `/catalogo/eventos`, `/catalogo/velas` | marcador (Fase 4) | |
| `/catalogo/eventos/[slug]`, `/catalogo/producto/[slug]` | 404 hasta Fase 4 | |
| `/admin/login` | funcional* | |
| `/admin`, `/admin/productos`, `/admin/links`, `/admin/catalogo-pdf` | protegidas; contenido en Fase 5–6 | |
| `/cursos` (y futuras de Etapa B) | **404 en producción** | grupo `(etapa-b)` |
| `/dev/design-system` | **404 en producción** | |

\* El login está implementado pero **no se ha probado contra un proyecto Supabase real** (no hay uno aún). Las políticas y el esquema sí se probaron en PostgreSQL.

### Transición `/` → web completa
`/` y `/links` comparten componente y la canónica ya es `/links`. Cuando el cliente autorice la web completa: (1) `/` pasa a la nueva portada, (2) `/links` sigue sirviendo el Linktree, (3) se actualiza el enlace de la bio de Instagram a `/links`. Hasta ese día no se cambia nada y no hay enlaces rotos.

## Aislamiento de la Etapa B

Cuatro capas, de modo que un error aislado no exponga nada:
1. **Rutas:** todo lo futuro vive en `app/(etapa-b)/`, cuyo layout hace `notFound()` salvo `ENABLE_STAGE_B=true` (`src/lib/stage.ts`, con pruebas).
2. **Configuración:** esa variable no se define en Production de Vercel; solo en Preview/desarrollo. Se resuelve al compilar.
3. **SEO:** `robots.ts` bloquea todo y `sitemap.ts` queda vacío mientras `SITE_INDEXABLE` no sea `true`; la Etapa B va siempre `noindex` y fuera del sitemap.
4. **Despliegue:** el trabajo de Etapa B se integra en ramas/previews; solo `main` va a Production y se revisa cada PR contra `(etapa-b)`.

## Autenticación y autorización

- Supabase Auth (correo + contraseña) con cookies vía `@supabase/ssr`.
- **`proxy.ts`** renueva la sesión y hace un filtro **optimista** (`getClaims`, JWT firmado): sin sesión → `/admin/login`. Marca `/admin` como `no-store` y `noindex`.
- **Control real**: `requireAdmin()` verifica el JWT **y** que exista la fila en `public.admin_users`. Se llama en el layout del panel y debe llamarse en **cada Server Action** (el layout no protege a las acciones).
- **RLS** es la última barrera: aunque se omita un control en la app, la base de datos rechaza escrituras que no sean de administradoras.
- Alta de administradora: crear el usuario en Supabase Auth e insertar su `user_id` en `admin_users` por SQL (no existe API para auto-otorgarse permisos). Se recomienda desactivar el registro abierto (`Enable sign ups`) en Supabase.
- **No existe ni se usa la clave `service_role`.** El navegador y el servidor usan solo la clave pública; todo pasa por RLS.

## Seguridad de enlaces editables

`isSafeLinkUrl` (Zod, app) y un `CHECK` en `linktree_links.url` (base de datos) aceptan solo `https://`, `mailto:`, `tel:` y rutas internas; rechazan `javascript:`, `data:`, `http:` y `//host`. El texto se renderiza siempre como texto de React (nunca HTML). Los iconos son claves de una lista permitida.

## Decisiones

| Decisión | Motivo |
|---|---|
| Sin `service_role` | menor superficie de ataque; RLS suficiente para el MVP |
| Admin por tabla `admin_users` | simple, auditable, sin roles personalizados en JWT |
| `catalogs` bucket privado + ruta de servidor para el PDF (Fase 6) | el público solo descarga la versión publicada |
| Categorías sembradas = 6 de eventos | las "colecciones" del prototipo no están confirmadas |
| Tipos TypeScript de la base de datos se generan con `supabase gen types` en Fase 4 | evita duplicar y desalinear el esquema; hoy no se consulta ninguna tabla desde las páginas |
