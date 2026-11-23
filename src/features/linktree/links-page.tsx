import type { CSSProperties } from "react";
import { BASE_PALETTE, SeasonLayer, type ResolvedSeason } from "@/features/seasonal";
import { bentoSpans } from "./bento";
import { Hero } from "./hero";
import { LinkCard } from "./link-card";
import { PageFooter } from "./page-footer";
import type { LinktreeData } from "./types";
import "./linktree.css";

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
    "--page-scrim": "79 85 55",
    "--page-line": season.seasonal ? "rgb(251 247 240 / 0.22)" : "rgb(69 46 35 / 0.18)",
    "--color-focus": season.seasonal ? "#FCBE5C" : "#A84F3F",
  } as CSSProperties;

  const main = data.links.filter((l) => l.style !== "compact");
  const chips = data.links.filter((l) => l.style === "compact");
  const spans = bentoSpans(main);

  return (
    <main className="lumi-page relative min-h-dvh overflow-x-clip lg:flex lg:items-center" data-season={season.theme.id} style={vars}>
      <SeasonLayer season={season} />
      <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-8 gap-y-3 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-x-12 lg:gap-y-6 lg:py-12 xl:max-w-6xl">
        <Hero season={season} className="lg:col-span-5 lg:col-start-1 lg:row-start-1" />
        <nav aria-label="Enlaces de Lumi" className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3.5">
            {main.map((l, i) => (
              <li key={l.id} className={spans[i] === 2 ? "sm:col-span-2" : undefined}><LinkCard link={l} index={i} /></li>
            ))}
          </ul>
        </nav>
        {chips.length > 0 && (
          <ul aria-label="Contacto" className="flex flex-wrap gap-2.5 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start [&>li]:flex-1 lg:[&>li]:flex-none">
            {chips.map((l, i) => (
              <li key={l.id}><LinkCard link={l} index={main.length + i} /></li>
            ))}
          </ul>
        )}
        <PageFooter settings={data.settings} />
      </div>
    </main>
  );
}
