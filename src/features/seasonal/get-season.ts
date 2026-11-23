import { cacheLife } from "next/cache";
import { resolveSeason } from "./engine";
import type { ResolvedSeason } from "./types";

/**
 * Temporada activa para "ahora" en America/Bogota. Se cachea ~10 minutos (stale-while-revalidate),
 * por lo que el cambio de mes se refleja solo, sin tocar código ni desplegar.
 * SEASON_OVERRIDE (id de tema o "base") sirve para previsualizar en desarrollo/Preview; se ignora en Production.
 */
export async function getActiveSeason(): Promise<ResolvedSeason> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
  const override = process.env.NODE_ENV === "production" ? undefined : process.env.SEASON_OVERRIDE || undefined;
  return resolveSeason(new Date(), undefined, override);
}
