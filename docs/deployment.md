# Despliegue

## Variables de entorno (Vercel)

| Variable | Production | Preview | Notas |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | ✅ | clave pública (la protege RLS) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | ✅ | dominio final; usada en canónicas y sitemap |
| `APP_MODE` | `production` | `development` | `production` = solo lo pagado: `/catalogo/eventos` y `/catalogo/velas` dan 404 y sus enlaces del Linktree van a WhatsApp. Si falta, se usa `NODE_ENV` |
| `SITE_INDEXABLE` | ❌ hasta autorizar | ❌ | `true` activa robots/sitemap |
| `ENABLE_STAGE_B` | ❌ **nunca** | opcional | expone la web completa |
| `SEASON_OVERRIDE` | ❌ (se ignora) | opcional | fuerza `navidad`/`base` para previsualizar |

No existe `service_role`: no la agregues.

## Supabase
1. Crear el proyecto (región cercana a Colombia).
2. Ejecutar en orden `supabase/migrations/*.sql` y luego `supabase/seed.sql` (SQL Editor o CLI).
3. Auth → desactivar *Enable sign ups*; crear la usuaria administradora; insertar su id: `insert into public.admin_users (user_id) values ('<uuid>');`
4. Auth → URL Configuration: añadir el dominio del sitio.
5. **Verificación manual de RLS** con la clave pública: sin sesión, leer `products` solo devuelve publicados; con sesión de no-administradora, un `insert` falla.

## Antes de publicar
- `npm run lint`, `npx tsc --noEmit`, `npm test` y `npm run build` en verde.
- Comprobar en el despliegue: `/cursos` y `/dev/design-system` → 404; `/admin` → redirige a login; `/robots.txt` bloquea todo mientras `SITE_INDEXABLE` no sea `true`; con `APP_MODE=production`, `/catalogo/eventos` y `/catalogo/velas` → 404 y el Linktree no enlaza a ellas.
- La checklist completa de la Fase 7 (accesibilidad, rendimiento, SEO) aún está pendiente.
