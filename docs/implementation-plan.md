# Plan de implementación

| Fase | Estado | Contenido |
|---|---|---|
| 0 Auditoría | ✅ | Informe de prototipo, logo y recursos |
| 1 Sistema de diseño | ✅ fusionada (PR #1) | Tokens, 17 componentes, showcase. **Tipografías provisionales** |
| 2 Arquitectura | ✅ fusionada (PR #2) | Estructura, rutas, aislamiento Etapa B, clientes Supabase, auth del panel, esquema + RLS + Storage, pruebas |
| 3 Linktree | ✅ fusionada (PR #3, ajuste de logo PR #4) | Lumi Experience, enlaces dinámicos, `SeasonalThemeEngine`, temporada navideña (con **fotos mockup**) |
| 4 Catálogo | ✅ maqueta en revisión | Listados, categorías, detalle, WhatsApp y cotización con **datos de muestra**; la conexión a Supabase queda para cuando el cliente entregue fotos y textos (ver `docs/catalog.md`) |
| 5 Administración | ✅ en revisión (sin probar con Supabase real) | Dashboard, enlaces, productos e imágenes con validación en servidor (ver `docs/admin-panel.md`). Pendiente: ajustes de contacto, categorías y conectar el catálogo público |
| 6 PDF | ✅ en revisión (sin backend) | Plantilla editorial A4, descarga pública y generador (selección, orden, vista previa). **Versiones y publicación esperan a Supabase** (ver `docs/catalog-pdf.md`) |
| 7 Calidad y despliegue | pendiente | Accesibilidad, SEO, rendimiento, seguridad, producción |
| 8 Web completa | interna | Solo tras autorización del cliente |

## Para cerrar la Fase 2 con el cliente (acciones de Andres)
1. Crear el proyecto Supabase y aplicar `supabase/migrations/*` y `seed.sql`.
2. Crear la usuaria administradora y registrarla en `admin_users`; desactivar el registro abierto.
3. Cargar variables en Vercel (ver `docs/deployment.md`) y confirmar que `ENABLE_STAGE_B` y `SITE_INDEXABLE` **no** están en Production.
4. Validar tipografías del logo y entregar SVG del logo (pendientes de Fase 1).
5. Facilitar el número de WhatsApp oficial y las fotografías reales.

## Riesgos conocidos
- Login y proxy no probados con Supabase real → se verifican en el paso 1–2.
- Next 16 con Cache Components: los datos por petición (cookies) deben ir dentro de `Suspense`; patrón ya aplicado en el panel.
