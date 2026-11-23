import { z } from "zod";

/**
 * Destinos permitidos para enlaces editables (Linktree).
 * Permitido: https://, mailto:, tel: y rutas internas ("/algo").
 * Rechazado: javascript:, data:, http:, vbscript:, "//host" (protocol-relative), espacios/control.
 * Espeja la restricción CHECK de la tabla linktree_links.
 */
export function isSafeLinkUrl(value: string): boolean {
  const v = value.trim();
  if (v.length === 0 || v.length > 2048) return false;
  if (/[\u0000-\u001f\u007f\s]/.test(v)) return false;
  if (v.startsWith("//")) return false;
  if (v.startsWith("/")) return true;
  try {
    const u = new URL(v);
    if (u.protocol === "https:") return u.hostname.length > 0;
    if (u.protocol === "mailto:" || u.protocol === "tel:") return v.length > u.protocol.length;
    return false;
  } catch {
    return false;
  }
}

export const safeLinkUrlSchema = z
  .string()
  .trim()
  .refine(isSafeLinkUrl, "Solo se permiten enlaces https, mailto, tel o rutas internas.");

/** Enlace de WhatsApp con mensaje contextual. `phone` en formato internacional sin "+" (p. ej. 573001234567). */
export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
