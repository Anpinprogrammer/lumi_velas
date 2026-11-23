import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = { id: string; email: string | null };

/**
 * Devuelve la administradora autenticada o null. Verifica el JWT (getClaims) y
 * que exista en public.admin_users (la consulta pasa por RLS: solo ve su propia fila).
 */
export const getAdminUser = cache(async (): Promise<AdminUser | null> => {
  await connection(); // dato de petición: nunca se prerenderiza ni se cachea
  if (!getSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;

  const { data: row } = await supabase.from("admin_users").select("user_id").eq("user_id", claims.sub).maybeSingle();
  if (!row) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : null };
});

/** Úsalo al inicio de CADA layout/página privada y de CADA Server Action de /admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");
  return admin;
}
