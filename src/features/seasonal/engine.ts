import { BASE_THEME, SEASON_THEMES } from "./themes";
import type { Month, ResolvedSeason, SeasonTheme } from "./types";

export const SEASON_TIME_ZONE = "America/Bogota";

/** Mes comercial (1–12) en la zona horaria de Colombia, sin depender de la zona del servidor. */
export function getBogotaMonth(date: Date): Month {
  const m = new Intl.DateTimeFormat("en-US", { timeZone: SEASON_TIME_ZONE, month: "numeric" }).format(date);
  return Number(m) as Month;
}

/** Devuelve los errores de configuración (meses repetidos, ids duplicados, meses fuera de rango). */
export function validateThemes(themes: readonly SeasonTheme[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const owner = new Map<number, string>();
  for (const t of themes) {
    if (ids.has(t.id)) errors.push(`id duplicado: ${t.id}`);
    ids.add(t.id);
    for (const m of t.months) {
      if (!Number.isInteger(m) || m < 1 || m > 12) errors.push(`${t.id}: mes inválido ${m}`);
      const prev = owner.get(m);
      if (prev) errors.push(`el mes ${m} está en "${prev}" y en "${t.id}"`);
      owner.set(m, t.id);
    }
    if (t.enabled && !t.palette && t.id !== BASE_THEME.id) errors.push(`${t.id}: habilitado sin palette`);
  }
  return errors;
}

/**
 * Selecciona la ambientación para una fecha. Solo aplica temas `enabled`; si el mes no tiene
 * tema habilitado, devuelve el tema base. `overrideId` sirve para previsualizar (QA/Preview).
 */
export function resolveSeason(date: Date, themes: readonly SeasonTheme[] = SEASON_THEMES, overrideId?: string): ResolvedSeason {
  const month = getBogotaMonth(date);
  let theme: SeasonTheme | undefined;
  if (overrideId) {
    theme = overrideId === BASE_THEME.id ? BASE_THEME : themes.find((t) => t.id === overrideId);
  }
  theme ??= themes.find((t) => t.enabled && t.months.includes(month));
  const resolved = theme ?? BASE_THEME;
  const variant = resolved.monthOverrides?.[month];
  return {
    theme: resolved,
    month,
    intensity: variant?.intensity ?? resolved.intensity,
    message: variant?.message ?? resolved.message,
    seasonal: resolved.id !== BASE_THEME.id,
  };
}
