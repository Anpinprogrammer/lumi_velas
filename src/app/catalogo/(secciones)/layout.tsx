import type { ReactNode } from "react";
import { CatalogFooter, CatalogHeader } from "@/features/catalog/components/catalog-header";
import { getCatalog } from "@/features/catalog/data";

export default function CatalogoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <CatalogHeader />
      <main id="contenido">{children}</main>
      <CatalogFooter mock={getCatalog().source === "mock"} />
    </>
  );
}
