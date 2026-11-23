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
    <header className={`flex flex-col items-center text-center lg:items-start lg:text-left ${className}`}>
      <div className="lumi-stage animate-rise relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
        <div className="lumi-halo" aria-hidden />
        <div className="lumi-plate relative overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] px-[9%] pb-[7%] pt-[12%]">
          <div className="lumi-logo-box relative mx-auto aspect-[900/994] w-full">
            <Image
              src="/brand/lumi-logo.webp"
              alt="Lumi · Velas · Recordatorios"
              fill
              priority
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 300px, 260px"
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

      <p className="eyebrow mt-10">{badge}</p>
      <h1 className="font-display mt-3 max-w-[14ch] text-[clamp(2.5rem,1.6rem+3.2vw,4rem)] leading-[0.98] tracking-tight text-[var(--page-text)] lg:max-w-[12ch]">{title}</h1>
      <p className="mt-4 max-w-sm text-lg text-[var(--page-muted)]">{subtitle}</p>
    </header>
  );
}
