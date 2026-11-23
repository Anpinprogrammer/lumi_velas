export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Elementos decorativos que una temporada puede activar. */
export type DecorElement = "lights" | "sparkles" | "stars" | "pine" | "petals" | "hearts" | "fireflies" | "strokes";
export type AnimationVariant = "twinkle" | "float" | "drift" | "none";
export type Intensity = "low" | "medium" | "high";

/** Variables CSS que una temporada puede sobrescribir (nunca los tokens de marca). */
export type SeasonPalette = {
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  glow: string;
  surface: string;
  onSurface: string;
};

export type SeasonMessage = { badge?: string; title?: string; subtitle?: string };

export type SeasonTheme = {
  id: string;
  name: string;
  /** Concepto creativo (propuesta editable, no una festividad oficial). */
  concept: string;
  months: readonly Month[];
  /** Solo las temporadas habilitadas se aplican; el resto cae al tema base. */
  enabled: boolean;
  decor: readonly DecorElement[];
  animation: AnimationVariant;
  intensity: Intensity;
  /** Recursos visuales propios (ruta pública). Opcional. */
  heroImage?: string;
  message?: SeasonMessage;
  palette?: SeasonPalette;
  /** Ajustes por mes dentro de la misma temporada (p. ej. noviembre más sobrio que diciembre). */
  monthOverrides?: Partial<Record<Month, { intensity?: Intensity; message?: SeasonMessage }>>;
};

export type ResolvedSeason = {
  theme: SeasonTheme;
  month: Month;
  intensity: Intensity;
  message: SeasonMessage | undefined;
  /** true si el tema es el de temporada y no el base. */
  seasonal: boolean;
};
