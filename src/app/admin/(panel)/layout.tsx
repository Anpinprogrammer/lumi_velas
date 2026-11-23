import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { LoadingState } from "@/components/ui/states";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/auth/admin";
import { signOut } from "./actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Lumi Studio", robots: { index: false, follow: false } };

async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await requireAdmin(); // control definitivo; el proxy es solo un filtro optimista
  return (
    <>
      <header className="border-b border-border bg-surface">
        <Container size="wide" className="flex flex-wrap items-center justify-between gap-3 py-3">
          <nav aria-label="Panel" className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <Link href="/admin" className="font-medium">Resumen</Link>
            <Link href="/admin/productos">Productos</Link>
            <Link href="/admin/links">Enlaces</Link>
            <Link href="/admin/catalogo-pdf">Catálogo PDF</Link>
          </nav>
          <form action={signOut} className="flex items-center gap-3">
            <span className="hidden text-sm text-text-muted sm:inline">{admin.email}</span>
            <Button type="submit" size="sm" variant="ghost">Salir</Button>
          </form>
        </Container>
      </header>
      {children}
    </>
  );
}

export default function PanelLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Container className="py-12"><LoadingState label="Cargando panel…" /></Container>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
