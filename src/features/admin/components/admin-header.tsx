import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { AdminNav } from "./admin-nav";

/** Cabecera del panel: navegación (hamburguesa por debajo de lg) y cierre de sesión. */
export function AdminHeader({ email, signOut }: { email: string | null; signOut: (formData: FormData) => void | Promise<void> }) {
  return (
    <header className="border-b border-border bg-surface">
      <Container size="wide" className="flex items-center justify-between gap-3 py-3">
        <AdminNav />
        <form action={signOut} className="flex items-center gap-3">
          {email ? <span className="hidden text-sm text-text-muted sm:inline">{email}</span> : null}
          <Button type="submit" size="sm" variant="ghost" className="h-11 lg:h-9">Salir</Button>
        </form>
      </Container>
    </header>
  );
}
