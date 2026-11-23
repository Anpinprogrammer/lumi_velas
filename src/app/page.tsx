import type { Metadata } from "next";
import { LinksPage } from "@/features/linktree/links-page";

// "/" sirve el Linktree en la primera entrega; la versión canónica es /links.
export const metadata: Metadata = { alternates: { canonical: "/links" } };

export default function Home() {
  return <LinksPage />;
}
