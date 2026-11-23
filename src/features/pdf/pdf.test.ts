import { describe, expect, it } from "vitest";
import { getCatalog } from "@/features/catalog/data";
import type { Catalog } from "@/features/catalog/types";
import { displayUrl, formatPhone, instagramHandle } from "./contact-format";
import { MAX_SELECTION, moveWithinType, pairs, parseSectionOrder, parseSlugList, pdfHref, selectProducts } from "./selection";

const catalog = getCatalog();
const ind = catalog.products.filter((p) => p.type === "individual");
const ev = catalog.products.filter((p) => p.type === "evento");

describe("selección del catálogo PDF", () => {
  it("sin selección usa el catálogo completo, colección primero", () => {
    const s = selectProducts(catalog, []);
    expect(s.isDefault).toBe(true);
    expect(s.sections.map((x) => x.key)).toEqual(["individual", "evento"]);
    expect(s.slugs).toEqual([...ind, ...ev].map((p) => p.slug));
  });

  it("respeta el orden elegido dentro de cada sección e ignora slugs desconocidos y repetidos", () => {
    const pick = [ev[1].slug, "no-existe", ind[2].slug, ind[0].slug, ev[0].slug];
    const s = selectProducts(catalog, parseSlugList([...pick, ind[2].slug].join(",")));
    expect(s.isDefault).toBe(false);
    expect(s.slugs).toEqual([ind[2].slug, ind[0].slug, ev[1].slug, ev[0].slug]);
  });

  it("puede poner eventos primero y omite secciones vacías", () => {
    const s = selectProducts(catalog, [ind[0].slug, ev[0].slug], "eventos-primero");
    expect(s.slugs).toEqual([ev[0].slug, ind[0].slug]);
    expect(selectProducts(catalog, [ev[0].slug]).sections.map((x) => x.key)).toEqual(["evento"]);
  });

  it("nunca incluye productos fuera del catálogo público (ocultos)", () => {
    const visible: Catalog = { ...catalog, products: catalog.products.filter((p) => p.slug !== ind[0].slug) };
    const s = selectProducts(visible, [ind[0].slug, ind[1].slug]);
    expect(s.slugs).toEqual([ind[1].slug]);
    expect(selectProducts(visible, [ind[0].slug]).slugs).not.toContain(ind[0].slug);
  });

  it("valida la lista de la URL", () => {
    expect(parseSlugList(" Vela-Aurora ,../x,<b>,vela-aurora,,caja-ritual")).toEqual(["vela-aurora", "caja-ritual"]);
    expect(parseSlugList(null)).toEqual([]);
    expect(parseSlugList(Array.from({ length: 100 }, (_, i) => `p${i}`).join(","))).toHaveLength(MAX_SELECTION);
    expect(parseSectionOrder("eventos-primero")).toBe("eventos-primero");
    expect(parseSectionOrder("otra")).toBe("velas-primero");
  });

  it("arma la URL del PDF", () => {
    expect(pdfHref()).toBe("/catalogo/pdf");
    expect(pdfHref({ download: true })).toBe("/catalogo/pdf?descargar=1");
    expect(pdfHref({ slugs: ["a", "b"], sectionOrder: "eventos-primero" })).toBe("/catalogo/pdf?productos=a%2Cb&orden=eventos-primero");
  });

  it("mueve solo entre productos del mismo tipo y agrupa de a dos", () => {
    const list = [
      { slug: "a", type: "individual" },
      { slug: "x", type: "evento" },
      { slug: "b", type: "individual" },
    ];
    expect(moveWithinType(list, "b", -1).map((r) => r.slug)).toEqual(["b", "x", "a"]);
    expect(moveWithinType(list, "a", -1).map((r) => r.slug)).toEqual(["a", "x", "b"]);
    expect(moveWithinType(list, "x", 1).map((r) => r.slug)).toEqual(["a", "x", "b"]);
    expect(pairs([1, 2, 3])).toEqual([[1, 2], [3]]);
  });
});

describe("contacto en el PDF", () => {
  it("formatea teléfono, Instagram y URL", () => {
    expect(formatPhone("573001234567")).toBe("+57 300 123 4567");
    expect(formatPhone("15551234567")).toBe("+15551234567");
    expect(instagramHandle("https://www.instagram.com/lumi.velas/")).toBe("@lumi.velas");
    expect(instagramHandle("https://www.instagram.com/")).toBeNull();
    expect(instagramHandle("https://example.com/lumi")).toBeNull();
    expect(displayUrl("https://lumi.co/")).toBe("lumi.co/catalogo");
  });
});
