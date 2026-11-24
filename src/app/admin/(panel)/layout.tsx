import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { LoadingState } from "@/components/ui/states";
import { Container } from "@/components/ui/container";
import { requireAdmin } from "@/lib/auth/admin";
import { signOut } from "./actions";
import { AdminHeader } from "@/features/admin/components/admin-header";

export const metadata: Metadata = { title: "Lumi Studio", robots: { index: false, follow: false } };

async function AdminShell({ children }: { children: ReactNode }) {
  const admin = await requireAdmin(); // control definitivo; el proxy es solo un filtro optimista
  return (
    <>
      <AdminHeader email={admin.email ?? null} signOut={signOut} />
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
