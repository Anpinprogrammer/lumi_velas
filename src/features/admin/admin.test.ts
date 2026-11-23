import { describe, expect, it } from "vitest";
import { checkImage, imagePath, MAX_IMAGE_BYTES, sniffImage } from "./images";
import { altTextSchema, fieldErrors, moveId, readLinkForm, readProductForm, uuidSchema } from "./schemas";

const fd = (o: Record<string, string | string[]>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) for (const x of Array.isArray(v) ? v : [v]) f.append(k, x);
  return f;
};
const CAT = "11111111-1111-4111-8111-111111111111";

describe("formulario de enlaces", () => {
  const base = { label: " Catálogo ", description: "", url: "/catalogo", style: "featured", icon: "book-open", isActive: "on" };

  it("acepta un enlace válido y normaliza", () => {
    const r = readLinkForm(fd(base));
    expect(r.success && r.data).toMatchObject({ label: "Catálogo", description: null, url: "/catalogo", style: "featured", icon: "book-open", isActive: true, isFeatured: false });
  });

  it("rechaza destinos inseguros", () => {
    for (const url of ["javascript:alert(1)", "http://x.co", "//evil.com", "data:text/html,x", "/a b"]) {
      const r = readLinkForm(fd({ ...base, url }));
      expect(r.success, url).toBe(false);
      if (!r.success) expect(fieldErrors(r.error).url).toBeTruthy();
    }
  });

  it("rechaza estilo e icono fuera de la lista y texto vacío", () => {
    expect(readLinkForm(fd({ ...base, style: "gigante" })).success).toBe(false);
    expect(readLinkForm(fd({ ...base, icon: "<script>" })).success).toBe(false);
    const r = readLinkForm(fd({ ...base, label: "  " }));
    expect(!r.success && fieldErrors(r.error).label).toBeTruthy();
    expect(readLinkForm(fd({ ...base, icon: "" })).success).toBe(true);
  });
});

describe("formulario de productos", () => {
  const base = { name: "Vela Aurora", slug: "", description: "Cera de soja", type: "individual", price: "35.000", status: "hidden", categoryIds: [CAT] };

  it("genera la dirección desde el nombre y lee el precio con puntos", () => {
    const r = readProductForm(fd(base));
    expect(r.success && r.data).toMatchObject({ slug: "vela-aurora", price: 35000, status: "hidden", isFeatured: false, categoryIds: [CAT] });
  });

  it("un producto de evento nunca lleva precio", () => {
    const r = readProductForm(fd({ ...base, type: "evento", price: "50000" }));
    expect(r.success && r.data.price).toBeNull();
  });

  it("precio vacío es válido; texto o negativos no", () => {
    const empty = readProductForm(fd({ ...base, price: "" }));
    expect(empty.success && empty.data.price).toBeNull();
    for (const price of ["abc", "-5", "12,5", "9999999999"]) expect(readProductForm(fd({ ...base, price })).success, price).toBe(false);
  });

  it("valida dirección, estado, tipo y categorías", () => {
    const bad = readProductForm(fd({ ...base, slug: "Mala Dirección!" }));
    expect(!bad.success && fieldErrors(bad.error).slug).toBeTruthy();
    expect(readProductForm(fd({ ...base, status: "borrador" })).success).toBe(false);
    expect(readProductForm(fd({ ...base, type: "otro" })).success).toBe(false);
    expect(readProductForm(fd({ ...base, categoryIds: ["no-es-uuid"] })).success).toBe(false);
    expect(readProductForm(fd({ ...base, name: " " })).success).toBe(false);
  });
});

describe("utilidades", () => {
  it("ids y texto alternativo", () => {
    expect(uuidSchema.safeParse(CAT).success).toBe(true);
    expect(uuidSchema.safeParse("1; drop table products").success).toBe(false);
    expect(altTextSchema.parse("  ")).toBeNull();
    expect(altTextSchema.safeParse("x".repeat(201)).success).toBe(false);
  });

  it("mueve un elemento sin salirse de los bordes", () => {
    expect(moveId(["a", "b", "c"], "b", -1)).toEqual(["b", "a", "c"]);
    expect(moveId(["a", "b", "c"], "b", 1)).toEqual(["a", "c", "b"]);
    expect(moveId(["a", "b", "c"], "a", -1)).toEqual(["a", "b", "c"]);
    expect(moveId(["a", "b", "c"], "c", 1)).toEqual(["a", "b", "c"]);
    expect(moveId(["a", "b"], "z", 1)).toEqual(["a", "b"]);
  });
});

describe("imágenes subidas", () => {
  const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
  const jpg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0]);
  const webp = Uint8Array.from([..."RIFF"].map((c) => c.charCodeAt(0)).concat([0, 0, 0, 0], [..."WEBP"].map((c) => c.charCodeAt(0))));
  const avif = Uint8Array.from([0, 0, 0, 0x1c, ...[..."ftypavif"].map((c) => c.charCodeAt(0))]);

  it("reconoce formatos por su firma, no por el nombre", () => {
    expect(sniffImage(png)).toBe("png");
    expect(sniffImage(jpg)).toBe("jpeg");
    expect(sniffImage(webp)).toBe("webp");
    expect(sniffImage(avif)).toBe("avif");
    expect(sniffImage(new TextEncoder().encode("<svg onload=alert(1)>"))).toBeNull();
    expect(sniffImage(new TextEncoder().encode("%PDF-1.7 ....."))).toBeNull();
  });

  it("rechaza vacíos, grandes y no imágenes", () => {
    expect(checkImage("a.png", png.length, png)).toEqual({ ok: true, kind: "png" });
    expect(checkImage("a.png", 0, png).ok).toBe(false);
    expect(checkImage("a.png", MAX_IMAGE_BYTES + 1, png).ok).toBe(false);
    expect(checkImage("falsa.png", 20, new TextEncoder().encode("<html></html>")).ok).toBe(false);
  });

  it("arma rutas con nombre aleatorio y extensión según el contenido", () => {
    expect(imagePath("products", CAT, "jpeg", "abc")).toBe(`products/${CAT}/abc.jpg`);
    expect(imagePath("links", CAT, "webp", "abc")).toBe(`links/${CAT}/abc.webp`);
  });
});
