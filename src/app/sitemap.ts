import type { MetadataRoute } from "next";
import { eventCategories, getCatalog } from "@/features/catalog/data";
import { getSiteUrl } from "@/lib/env";
import { isProductionMode } from "@/lib/mode";
import { isIndexable } from "@/lib/stage";

/** Solo páginas públicas de la Etapa A. Vacío mientras el sitio no sea indexable. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  const base = getSiteUrl();
  const productionMode = isProductionMode();
  return [
    { url: `${base}/links`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/catalogo`, changeFrequency: "weekly", priority: 0.9 },
    // En producción estas secciones no existen (404): no se anuncian.
    ...(productionMode
      ? []
      : [
          { url: `${base}/catalogo/eventos`, changeFrequency: "weekly" as const, priority: 0.8 },
          { url: `${base}/catalogo/velas`, changeFrequency: "weekly" as const, priority: 0.8 },
          ...eventCategories().map((c) => ({ url: `${base}/catalogo/eventos/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
        ]),
    ...getCatalog().products.map((p) => ({ url: `${base}/catalogo/producto/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
