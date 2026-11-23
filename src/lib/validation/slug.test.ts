import { describe, expect, it } from "vitest";
import { slugify, slugSchema } from "./slug";

describe("slug", () => {
  it("slugify quita tildes y símbolos", () => expect(slugify("Vela Lavanda & Lino ñ")).toBe("vela-lavanda-lino-n"));
  it("slugify nunca devuelve vacío", () => expect(slugify("¡¡¡")).toBe("producto"));
  it("slugSchema acepta y rechaza", () => {
    expect(slugSchema.safeParse("vela-aurora").success).toBe(true);
    expect(slugSchema.safeParse("Vela Aurora").success).toBe(false);
    expect(slugSchema.safeParse("-x").success).toBe(false);
  });
});
