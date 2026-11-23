import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Solo actúa sobre /admin. Filtro optimista: sin sesión -> /admin/login.
 * El control definitivo está en requireAdmin() (src/lib/auth/admin.ts) y en RLS.
 */
export async function proxy(request: NextRequest) {
  const { response, authenticated } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isLogin = pathname === "/admin/login";
  if (!authenticated && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  // Las páginas privadas nunca se cachean en CDN/navegador compartido.
  response.headers.set("Cache-Control", "private, no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
