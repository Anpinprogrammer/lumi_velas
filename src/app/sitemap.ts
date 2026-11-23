import type { MetadataRoute } from "next";
import { eventCategories, getCatalog } from "@/features/catalog/data";
import { getSiteUrl } from "@/lib/env";
import { isIndexable } from "@/lib/stage";

/** Solo páginas públicas de la Etapa A. Vacío mientras el sitio no sea indexable. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  const base = getSiteUrl();
  return [
    { url: `${base}/links`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/catalogo/eventos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/catalogo/velas`, changeFrequency: "weekly", priority: 0.8 },
    ...eventCategories().map((c) => ({ url: `${base}/catalogo/eventos/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...getCatalog().products.map((p) => ({ url: `${base}/catalogo/producto/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
