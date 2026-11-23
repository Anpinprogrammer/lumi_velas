import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, isSafeLinkUrl } from "./url";

describe("isSafeLinkUrl", () => {
  it.each([
    "https://instagram.com/lumi",
    "https://wa.me/573001234567?text=Hola",
    "mailto:hola@lumi.co",
    "tel:+573001234567",
    "/catalogo",
    "/links",
  ])("permite %s", (u) => expect(isSafeLinkUrl(u)).toBe(true));

  it.each([
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    " javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "http://inseguro.com",
    "//evil.com/x",
    "https://",
    "https://exa mple.com",
    "/ruta con espacio",
    "",
    "   ",
    "ftp://x.com",
    "https://x.com/\u0000",
  ])("rechaza %j", (u) => expect(isSafeLinkUrl(u)).toBe(false));

  it("rechaza URLs de más de 2048 caracteres", () => {
    expect(isSafeLinkUrl("https://x.com/" + "a".repeat(2100))).toBe(false);
  });
});

describe("buildWhatsAppUrl", () => {
  it("construye el enlace con mensaje codificado", () => {
    expect(buildWhatsAppUrl("+57 300 123 4567", "Hola, quiero cotizar")).toBe(
      "https://wa.me/573001234567?text=Hola%2C%20quiero%20cotizar",
    );
  });
  it("sin número abre wa.me genérico (no inventa un número)", () => {
    expect(buildWhatsAppUrl(null, "Hola")).toBe("https://wa.me/?text=Hola");
  });
});
