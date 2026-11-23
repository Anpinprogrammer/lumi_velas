import type { Catalog, CatalogProduct } from "@/features/catalog/types";

/**
 * Selección y orden de productos para el catálogo PDF. Función pura (sin E/S) para poder probarla.
 *
 * - Solo se eligen productos que existen en `catalog` (el catálogo público ya excluye los ocultos),
 *   así un slug inventado u oculto en la URL nunca aparece en el PDF.
 * - El orden de `slugs` se respeta dentro de cada sección; los duplicados se ignoran.
 * - Sin selección (o si ningún slug es válido) se usa el catálogo completo en su orden por defecto.
 */
export type SectionOrder = "velas-primero" | "eventos-primero";
export const SECTION_ORDERS: readonly SectionOrder[] = ["velas-primero", "eventos-primero"];

export const MAX_SELECTION = 60;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PdfSection = { key: "individual" | "evento"; title: string; eyebrow: string; products: CatalogProduct[] };

export type PdfSelection = {
  sections: PdfSection[];
  /** Slugs elegidos, en el orden final del PDF. */
  slugs: string[];
  /** true si se usa el catálogo completo (sin selección válida). */
  isDefault: boolean;
  sectionOrder: SectionOrder;
};

export function parseSlugList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const s = part.trim().toLowerCase();
    if (s && s.length <= 120 && SLUG.test(s) && !out.includes(s)) out.push(s);
    if (out.length >= MAX_SELECTION) break;
  }
  return out;
}

export function parseSectionOrder(raw: string | null | undefined): SectionOrder {
  return raw === "eventos-primero" ? "eventos-primero" : "velas-primero";
}

export function selectProducts(catalog: Catalog, slugs: readonly string[], sectionOrder: SectionOrder = "velas-primero"): PdfSelection {
  const bySlug = new Map(catalog.products.map((p) => [p.slug, p]));
  const picked = slugs.map((s) => bySlug.get(s)).filter((p): p is CatalogProduct => Boolean(p));
  const isDefault = picked.length === 0;
  const list = isDefault ? [...catalog.products] : picked;

  const velas: PdfSection = { key: "individual", title: "Velas para regalar y regalarte", eyebrow: "Colección", products: list.filter((p) => p.type === "individual") };
  const eventos: PdfSection = { key: "evento", title: "Detalles para tus celebraciones", eyebrow: "Para eventos", products: list.filter((p) => p.type === "evento") };
  const sections = (sectionOrder === "eventos-primero" ? [eventos, velas] : [velas, eventos]).filter((s) => s.products.length > 0);

  return { sections, slugs: sections.flatMap((s) => s.products.map((p) => p.slug)), isDefault, sectionOrder };
}

/** URL relativa del PDF para una selección. Sin selección → el PDF público por defecto. */
export function pdfHref(opts: { slugs?: readonly string[]; sectionOrder?: SectionOrder; download?: boolean } = {}): string {
  const q = new URLSearchParams();
  if (opts.slugs && opts.slugs.length > 0) q.set("productos", opts.slugs.join(","));
  if (opts.sectionOrder && opts.sectionOrder !== "velas-primero") q.set("orden", opts.sectionOrder);
  if (opts.download) q.set("descargar", "1");
  const s = q.toString();
  return s ? `/catalogo/pdf?${s}` : "/catalogo/pdf";
}

/** Agrupa en pares (2 productos por página A4). */
export function pairs<T>(items: readonly T[]): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += 2) out.push(items.slice(i, i + 2));
  return out;
}

/**
 * Mueve `slug` un puesto arriba (-1) o abajo (+1) entre los productos de su MISMO tipo
 * (el PDF agrupa por sección, así que el orden solo importa dentro de cada una).
 */
export function moveWithinType<T extends { slug: string; type: string }>(list: readonly T[], slug: string, delta: -1 | 1): T[] {
  const out = [...list];
  const i = out.findIndex((x) => x.slug === slug);
  if (i < 0) return out;
  for (let j = i + delta; j >= 0 && j < out.length; j += delta) {
    if (out[j].type === out[i].type) {
      [out[i], out[j]] = [out[j], out[i]];
      break;
    }
  }
  return out;
}
