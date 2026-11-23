import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabaseEnv } from "@/lib/env";

/** Cliente de servidor (Server Components, Server Actions, Route Handlers). Usa las cookies de sesión del visitante. */
export async function createClient() {
  const store = await cookies(); // primero: marca la petición como dinámica
  const { url, key } = requireSupabaseEnv();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: la renovación de sesión la hace proxy.ts.
        }
      },
    },
  });
}
