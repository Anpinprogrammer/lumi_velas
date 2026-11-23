import type { Metadata } from "next";
import { Suspense } from "react";
import { LinktreeView } from "@/features/linktree/linktree-view";

// "/" sirve el Linktree en la primera entrega; la versión canónica es /links.
export const metadata: Metadata = { alternates: { canonical: "/links" } };

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LinktreeView />
    </Suspense>
  );
}
