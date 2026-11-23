/**
 * Variables de entorno. Las NEXT_PUBLIC_* deben leerse con acceso literal
 * (process.env.NEXT_PUBLIC_X) para que Next.js las incluya en el cliente.
 * NO existe ni se usa la clave service_role: todo el acceso va con la clave
 * pública + RLS (ver docs/architecture.md).
 */
export type SupabasePublicEnv = { url: string; key: string };

export function getSupabaseEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export function requireSupabaseEnv(): SupabasePublicEnv {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copia .env.example a .env.local.",
    );
  }
  return env;
}

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}
