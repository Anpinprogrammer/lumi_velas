/**
 * Modo de entrega del sitio (independiente de NODE_ENV).
 *
 * - "development": desarrollo/Preview. Todo visible (web completa del proyecto en curso).
 * - "production": despliegue del cliente. Solo se expone lo pagado: Linktree, catálogo web
 *   (sin las secciones de eventos ni velas individuales, que van a WhatsApp) y panel.
 *
 * Si `APP_MODE` falta o trae otro valor se usa `NODE_ENV`: development en local y
 * production en un build/despliegue. Así un deploy del cliente nunca expone páginas sin
 * terminar aunque se olvide la variable. El valor se resuelve al compilar, igual que
 * SITE_INDEXABLE/ENABLE_STAGE_B; cambiarlo exige un nuevo despliegue.
 */
export type AppMode = "development" | "production";

export function getAppMode(env: Record<string, string | undefined> = process.env): AppMode {
  if (env.APP_MODE === "development") return "development";
  if (env.APP_MODE === "production") return "production";
  return env.NODE_ENV === "production" ? "production" : "development";
}

/** true en el despliegue del cliente (modo production). */
export function isProductionMode(env: Record<string, string | undefined> = process.env): boolean {
  return getAppMode(env) === "production";
}
