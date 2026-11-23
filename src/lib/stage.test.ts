import { describe, expect, it } from "vitest";
import { isIndexable, isStageBEnabled } from "./stage";

describe("aislamiento de la Etapa B", () => {
  it("está apagada por defecto", () => expect(isStageBEnabled({})).toBe(false));
  it.each(["1", "True", "yes", "", "false"])("no se activa con %j", (v) => expect(isStageBEnabled({ ENABLE_STAGE_B: v })).toBe(false));
  it("solo se activa con 'true' exacto", () => expect(isStageBEnabled({ ENABLE_STAGE_B: "true" })).toBe(true));
});

describe("indexación", () => {
  it("está apagada por defecto", () => expect(isIndexable({})).toBe(false));
  it("solo con SITE_INDEXABLE='true'", () => expect(isIndexable({ SITE_INDEXABLE: "true" })).toBe(true));
});
