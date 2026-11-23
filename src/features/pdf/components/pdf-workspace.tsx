import Link from "next/link";
import { getCatalog, primaryCategoryName } from "@/features/catalog/data";
import { pdfHref } from "../selection";
import { PdfBuilder, type BuilderItem } from "./pdf-builder";

/** Pantalla del generador (la usan /admin/catalogo-pdf y la vista de desarrollo /dev/catalogo-pdf). */
export function PdfWorkspace() {
  const catalog = getCatalog();
  const items: BuilderItem[] = catalog.products.map((p) => ({
    slug: p.slug,
    name: p.name,
    type: p.type,
    categoryName: primaryCategoryName(p, catalog),
    priceCOP: p.priceCOP,
    image: p.images[0]?.src ?? null,
  }));
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="eyebrow">Lumi Studio</p>
        <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Catálogo PDF</h1>
        <p className="max-w-2xl text-text-muted">
          Elige qué productos van en el PDF y en qué orden, revisa la vista previa y descárgalo. El PDF siempre incluye portada, presentación de
          marca, eventos, contacto y el enlace al catálogo en línea.
        </p>
        <div className="max-w-2xl rounded-2xl border border-border bg-cream-100 p-4 text-sm">
          <p>
            <strong>PDF público:</strong> el botón «Descargar PDF» del catálogo web entrega siempre el{" "}
            <Link href={pdfHref()} target="_blank" className="underline underline-offset-4">catálogo completo</Link>, generado con los productos visibles.
          </p>
          <p className="mt-2 text-text-muted">
            Guardar versiones y elegir cuál se publica queda listo cuando se conecte Supabase (hoy el catálogo es una maqueta). Ninguna versión
            reemplazará al PDF publicado sin que lo confirmes.
          </p>
        </div>
      </header>
      <PdfBuilder items={items} />
    </div>
  );
}
