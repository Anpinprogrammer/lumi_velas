import { describe, expect, it } from "vitest";
import { adaptLinksForProduction } from "./delivery";
import type { LinkItem } from "./types";

const link = (o: Partial<LinkItem>): LinkItem => ({
  id: "1",
  label: "Enlace",
  description: null,
  url: "/catalogo",
  style: "standard",
  icon: null,
  imageUrl: null,
  ...o,
});

const urls = (links: LinkItem[]) => Object.fromEntries(links.map((l) => [l.id, l.url]));

describe("adaptLinksForProduction", () => {
  it("manda eventos y velas a WhatsApp; conserva catálogo y productos", () => {
    const out = adaptLinksForProduction(
      [
        link({ id: "catalogo" }),
        link({ id: "eventos", url: "/catalogo/eventos" }),
        link({ id: "velas", url: "/catalogo/velas?categoria=botanica" }),
        link({ id: "producto", url: "/catalogo/producto/aurora" }),
      ],
      "573001112233",
    );
    expect(out.map((l) => l.id)).toEqual(["catalogo", "eventos", "velas", "producto"]);
    const u = urls(out);
    expect(u.catalogo).toBe("/catalogo");
    expect(u.eventos).toMatch(/^https:\/\/wa\.me\/573001112233\?text=/);
    expect(decodeURIComponent(u.eventos)).toContain("cotizar velas para eventos");
    expect(decodeURIComponent(u.velas)).toContain("velas individuales");
    expect(u.producto).toBe("/catalogo/producto/aurora");
  });

  it("también cubre las subrutas de eventos", () => {
    const [l] = adaptLinksForProduction([link({ url: "/catalogo/eventos/matrimonios/" })], "57300");
    expect(l.url).toMatch(/^https:\/\/wa\.me\/57300\?text=/);
  });

  it("sin WhatsApp oculta esos enlaces (no publica botones vacíos)", () => {
    const out = adaptLinksForProduction(
      [
        link({ id: "catalogo" }),
        link({ id: "eventos", url: "/catalogo/eventos" }),
        link({ id: "velas", url: "/catalogo/velas" }),
      ],
      null,
    );
    expect(out.map((l) => l.id)).toEqual(["catalogo"]);
  });

  it("no toca enlaces externos ni otras rutas internas", () => {
    const out = adaptLinksForProduction(
      [link({ id: "web", url: "https://example.com/catalogo/eventos" }), link({ id: "links", url: "/links" })],
      "57300",
    );
    expect(urls(out)).toEqual({ web: "https://example.com/catalogo/eventos", links: "/links" });
  });
});
