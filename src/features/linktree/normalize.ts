import { isSafeLinkUrl } from "@/lib/validation/url";
import { isLinkIconKey } from "./icons";
import { LINK_STYLES, type LinkItem, type LinkStyle } from "./types";

export type LinkRow = {
  id: string;
  label: string;
  description: string | null;
  url: string;
  style: string;
  icon: string | null;
  image_path: string | null;
};

/**
 * Defensa en profundidad al LEER: aunque la base ya tiene un CHECK, nunca se renderiza un enlace
 * con destino inseguro, estilo desconocido o icono fuera de la lista permitida.
 * `toImageUrl` convierte una ruta de Storage en URL (o null).
 */
export function normalizeLinks(rows: readonly LinkRow[], toImageUrl: (path: string) => string | null): LinkItem[] {
  const out: LinkItem[] = [];
  for (const r of rows) {
    if (typeof r.label !== "string" || r.label.trim() === "" || !isSafeLinkUrl(r.url)) continue;
    const style = (LINK_STYLES as readonly string[]).includes(r.style) ? (r.style as LinkStyle) : "standard";
    out.push({
      id: r.id,
      label: r.label.trim(),
      description: r.description?.trim() || null,
      url: r.url.trim(),
      style,
      icon: r.icon && isLinkIconKey(r.icon) ? r.icon : null,
      imageUrl: r.image_path ? toImageUrl(r.image_path) : null,
    });
  }
  return out;
}

/** Une los ajustes (jsonb) a texto o null. */
export function settingString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}
