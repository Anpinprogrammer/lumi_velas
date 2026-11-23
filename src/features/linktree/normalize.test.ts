import { describe, expect, it } from "vitest";
import { buildDefaultLinks } from "./defaults";
import { normalizeLinks, settingString, type LinkRow } from "./normalize";

const row = (o: Partial<LinkRow>): LinkRow => ({ id: "1", label: "Hola", description: null, url: "https://x.co", style: "standard", icon: null, image_path: null, ...o });

describe("normalizeLinks (defensa en profundidad)", () => {
  it("descarta destinos inseguros y etiquetas vacías", () => {
    const out = normalizeLinks([row({ url: "javascript:alert(1)" }), row({ id: "2", url: "data:text/html,x" }), row({ id: "3", label: "  " }), row({ id: "4" })], () => null);
    expect(out.map((l) => l.id)).toEqual(["4"]);
  });
  it("estilo desconocido -> standard; icono fuera de la lista -> null", () => {
    const [l] = normalizeLinks([row({ style: "hack", icon: "<script>" })], () => null);
    expect(l.style).toBe("standard");
    expect(l.icon).toBeNull();
  });
  it("conserva estilo e icono válidos y resuelve la imagen", () => {
    const [l] = normalizeLinks([row({ style: "featured", icon: "flame", image_path: "links/a.webp" })], (p) => `/img/${p}`);
    expect([l.style, l.icon, l.imageUrl]).toEqual(["featured", "flame", "/img/links/a.webp"]);
  });
});

describe("settingString", () => {
  it("solo acepta textos no vacíos", () => {
    expect(settingString(" hola ")).toBe("hola");
    expect([settingString(null), settingString(""), settingString(5), settingString({})]).toEqual([null, null, null, null]);
  });
});

describe("buildDefaultLinks", () => {
  it("sin contactos no publica botones de WhatsApp ni Instagram", () => {
    const ids = buildDefaultLinks({ whatsapp: null, instagram: null, email: null }).map((l) => l.id);
    expect(ids).toEqual(["default-catalogo", "default-eventos", "default-velas"]);
  });
  it("con contactos añade cursos, WhatsApp e Instagram con URLs seguras", () => {
    const links = buildDefaultLinks({ whatsapp: "573001112233", instagram: "https://instagram.com/x", email: null });
    expect(links.find((l) => l.id === "default-whatsapp")?.url).toMatch(/^https:\/\/wa\.me\/573001112233\?text=/);
    expect(links.map((l) => l.id)).toContain("default-instagram");
  });
});
