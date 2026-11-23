"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { EmptyState, Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { CANDLE_SORTS, filterCandles, type CandleSort } from "../filter";
import type { CatalogCategory, CatalogProduct } from "../types";
import { ProductGrid } from "./product-grid";

/**
 * Filtro por categoría + orden, en el cliente (la lista completa ya viene prerenderizada).
 * El filtro queda en la URL (?categoria=) para poder compartirla, sin volver al servidor.
 */
export function VelasBrowser({ products, categories }: { products: readonly CatalogProduct[]; categories: readonly CatalogCategory[] }) {
  const [cat, setCat] = useState("todas");
  const [sort, setSort] = useState<CandleSort>("destacadas");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("categoria");
    // Sincroniza con la URL al montar (sistema externo); solo acepta categorías conocidas.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (q && categories.some((c) => c.slug === q)) setCat(q);
  }, [categories]);

  function pick(slug: string) {
    setCat(slug);
    const url = new URL(window.location.href);
    if (slug === "todas") url.searchParams.delete("categoria");
    else url.searchParams.set("categoria", slug);
    window.history.replaceState(null, "", url);
  }

  const individual = products.filter((p) => p.type === "individual");
  const list = filterCandles(products, cat, sort);
  const current = categories.find((c) => c.slug === cat);
  const chips = [{ slug: "todas", name: "Todas" }, ...categories];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filtrar por colección" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {chips.map((c) => {
            const count = c.slug === "todas" ? individual.length : individual.filter((p) => p.categories.includes(c.slug)).length;
            const on = cat === c.slug;
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={on}
                onClick={() => pick(c.slug)}
                className={cn(
                  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-pill border px-4 text-sm transition-colors",
                  on ? "border-sage-600 bg-sage-600 text-ivory" : "border-border bg-surface hover:border-sage-600/60",
                )}
              >
                {c.name}
                <span className={cn("text-xs", on ? "text-ivory/80" : "text-text-muted")}>{count}</span>
              </button>
            );
          })}
        </div>
        <label className="flex shrink-0 items-center gap-3 text-sm text-text-muted">
          Ordenar
          <span className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as CandleSort)}
              className="h-10 appearance-none rounded-pill border border-border bg-surface pl-4 pr-10 text-sm text-text"
            >
              {CANDLE_SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
          </span>
        </label>
      </div>

      <div aria-live="polite" className="min-h-6">
        {current ? (
          <div className="max-w-2xl">
            <p className="eyebrow">Colección</p>
            <h2 className="font-display mt-1 text-[length:var(--text-h3)]">{current.name}</h2>
            <p className="text-text-muted">{current.description}</p>
          </div>
        ) : (
          <p className="text-sm text-text-muted">{list.length} piezas disponibles · Precios en pesos colombianos (COP)</p>
        )}
      </div>

      {list.length ? (
        <ProductGrid products={list} />
      ) : (
        <EmptyState
          title="No hay piezas en esta colección"
          description="Prueba con otra colección o vuelve pronto: estamos creando nuevas velas."
          action={<Button variant="secondary" onClick={() => pick("todas")}>Ver todas</Button>}
        />
      )}
    </div>
  );
}
