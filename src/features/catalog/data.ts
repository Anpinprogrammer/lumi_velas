import { MOCK_CANDLE_CATEGORIES, MOCK_EVENT_CATEGORIES, MOCK_PRODUCTS } from "./mock-data";
import type { Catalog, CatalogCategory, CatalogProduct } from "./types";

/**
 * ÚNICO punto de acceso a los datos del catálogo. Hoy devuelve la maqueta; para conectar Supabase
 * solo cambia esta función (las páginas no saben de dónde vienen los datos). Ver docs/catalog.md.
 */
export function getCatalog(): Catalog {
  return { categories: [...MOCK_EVENT_CATEGORIES, ...MOCK_CANDLE_CATEGORIES], products: MOCK_PRODUCTS, source: "mock" };
}

export function eventCategories(c: Catalog = getCatalog()) {
  return c.categories.filter((x) => x.kind === "evento");
}
export function candleCategories(c: Catalog = getCatalog()) {
  return c.categories.filter((x) => x.kind === "vela");
}
export function findCategory(slug: string, c: Catalog = getCatalog()): CatalogCategory | undefined {
  return c.categories.find((x) => x.slug === slug);
}
export function findProduct(slug: string, c: Catalog = getCatalog()): CatalogProduct | undefined {
  return c.products.find((p) => p.slug === slug);
}
export function productsIn(categorySlug: string, c: Catalog = getCatalog()) {
  return c.products.filter((p) => p.categories.includes(categorySlug));
}
export function featuredProducts(c: Catalog = getCatalog()) {
  return c.products.filter((p) => p.featured);
}
/** Nombre legible de la primera categoría conocida del producto (para la etiqueta de la tarjeta). */
export function primaryCategoryName(p: CatalogProduct, c: Catalog = getCatalog()) {
  for (const s of p.categories) {
    const cat = findCategory(s, c);
    if (cat) return cat.name;
  }
  return p.type === "evento" ? "Eventos" : "Velas";
}

/** Relacionados: mismo tipo y alguna categoría en común; se completa con otros del mismo tipo. Máx. `limit`. */
export function relatedProducts(p: CatalogProduct, limit = 3, c: Catalog = getCatalog()) {
  const same = c.products.filter((x) => x.id !== p.id && x.type === p.type);
  const shared = same.filter((x) => x.categories.some((s) => p.categories.includes(s)));
  const rest = same.filter((x) => !shared.includes(x));
  return [...shared, ...rest].slice(0, limit);
}

export { CANDLE_SORTS, filterCandles, type CandleSort } from "./filter";
