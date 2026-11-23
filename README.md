# Lumi · Velas · Recordatorios

Ecosistema digital de Lumi (Linktree, catálogo y panel). Next.js (App Router) + TypeScript estricto + Tailwind v4.

**Estado:** Fase 2 — arquitectura (en revisión). Ver [`docs/architecture.md`](docs/architecture.md), [`docs/database-schema.md`](docs/database-schema.md) y [`docs/design-system.md`](docs/design-system.md).

```bash
npm install
npm run dev     # http://localhost:3000 · showcase en /dev/design-system
npm run lint
npm test        # validaciones, aislamiento de Etapa B y políticas RLS (PostgreSQL en memoria)
npm run build
```

Copia `.env.example` a `.env.local` para conectar Supabase. Detalles en [`docs/deployment.md`](docs/deployment.md).
