import type { Metadata } from "next";
import { LinksPage } from "@/features/linktree/links-page";

export const metadata: Metadata = {
  title: "Lumi · Enlaces",
  alternates: { canonical: "/links" },
};

export default function Links() {
  return <LinksPage />;
}
