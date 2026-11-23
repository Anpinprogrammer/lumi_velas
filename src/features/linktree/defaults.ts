import { buildWhatsAppUrl } from "@/lib/validation/url";
import { MOCK_MEDIA } from "./mock-media";
import type { LinkItem, LinktreeSettings } from "./types";

/**
 * Enlaces por defecto: se usan SOLO cuando Supabase no está configurado o no tiene enlaces activos,
 * para que la página nunca quede vacía. Son contenido de marca, no datos de usuarios.
 * Los enlaces que dependen de un contacto (WhatsApp, Instagram) se omiten si ese dato no existe:
 * no se publican botones que no llevan a ningún lado.
 */
export function buildDefaultLinks(settings: LinktreeSettings): LinkItem[] {
  const links: LinkItem[] = [
    { id: "default-catalogo", label: "Explorar catálogo", description: "Velas y detalles hechos a mano", url: "/catalogo", style: "featured", icon: "book-open", imageUrl: MOCK_MEDIA.catalogo },
    { id: "default-eventos", label: "Cotizar velas para eventos", description: "Matrimonios, bautizos, cumpleaños y más", url: "/catalogo/eventos", style: "image", icon: "sparkles", imageUrl: MOCK_MEDIA.eventos },
    { id: "default-velas", label: "Velas individuales", description: "Para regalar o regalarte un momento", url: "/catalogo/velas", style: "standard", icon: "flame", imageUrl: null },
  ];
  if (settings.whatsapp) {
    links.push({
      id: "default-cursos",
      label: "Cursos y talleres",
      description: "Pregúntanos por los próximos talleres",
      url: buildWhatsAppUrl(settings.whatsapp, "Hola Lumi, quiero información sobre los cursos y talleres."),
      style: "standard",
      icon: "graduation-cap",
      imageUrl: null,
    });
    links.push({
      id: "default-whatsapp",
      label: "WhatsApp",
      description: null,
      url: buildWhatsAppUrl(settings.whatsapp, "Hola Lumi, quiero más información."),
      style: "compact",
      icon: "message-circle",
      imageUrl: null,
    });
  }
  if (settings.instagram) {
    links.push({ id: "default-instagram", label: "Instagram", description: null, url: settings.instagram, style: "compact", icon: "instagram", imageUrl: null });
  }
  return links;
}

/** Solo en desarrollo y sin Supabase: contactos de DEMOSTRACIÓN para poder evaluar el diseño. Nunca en producción. */
export const DEV_DEMO_SETTINGS: LinktreeSettings = {
  whatsapp: "573000000000",
  instagram: "https://www.instagram.com/",
  email: null,
};
