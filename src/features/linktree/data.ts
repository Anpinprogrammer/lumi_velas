import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient, siteMediaUrl } from "@/lib/supabase/public";
import { buildDefaultLinks, DEV_DEMO_SETTINGS } from "./defaults";
import { normalizeLinks, settingString, type LinkRow } from "./normalize";
import type { LinktreeData, LinktreeSettings } from "./types";

export const LINKTREE_CACHE_TAG = "linktree";

/**
 * Enlaces y ajustes públicos del Linktree. Se leen de Supabase (RLS: solo activos / públicos) y se
 * cachean 1 minuto; el panel (Fase 5) llamará a updateTag("linktree") para reflejar cambios al instante,
 * sin redesplegar. Si Supabase no está configurado, falla o no hay enlaces activos, se usan los por defecto.
 */
export async function getLinktreeData(): Promise<LinktreeData> {
  "use cache";
  cacheTag(LINKTREE_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const supabase = createPublicClient();
  if (!supabase) {
    const settings = process.env.NODE_ENV === "production" ? { whatsapp: null, instagram: null, email: null } : DEV_DEMO_SETTINGS;
    return { links: buildDefaultLinks(settings), settings, source: "default" };
  }

  const [linksRes, settingsRes] = await Promise.all([
    supabase.from("linktree_links").select("id,label,description,url,style,icon,image_path").eq("is_active", true).order("sort_order"),
    supabase.from("site_settings").select("key,value").in("key", ["whatsapp_number", "instagram_url", "contact_email"]),
  ]);

  const map = new Map((settingsRes.data ?? []).map((r) => [r.key as string, r.value]));
  const settings: LinktreeSettings = {
    whatsapp: settingString(map.get("whatsapp_number"))?.replace(/\D/g, "") || null,
    instagram: settingString(map.get("instagram_url")),
    email: settingString(map.get("contact_email")),
  };

  const links = linksRes.error ? [] : normalizeLinks((linksRes.data ?? []) as LinkRow[], siteMediaUrl);
  if (links.length === 0) return { links: buildDefaultLinks(settings), settings, source: "default" };
  return { links, settings, source: "supabase" };
}
