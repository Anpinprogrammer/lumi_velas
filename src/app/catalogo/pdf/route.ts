import type { NextRequest } from "next/server";
import { renderCatalogPdf } from "@/features/pdf/render";
import { parseSectionOrder, parseSlugList } from "@/features/pdf/selection";

/**
 * GET /catalogo/pdf → catálogo PDF.
 *  - Sin parámetros: el PDF público (catálogo completo). Es el que enlaza el catálogo web.
 *  - ?productos=slug1,slug2&orden=eventos-primero → selección y orden (vista previa del generador).
 *  - ?descargar=1 → se descarga en lugar de abrirse en el navegador.
 * Solo incluye productos del catálogo público (nunca ocultos). Ver docs/catalog-pdf.md.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const slugs = parseSlugList(q.get("productos"));
  const pdf = await renderCatalogPdf({ slugs, sectionOrder: parseSectionOrder(q.get("orden")) });
  const name = slugs.length > 0 ? "lumi-catalogo-seleccion.pdf" : "lumi-catalogo.pdf";
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${q.get("descargar") === "1" ? "attachment" : "inline"}; filename="${name}"`,
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
