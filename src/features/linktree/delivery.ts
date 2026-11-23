import { buildWhatsAppUrl } from "@/lib/validation/url";
import type { LinkItem } from "./types";

/**
 * En modo production (cliente) las secciones de eventos y velas individuales no existen:
 * cualquier enlace del Linktree que apunte a ellas se convierte en una conversación de
 * WhatsApp. Si no hay número configurado, el enlace se omite (no se publican botones vacíos).
 * El catálogo (`/catalogo`) y sus productos siguen visibles.
 */
const HIDDEN_ROUTES = [
  { path: "/catalogo/eventos", message: "Hola Lumi, quiero cotizar velas para eventos." },
  { path: "/catalogo/velas", message: "Hola Lumi, quiero información sobre las velas individuales." },
] as const;

function hiddenRouteFor(url: string) {
  if (!url.startsWith("/")) return null;
  const path = url.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
  return HIDDEN_ROUTES.find((r) => path === r.path || path.startsWith(`${r.path}/`)) ?? null;
}

export function adaptLinksForProduction(links: readonly LinkItem[], whatsapp: string | null): LinkItem[] {
  const phone = (whatsapp ?? "").replace(/\D/g, "");
  if (!phone) return links.filter((l) => !hiddenRouteFor(l.url));
  return links.map((l) => {
    const route = hiddenRouteFor(l.url);
    return route ? { ...l, url: buildWhatsAppUrl(phone, route.message) } : l;
  });
}
