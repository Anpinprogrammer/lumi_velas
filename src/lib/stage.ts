/**
 * Control de publicación (Etapa A vs Etapa B).
 *
 * - Etapa B (web completa) NUNCA se expone salvo que ENABLE_STAGE_B === "true".
 *   Esa variable debe existir solo en desarrollo/preview, jamás en Production.
 * - La indexación en buscadores es explícita: SITE_INDEXABLE === "true".
 *   Hasta que el cliente autorice la salida, el sitio completo es noindex.
 */
export function isStageBEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.ENABLE_STAGE_B === "true";
}

export function isIndexable(env: Record<string, string | undefined> = process.env): boolean {
  return env.SITE_INDEXABLE === "true";
}
