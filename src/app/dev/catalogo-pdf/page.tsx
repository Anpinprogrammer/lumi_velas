import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { PdfWorkspace } from "@/features/pdf/components/pdf-workspace";

export const metadata: Metadata = { title: "Catálogo PDF (desarrollo) · Lumi", robots: { index: false, follow: false } };

/**
 * Copia del generador del panel para verlo sin Supabase (el panel exige sesión).
 * Solo existe en desarrollo, o en producción con NEXT_PUBLIC_SHOW_DESIGN_SYSTEM=true (como /dev/design-system).
 */
export default function Page() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_DESIGN_SYSTEM !== "true") notFound();
  return (
    <Container size="wide" className="py-10">
      <PdfWorkspace />
    </Container>
  );
}
