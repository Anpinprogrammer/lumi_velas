import type { CSSProperties } from "react";
import { BASE_PALETTE, SeasonLayer, type ResolvedSeason } from "@/features/seasonal";
import { Hero } from "./hero";
import { LinkCard } from "./link-card";
import { PageFooter } from "./page-footer";
import type { LinkItem, LinktreeData } from "./types";
import "./linktree.css";

/** Agrupa enlaces "compact" consecutivos en una cuadrícula; el resto va en lista, respetando el orden. */
function group(links: LinkItem[]) {
  const out: Array<{ kind: "list"; link: LinkItem } | { kind: "chips"; links: LinkItem[] }> = [];
  for (const l of links) {
    const last = out[out.length - 1];
    if (l.style === "compact") {
      if (last?.kind === "chips") last.links.push(l);
      else out.push({ kind: "chips", links: [l] });
    } else out.push({ kind: "list", link: l });
  }
  return out;
}

/**
 * Linktree "Lumi Experience". Sirve en "/" y en "/links" (canónica: /links).
 * Móvil: una columna con héroe arriba. Escritorio: composición editorial en dos columnas con héroe fijo.
 */
export function LinksPage({ season, data }: { season: ResolvedSeason; data: LinktreeData }) {
  const p = season.seasonal && season.theme.palette ? season.theme.palette : BASE_PALETTE;
  const vars = {
    "--page-bg": p.bg,
    "--page-text": p.text,
    "--page-muted": p.textMuted,
    "--page-accent": p.accent,
    "--page-glow": p.glow,
    "--page-surface": p.surface,
    "--page-on-surface": p.onSurface,
    "--page-scrim": season.seasonal ? "79 85 55" : "79 85 55",
    "--page-line": season.seasonal ? "rgb(251 247 240 / 0.22)" : "rgb(69 46 35 / 0.18)",
    "--color-focus": season.seasonal ? "#FCBE5C" : "#A84F3F",
  } as CSSProperties;

  let n = 0;
  return (
    <main className="lumi-page relative min-h-dvh overflow-x-clip" data-season={season.theme.id} style={vars}>
      <SeasonLayer season={season} />
      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-12 lg:pt-28">
        <Hero season={season} className="lg:sticky lg:top-24" />
        <div className="flex flex-col lg:pt-8">
          <nav aria-label="Enlaces de Lumi">
            <ul className="flex flex-col gap-4">
              {group(data.links).map((g, i) =>
                g.kind === "list" ? (
                  <li key={g.link.id}><LinkCard link={g.link} index={n++} /></li>
                ) : (
                  <li key={`chips-${i}`}>
                    <ul className={`grid gap-3 ${g.links.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                      {g.links.map((l) => (
                        <li key={l.id}><LinkCard link={l} index={n++} /></li>
                      ))}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          </nav>
          <PageFooter settings={data.settings} />
        </div>
      </div>
    </main>
  );
}
