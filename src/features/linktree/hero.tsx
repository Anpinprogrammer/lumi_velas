import Image from "next/image";
import type { CSSProperties } from "react";
import type { ResolvedSeason } from "@/features/seasonal";

// Corazones que ascienden desde la vela: left %, tamaño px, retraso s, duración s
const HEARTS: ReadonlyArray<readonly [number, number, number, number]> = [
  [30, 14, 0, 7], [62, 11, 2.4, 8], [46, 9, 4.6, 7.5], [74, 13, 1.2, 9], [22, 10, 5.4, 8.5],
];
// Destellos alrededor del arco: left %, top %, tamaño px, retraso s
const STARS: ReadonlyArray<readonly [number, number, number, number]> = [
  [4, 30, 16, 0], [93, 22, 12, 1.4], [10, 62, 11, 2.6], [90, 58, 15, 0.8], [50, -3, 12, 2],
];

/**
 * Héroe: el logo completo de Lumi es el protagonista dentro de un gran arco (la ventana del logo).
 * Todo lo animado es decorativo (aria-hidden), usa solo transform/opacity y se detiene con
 * prefers-reduced-motion. La llama se ilumina con un resplandor superpuesto en la posición exacta
 * de la llama del logo.
 */
export function Hero({ season, className = "" }: { season: ResolvedSeason; className?: string }) {
  const badge = season.message?.badge ?? "Velas · Recordatorios";
  const title = season.message?.title ?? "Bienvenido al universo Lumi.";
  const subtitle = season.message?.subtitle ?? "Pequeños detalles que iluminan grandes momentos.";

  return (
    <header className={`flex items-center gap-3.5 pb-3 pt-4 lg:flex-col lg:items-start lg:gap-0 lg:pb-0 lg:pt-0 ${className}`}>
      <div className="lumi-stage animate-rise relative w-[4.75rem] shrink-0 sm:w-24 lg:w-64 xl:w-72">
        <div className="lumi-halo" aria-hidden />
        <div className="lumi-plate relative overflow-hidden rounded-t-[999px] rounded-b-2xl px-[6%] pb-[5%] pt-[9%] lg:rounded-b-3xl lg:px-[9%] lg:pb-[7%] lg:pt-[12%]">
          <div className="lumi-logo-box relative mx-auto aspect-[900/994] w-full">
            <Image
              src="/brand/lumi-logo.webp"
              alt="Lumi · Velas · Recordatorios"
              fill
              priority
              sizes="(min-width: 1280px) 260px, (min-width: 1024px) 230px, 96px"
              className="object-contain"
            />
            <span aria-hidden className="lumi-flame-glow" />
            {HEARTS.map(([x, s, d, t], i) => (
              <span key={i} aria-hidden className="lumi-heart" style={{ left: `${x}%`, "--k": +(s / 24).toFixed(3), "--d": `${d}s`, "--t": `${t}s` } as CSSProperties} />
            ))}
          </div>
        </div>
        {STARS.map(([x, y, s, d], i) => (
          <span key={i} aria-hidden className="lumi-star" style={{ left: `${x}%`, top: `${y}%`, "--s": `${s}px`, "--d": `${d}s` } as CSSProperties} />
        ))}
      </div>

      <div className="min-w-0 flex-1 text-left lg:mt-9 lg:flex-none">
        <p className="eyebrow !text-[10px] lg:!text-xs">{badge}</p>
        <h1 className="font-display mt-1 text-[1.65rem] font-bold leading-[1.05] tracking-[-0.02em] text-[var(--page-text)] lg:mt-3 lg:max-w-[14ch] lg:text-4xl lg:leading-[1.08] xl:text-[2.85rem]">{title}</h1>
        <p className="mt-1 text-xs leading-snug text-[var(--page-muted)] lg:mt-4 lg:max-w-sm lg:text-lg">{subtitle}</p>
      </div>
    </header>
  );
}
