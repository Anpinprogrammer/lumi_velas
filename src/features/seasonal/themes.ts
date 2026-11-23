import type { SeasonPalette, SeasonTheme } from "./types";

/** Paleta de marca (tema base). Los temas estacionales la sobrescriben solo en esta capa de página. */
export const BASE_PALETTE: SeasonPalette = {
  bg: "#FBF7F0",
  text: "#452E23",
  textMuted: "rgb(69 46 35 / 0.78)",
  accent: "#A84F3F",
  glow: "rgb(210 138 66 / 0.22)",
  surface: "#FEF5F1",
  onSurface: "#452E23",
};

/** Tema base: la identidad de marca sin decoración estacional. */
export const BASE_THEME: SeasonTheme = {
  id: "base",
  name: "Lumi",
  concept: "Identidad de marca sin ambientación estacional.",
  months: [],
  enabled: true,
  decor: [],
  animation: "none",
  intensity: "low",
  heroImage: "/mock/mock-velas.webp", // MOCKUP hasta tener fotos reales
};

/**
 * Calendario visual (propuestas creativas editables, no festividades oficiales).
 * Solo `navidad` está implementada en la Fase 3; el resto está definida pero deshabilitada.
 * Para activar un mes: implementar sus decoraciones, completar `palette` y poner enabled: true.
 * Regla: ningún mes puede pertenecer a dos temas (lo valida validateThemes y la suite de pruebas).
 */
export const SEASON_THEMES: readonly SeasonTheme[] = [
  { id: "nuevos-comienzos", name: "Nuevos comienzos", concept: "Destellos dorados suaves", months: [1], enabled: false, decor: ["sparkles"], animation: "twinkle", intensity: "low" },
  { id: "amor-y-amistad", name: "Amor y amistad", concept: "Corazones delicados y luces cálidas", months: [2], enabled: false, decor: ["hearts", "lights"], animation: "float", intensity: "low" },
  { id: "mujer", name: "Celebración de la mujer", concept: "Pétalos florales flotantes", months: [3], enabled: false, decor: ["petals"], animation: "drift", intensity: "low" },
  { id: "primavera", name: "Primavera artesanal", concept: "Flores y partículas orgánicas", months: [4], enabled: false, decor: ["petals", "sparkles"], animation: "drift", intensity: "low" },
  { id: "madre", name: "Día de la Madre", concept: "Pétalos y detalles florales", months: [5], enabled: false, decor: ["petals"], animation: "drift", intensity: "medium" },
  { id: "familia", name: "Celebraciones familiares", concept: "Luces y elementos festivos", months: [6], enabled: false, decor: ["lights", "sparkles"], animation: "twinkle", intensity: "low" },
  { id: "celebracion", name: "Temporada de celebración", concept: "Partículas luminosas", months: [7], enabled: false, decor: ["sparkles"], animation: "float", intensity: "low" },
  { id: "creatividad", name: "Creatividad artesanal", concept: "Trazos y elementos orgánicos", months: [8], enabled: false, decor: ["strokes"], animation: "drift", intensity: "low" },
  { id: "amor-amistad-co", name: "Amor y amistad en Colombia", concept: "Corazones y destellos románticos", months: [9], enabled: false, decor: ["hearts", "sparkles"], animation: "float", intensity: "medium" },
  { id: "halloween-elegante", name: "Halloween elegante", concept: "Luciérnagas y luces ámbar", months: [10], enabled: false, decor: ["fireflies"], animation: "float", intensity: "low" },
  {
    id: "navidad",
    name: "Navidad Lumi",
    concept: "Navidad elegante y cálida: destellos dorados, luces cálidas y ramas de pino",
    months: [11, 12],
    enabled: true,
    decor: ["lights", "sparkles", "stars", "pine"],
    animation: "twinkle",
    intensity: "medium",
    heroImage: "/mock/mock-navidad.webp", // MOCKUP hasta tener fotos reales
    message: { badge: "Navidad Lumi" },
    palette: {
      // Solo colores del logo: verde del wordmark (#666C48 → #4F5537), crema y llama.
      bg: "linear-gradient(168deg, #666C48 0%, #5A6040 45%, #4F5537 100%)",
      text: "#FBF7F0",
      textMuted: "#FEF5F1",
      accent: "#FBD2CB",
      glow: "rgb(252 190 92 / 0.35)",
      surface: "#FEF5F1",
      onSurface: "#452E23",
    },
    monthOverrides: {
      11: { intensity: "low", message: { badge: "Comienza la temporada" } },
      12: { intensity: "high", message: { badge: "Navidad Lumi" } },
    },
  },
];
