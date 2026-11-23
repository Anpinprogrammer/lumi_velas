import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient, siteMediaUrl } from "@/lib/supabase/public";
import { buildDefaultLinks, DEV_DEMO_SETTINGS, envContactSettings } from "./defaults";
import { normalizeLinks, settingString, type LinkRow } from "./normalize";
import type { LinktreeData, LinktreeSettings } from "./types";

export const LINKTREE_CACHE_TAG = "linktree";

/**
 * Enlaces y ajustes públicos del Linktree. Se leen de Supabase (RLS: solo activos / públicos) y se
 * cachean 1 minuto; el panel (Fase 5) llamará a updateTag("linktree") para reflejar cambios al instante,
 * sin redesplegar. Si Supabase no está configurado, falla o no hay enlaces activos, se usan los por defecto.
 * Contacto: Supabase (site_settings) → variables WHATSAPP_NUMBER / INSTAGRAM_URL → (solo desarrollo) demo.
 */
export function getLinktreeData(): Promise<LinktreeData> {
  // El contacto de las variables de entorno va como argumento: así forma parte de la clave de caché
  // y un cambio de WHATSAPP_NUMBER nunca reutiliza un resultado viejo.
  return loadLinktreeData(envContactSettings());
}

async function loadLinktreeData(env: LinktreeSettings): Promise<LinktreeData> {
  "use cache";
  cacheTag(LINKTREE_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const supabase = createPublicClient();
  if (!supabase) {
    const settings = env.whatsapp || env.instagram || process.env.NODE_ENV === "production" ? env : DEV_DEMO_SETTINGS;
    return { links: buildDefaultLinks(settings), settings, source: "default" };
  }

  const [linksRes, settingsRes] = await Promise.all([
    supabase.from("linktree_links").select("id,label,description,url,style,icon,image_path").eq("is_active", true).order("sort_order"),
    supabase.from("site_settings").select("key,value").in("key", ["whatsapp_number", "instagram_url", "contact_email"]),
  ]);

  const map = new Map((settingsRes.data ?? []).map((r) => [r.key as string, r.value]));
  const settings: LinktreeSettings = {
    whatsapp: settingString(map.get("whatsapp_number"))?.replace(/\D/g, "") || env.whatsapp,
    instagram: settingString(map.get("instagram_url")) ?? env.instagram,
    email: settingString(map.get("contact_email")),
  };

  const links = linksRes.error ? [] : normalizeLinks((linksRes.data ?? []) as LinkRow[], siteMediaUrl);
  if (links.length === 0) return { links: buildDefaultLinks(settings), settings, source: "default" };
  return { links, settings, source: "supabase" };
}
