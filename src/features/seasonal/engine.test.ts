import { describe, expect, it } from "vitest";
import { getBogotaMonth, resolveSeason, validateThemes } from "./engine";
import { BASE_THEME, SEASON_THEMES } from "./themes";
import type { SeasonTheme } from "./types";

describe("getBogotaMonth (America/Bogota, UTC-5)", () => {
  it("usa la hora de Bogotá, no la de UTC", () => {
    // 1 dic 00:30 UTC = 30 nov 19:30 en Bogotá
    expect(getBogotaMonth(new Date("2026-12-01T00:30:00Z"))).toBe(11);
    // 1 ene 04:30 UTC = 31 dic 23:30 en Bogotá
    expect(getBogotaMonth(new Date("2027-01-01T04:30:00Z"))).toBe(12);
    // 1 ene 05:00 UTC = 1 ene 00:00 en Bogotá
    expect(getBogotaMonth(new Date("2027-01-01T05:00:00Z"))).toBe(1);
  });
});

describe("resolveSeason", () => {
  it("noviembre y diciembre -> navidad, con intensidad distinta", () => {
    const nov = resolveSeason(new Date("2026-11-23T12:00:00-05:00"));
    const dic = resolveSeason(new Date("2026-12-15T12:00:00-05:00"));
    expect(nov.theme.id).toBe("navidad");
    expect(dic.theme.id).toBe("navidad");
    expect(nov.intensity).toBe("low");
    expect(dic.intensity).toBe("high");
    expect(dic.message?.badge).toBe("Navidad Lumi");
    expect(nov.seasonal && dic.seasonal).toBe(true);
  });
  it("el cambio ocurre a medianoche de Bogotá, no de UTC", () => {
    expect(resolveSeason(new Date("2026-11-01T04:59:00Z")).month).toBe(10); // 31 oct 23:59 Bogotá
    expect(resolveSeason(new Date("2026-11-01T05:00:00Z")).theme.id).toBe("navidad");
  });
  it("meses sin tema habilitado usan el tema base", () => {
    for (const d of ["2026-01-15", "2026-03-10", "2026-07-20", "2026-10-31"]) {
      const r = resolveSeason(new Date(`${d}T12:00:00-05:00`));
      expect(r.theme).toBe(BASE_THEME);
      expect(r.seasonal).toBe(false);
    }
  });
  it("un tema deshabilitado nunca se aplica", () => {
    expect(resolveSeason(new Date("2026-02-14T12:00:00-05:00")).theme.id).toBe("base");
  });
  it("overrideId permite previsualizar y volver al base", () => {
    expect(resolveSeason(new Date("2026-03-10T12:00:00-05:00"), SEASON_THEMES, "navidad").theme.id).toBe("navidad");
    expect(resolveSeason(new Date("2026-12-10T12:00:00-05:00"), SEASON_THEMES, "base").seasonal).toBe(false);
    expect(resolveSeason(new Date("2026-12-10T12:00:00-05:00"), SEASON_THEMES, "no-existe").theme.id).toBe("navidad");
  });
});

describe("configuración de temporadas", () => {
  it("es válida y cubre los 12 meses", () => {
    expect(validateThemes(SEASON_THEMES)).toEqual([]);
    const covered = new Set(SEASON_THEMES.flatMap((t) => [...t.months]));
    expect([...covered].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
  it("detecta meses repetidos, ids duplicados y habilitados sin palette", () => {
    const bad = [
      { ...SEASON_THEMES[0], id: "a", months: [1], enabled: true },
      { ...SEASON_THEMES[1], id: "a", months: [1, 13 as never] },
    ];
    const errs = validateThemes(bad as unknown as SeasonTheme[]);
    expect(errs.some((e) => e.includes("duplicado"))).toBe(true);
    expect(errs.some((e) => e.includes("está en"))).toBe(true);
    expect(errs.some((e) => e.includes("inválido"))).toBe(true);
    expect(errs.some((e) => e.includes("sin palette"))).toBe(true);
  });
});
