import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { isIndexable } from "@/lib/stage";

/** Solo páginas públicas ya publicadas. Fase 3/4 añadirán catálogo y productos desde Supabase. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  return [{ url: `${getSiteUrl()}/links`, changeFrequency: "weekly", priority: 1 }];
}
