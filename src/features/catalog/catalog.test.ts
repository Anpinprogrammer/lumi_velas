import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { slugSchema } from "@/lib/validation/slug";
import { buildWhatsAppUrl } from "@/lib/validation/url";
import { filterCandles, getCatalog, relatedProducts } from "./data";
import { formatMonth, productInquiryMessage, quoteMessage, quoteSchema } from "./whatsapp";

const c = getCatalog();
const events = c.categories.filter((x) => x.kind === "evento").map((x) => x.slug);

describe("datos del catálogo (maqueta)", () => {
  it("slugs únicos y con formato válido", () => {
    const slugs = [...c.products.map((p) => p.slug), ...c.categories.map((x) => x.slug)];
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(slugSchema.safeParse(s).success, s).toBe(true);
  });
  it("reglas comerciales: evento sin precio; individual con precio", () => {
    for (const p of c.products) {
      if (p.type === "evento") expect(p.priceCOP, p.slug).toBeNull();
      else expect(p.priceCOP, p.slug).toBeGreaterThan(0);
    }
  });
  it("las categorías de cada producto existen y coinciden con su tipo", () => {
    for (const p of c.products) {
      expect(p.categories.length, p.slug).toBeGreaterThan(0);
      for (const s of p.categories) {
        const cat = c.categories.find((x) => x.slug === s);
        expect(cat, `${p.slug} → ${s}`).toBeDefined();
        expect(cat!.kind).toBe(p.type === "evento" ? "evento" : "vela");
      }
    }
  });
  it("las 6 categorías de evento son las del seed de Supabase", () => {
    expect(events).toEqual(["matrimonios", "bautizos", "cumpleanos", "baby-showers", "empresariales", "otros-eventos"]);
  });
  it("todas las imágenes existen en /public y tienen texto alternativo", () => {
    const imgs = [...c.products.flatMap((p) => p.images), ...c.categories.flatMap((x) => (x.image ? [x.image] : []))];
    for (const i of imgs) {
      expect(existsSync(join(process.cwd(), "public", i.src)), i.src).toBe(true);
      expect(i.alt.length).toBeGreaterThan(3);
    }
  });
});

describe("filtros y relacionados", () => {
  it("filtra solo individuales y ordena por precio de forma estable", () => {
    const asc = filterCandles(c.products, "todas", "precio-asc");
    expect(asc.every((p) => p.type === "individual")).toBe(true);
    expect(asc.map((p) => p.priceCOP)).toEqual([...asc.map((p) => p.priceCOP)].sort((a, b) => a! - b!));
    expect(filterCandles(c.products, "serenidad", "destacadas").every((p) => p.categories.includes("serenidad"))).toBe(true);
    expect(filterCandles(c.products, "no-existe", "destacadas")).toEqual([]);
  });
  it("relacionados: mismo tipo, sin el propio producto", () => {
    for (const p of c.products) {
      const r = relatedProducts(p);
      expect(r.length).toBeLessThanOrEqual(3);
      expect(r.every((x) => x.type === p.type && x.id !== p.id)).toBe(true);
    }
  });
});

describe("mensajes de WhatsApp", () => {
  it("consulta de producto incluye nombre, precio y enlace", () => {
    const m = productInquiryMessage({ name: "Vela Aurora", priceCOP: 35000, type: "individual" }, "https://x.co/p");
    expect(m).toContain("Vela Aurora");
    expect(m).toMatch(/35\.000/);
    expect(m).toContain("https://x.co/p");
  });
  it("valida la cotización", () => {
    const s = quoteSchema(events);
    expect(s.safeParse({ name: "", event: "matrimonios" }).success).toBe(false);
    expect(s.safeParse({ name: "Ana", event: "inventado" }).success).toBe(false);
    expect(s.safeParse({ name: "Ana", event: "matrimonios", quantity: "0" }).success).toBe(false);
    expect(s.safeParse({ name: "Ana", event: "matrimonios", quantity: "-3" }).success).toBe(false);
    expect(s.safeParse({ name: "Ana", event: "matrimonios", month: "2027-13" }).success).toBe(false);
    expect(s.safeParse({ name: "Ana", event: "matrimonios", options: ["Hackeo"] }).success).toBe(false);
    expect(s.safeParse({ name: "Ana", event: "matrimonios", quantity: "80", month: "2027-03", options: ["Colores"] }).success).toBe(true);
  });
  it("arma el mensaje de cotización y el enlace codificado", () => {
    const q = quoteSchema(events).parse({ name: "Ana", event: "matrimonios", month: "2027-03", quantity: "80", options: ["Aromas", "Colores"], idea: "Tonos rosa & verde" });
    const m = quoteMessage(q, "Matrimonios", "Recuerdo Lumi");
    expect(m).toContain("soy Ana");
    expect(m).toContain("• Evento: Matrimonios");
    expect(m).toContain("• Producto de interés: Recuerdo Lumi");
    expect(m).toContain("marzo de 2027");
    expect(m).toContain("• Personalización: Aromas, Colores");
    const url = buildWhatsAppUrl("573001234567", m);
    expect(url.startsWith("https://wa.me/573001234567?text=")).toBe(true);
    expect(url).not.toMatch(/\s/);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(m);
  });
  it("formatMonth no depende de la zona horaria", () => {
    expect(formatMonth("2027-01")).toBe("enero de 2027");
  });
});
