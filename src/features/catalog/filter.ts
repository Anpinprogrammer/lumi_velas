import type { CatalogProduct } from "./types";

export type CandleSort = "destacadas" | "precio-asc" | "precio-desc";
export const CANDLE_SORTS: ReadonlyArray<{ value: CandleSort; label: string }> = [
  { value: "destacadas", label: "Destacadas" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

/** Filtra y ordena velas individuales. `category` = "todas" o un slug. Orden estable. */
export function filterCandles(products: readonly CatalogProduct[], category: string, sort: CandleSort) {
  const list = products.filter((p) => p.type === "individual" && (category === "todas" || p.categories.includes(category)));
  const price = (p: CatalogProduct) => p.priceCOP ?? Number.MAX_SAFE_INTEGER;
  const indexed = list.map((p, i) => ({ p, i }));
  indexed.sort((a, b) => {
    if (sort === "precio-asc") return price(a.p) - price(b.p) || a.i - b.i;
    if (sort === "precio-desc") return price(b.p) - price(a.p) || a.i - b.i;
    return Number(b.p.featured) - Number(a.p.featured) || a.i - b.i;
  });
  return indexed.map((x) => x.p);
}
