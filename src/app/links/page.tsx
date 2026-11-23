import type { Metadata } from "next";
import { Suspense } from "react";
import { LinktreeView } from "@/features/linktree/linktree-view";

export const metadata: Metadata = {
  title: "Lumi · Enlaces",
  description: "Pequeños detalles que iluminan grandes momentos. Velas artesanales y recordatorios.",
  alternates: { canonical: "/links" },
};

export default function Links() {
  return (
    <Suspense fallback={null}>
      <LinktreeView />
    </Suspense>
  );
}
