import type { Metadata } from "next";
import { getContact } from "@/features/catalog/components/contact";
import { Lookbook } from "@/features/catalog/components/lookbook";
import { eventCategories, getCatalog, primaryCategoryName } from "@/features/catalog/data";
import { pdfHref } from "@/features/pdf/selection";
import { getSiteUrl } from "@/lib/env";
import { isProductionMode } from "@/lib/mode";

export const metadata: Metadata = {
  title: "Catálogo · Lumi",
  description: "Catálogo de colección de Lumi: velas artesanales y recordatorios para eventos.",
  alternates: { canonical: "/catalogo" },
};

/** Catálogo web en modo slider (estructura aprobada en el prototipo, vista #catalogo). */
export default async function Catalogo() {
  const { whatsapp } = await getContact();
  const catalog = getCatalog();
  const items = catalog.products.map((p) => ({ ...p, categoryName: primaryCategoryName(p, catalog) }));
  return (
    <main>
      <Lookbook
        items={items}
        events={eventCategories(catalog).map(({ slug, name }) => ({ slug, name }))}
        whatsapp={whatsapp}
        siteUrl={getSiteUrl()}
        coverImage="/mock/mock-catalogo.webp"
        pdfUrl={pdfHref({ download: true })}
        showEventsLink={!isProductionMode()}
      />
    </main>
  );
}
