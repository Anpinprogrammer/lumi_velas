import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

/**
 * Renueva la sesión de Supabase y devuelve la respuesta con las cookies actualizadas.
 * `authenticated` es una verificación OPTIMISTA (JWT firmado válido): sirve para redirigir.
 * La autorización real (¿es administradora?) se hace en el servidor con requireAdmin().
 */
export async function updateSession(request: NextRequest): Promise<{ response: NextResponse; authenticated: boolean }> {
  let response = NextResponse.next({ request });
  const env = getSupabaseEnv();
  if (!env) return { response, authenticated: false };

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  return { response, authenticated: Boolean(data?.claims?.sub) };
}
