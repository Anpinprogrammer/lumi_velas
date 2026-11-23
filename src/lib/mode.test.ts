import { describe, expect, it } from "vitest";
import { getAppMode, isProductionMode } from "./mode";

describe("modo de entrega (APP_MODE)", () => {
  it("sin variable sigue NODE_ENV (local development, deploy production)", () => {
    expect(getAppMode({})).toBe("development");
    expect(getAppMode({ NODE_ENV: "development" })).toBe("development");
    expect(getAppMode({ NODE_ENV: "production" })).toBe("production");
  });
  it("development explícito abre el sitio completo incluso en un build", () => {
    expect(getAppMode({ APP_MODE: "development", NODE_ENV: "production" })).toBe("development");
    expect(isProductionMode({ APP_MODE: "development" })).toBe(false);
  });
  it("production explícito oculta lo no pagado en local", () => {
    expect(getAppMode({ APP_MODE: "production", NODE_ENV: "development" })).toBe("production");
    expect(isProductionMode({ APP_MODE: "production" })).toBe(true);
  });
  it("valores desconocidos o con otra capitalización -> NODE_ENV", () => {
    expect(isProductionMode({ APP_MODE: "Development", NODE_ENV: "production" })).toBe(true);
    expect(isProductionMode({ APP_MODE: "preview", NODE_ENV: "development" })).toBe(false);
  });
});
