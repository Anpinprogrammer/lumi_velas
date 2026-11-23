import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";

/**
 * Cliente público SIN cookies ni sesión: solo para lecturas anónimas (lo que RLS ya permite ver a cualquiera).
 * Al no depender de la petición, sus resultados se pueden cachear con "use cache".
 */
export function createPublicClient() {
  const env = getSupabaseEnv();
  if (!env) return null;
  return createClient(env.url, env.key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** URL pública de un archivo del bucket `site-media`. */
export function siteMediaUrl(path: string): string | null {
  const env = getSupabaseEnv();
  if (!env || path.includes("..") || path.startsWith("/")) return null;
  return `${env.url.replace(/\/$/, "")}/storage/v1/object/public/site-media/${path.split("/").map(encodeURIComponent).join("/")}`;
}
