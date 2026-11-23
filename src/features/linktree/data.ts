import { cacheLife, cacheTag } from "next/cache";
import { isProductionMode } from "@/lib/mode";
import { createPublicClient, siteMediaUrl } from "@/lib/supabase/public";
import { buildDefaultLinks, DEV_DEMO_SETTINGS, envContactSettings } from "./defaults";
import { adaptLinksForProduction } from "./delivery";
import { normalizeLinks, settingString, type LinkRow } from "./normalize";
import type { LinkItem, LinktreeData, LinktreeSettings } from "./types";

export const LINKTREE_CACHE_TAG = "linktree";

/**
 * Enlaces y ajustes públicos del Linktree. Se leen de Supabase (RLS: solo activos / públicos) y se
 * cachean 1 minuto; el panel (Fase 5) llamará a updateTag("linktree") para reflejar cambios al instante,
 * sin redesplegar. Si Supabase no está configurado, falla o no hay enlaces activos, se usan los por defecto.
 * Contacto: Supabase (site_settings) → variables WHATSAPP_NUMBER / INSTAGRAM_URL → (solo desarrollo) demo.
 */
export function getLinktreeData(): Promise<LinktreeData> {
  // El contacto de las variables de entorno y el modo van como argumentos: así forman parte de la
  // clave de caché y un cambio de WHATSAPP_NUMBER o de APP_MODE nunca reutiliza un resultado viejo.
  return loadLinktreeData(envContactSettings(), isProductionMode());
}

async function loadLinktreeData(env: LinktreeSettings, production: boolean): Promise<LinktreeData> {
  "use cache";
  cacheTag(LINKTREE_CACHE_TAG);
  cacheLife({ stale: 60, revalidate: 60, expire: 3600 });

  const finish = (links: LinkItem[], settings: LinktreeSettings, source: LinktreeData["source"]): LinktreeData => ({
    links: production ? adaptLinksForProduction(links, settings.whatsapp) : links,
    settings,
    source,
  });

  const supabase = createPublicClient();
  if (!supabase) {
    const settings = env.whatsapp || env.instagram || process.env.NODE_ENV === "production" ? env : DEV_DEMO_SETTINGS;
    return finish(buildDefaultLinks(settings), settings, "default");
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
  if (links.length === 0) return finish(buildDefaultLinks(settings), settings, "default");
  return finish(links, settings, "supabase");
}
