import { getActiveSeason } from "@/features/seasonal/get-season";
import { getLinktreeData } from "./data";
import { LinksPage } from "./links-page";

/** Une la temporada activa (America/Bogota) y los enlaces públicos. Ambos vienen de funciones cacheadas. */
export async function LinktreeView() {
  const [season, data] = await Promise.all([getActiveSeason(), getLinktreeData()]);
  return <LinksPage season={season} data={data} />;
}
