import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LinksList } from "@/features/admin/components/lists";
import { listLinks } from "@/features/admin/queries";
import { requireAdmin } from "@/lib/auth/admin";
import { deleteLink, moveLink, toggleLink } from "./actions";

export default async function Page() {
  await requireAdmin();
  const links = await listLinks();
  return (
    <Container size="wide" className="space-y-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Lumi Studio</p>
          <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Enlaces del Linktree</h1>
          <p className="max-w-2xl text-text-muted">Los botones que ve la gente en <code>/links</code>, en este orden. Los cambios se reflejan al instante, sin volver a publicar el sitio.</p>
        </div>
        <Button href="/admin/links/nuevo">Nuevo enlace</Button>
      </header>
      <LinksList links={links} actions={{ toggle: toggleLink, move: moveLink, remove: deleteLink }} />
      <p className="text-sm text-text-muted">Si no hay ningún enlace visible, el Linktree muestra los enlaces por defecto de la marca.</p>
    </Container>
  );
}
