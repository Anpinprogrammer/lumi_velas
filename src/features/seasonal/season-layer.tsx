import type { CSSProperties } from "react";
import "./season.css";
import type { ResolvedSeason } from "./types";

/**
 * Capa decorativa de la temporada. Componente de SERVIDOR sin JavaScript en el cliente:
 * todo es marcado + CSS (transform/opacity). Es decorativa (aria-hidden), no recibe eventos
 * y se apaga con prefers-reduced-motion. Posiciones deterministas (sin Math.random).
 */

// 4 festones de luces; cada uno con 4 bombillas sobre una curva cuadrática (mismas fórmulas que el SVG).
const SWAGS = 4;
const LIGHTS = Array.from({ length: SWAGS * 4 }, (_, i) => {
  const swag = Math.floor(i / 4);
  const t = [0.125, 0.375, 0.625, 0.875][i % 4];
  const x = (swag * 300 + 300 * t) / 12; // % del ancho (viewBox 1200)
  const y = (1 - t) ** 2 * 8 + 2 * t * (1 - t) * 58 + t ** 2 * 8;
  return { x: +x.toFixed(2), y: +y.toFixed(1), i, tone: i % 3 };
});
const WIRE = `M0 8 ${Array.from({ length: SWAGS }, (_, s) => `Q${s * 300 + 150} 58 ${(s + 1) * 300} 8`).join(" ")}`;

// left %, top %, tamaño px, retraso s, duración s
const SPARKLES: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [8, 22, 14, 0, 5], [88, 18, 12, 1.2, 6], [18, 46, 10, 2.1, 5.5], [76, 40, 16, 0.6, 6.5], [50, 14, 10, 3, 5],
  [93, 62, 12, 1.8, 6], [6, 70, 14, 2.6, 7], [38, 30, 9, 0.9, 5.2], [64, 24, 11, 3.4, 6.2], [28, 78, 10, 1.5, 5.8],
  [84, 82, 13, 0.3, 6.8], [55, 58, 9, 2.8, 5.4], [14, 90, 11, 3.8, 6.4], [70, 92, 10, 1.1, 5.9],
];

// Ramas de pino: columna vertebral + agujas, generadas una vez.
function pineNeedles(seed: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out: { x1: number; y1: number; x2: number; y2: number; c: number }[] = [];
  for (let i = 1; i <= 15; i++) {
    const t = i / 16;
    const px = 10 + t * 250;
    const py = 8 + t * 40;
    const len = 62 * (1 - 0.55 * t);
    for (const side of [-1, 1]) {
      const a = (side * (48 + rnd() * 14) * Math.PI) / 180 + 0.16;
      out.push({ x1: px, y1: py, x2: px + len * Math.cos(a), y2: py + len * Math.sin(a), c: rnd() > 0.5 ? 1 : 0 });
    }
  }
  return out;
}
const PINE = pineNeedles(7);

function PineBranch({ className }: { className: string }) {
  return (
    <svg className={`season-pine ${className}`} viewBox="0 0 300 130" fill="none" strokeLinecap="round" aria-hidden>
      <path d="M10 8 L265 50" stroke="#452E23" strokeWidth="5" />
      {PINE.map((n, k) => (
        <line key={k} x1={n.x1.toFixed(1)} y1={n.y1.toFixed(1)} x2={n.x2.toFixed(1)} y2={n.y2.toFixed(1)} stroke={n.c ? "#858E65" : "#4F5537"} strokeWidth="6" />
      ))}
    </svg>
  );
}

export function SeasonLayer({ season }: { season: ResolvedSeason }) {
  if (!season.seasonal) return null;
  const { theme, intensity } = season;
  const has = (d: (typeof theme.decor)[number]) => theme.decor.includes(d);

  return (
    <div className="season-layer" aria-hidden data-season={theme.id} data-intensity={intensity} data-anim={theme.animation}>
      {has("pine") && (
        <>
          <PineBranch className="season-pine--l" />
          <PineBranch className="season-pine--r" />
        </>
      )}
      {has("lights") && (
        <div className="season-lights">
          <svg viewBox="0 0 1200 70" preserveAspectRatio="none">
            <path d={WIRE} vectorEffect="non-scaling-stroke" />
          </svg>
          {LIGHTS.map((l) => (
            <span key={l.i} className="season-bulb" data-tone={l.tone} style={{ left: `${l.x}%`, top: `${l.y}px`, "--i": l.i } as CSSProperties} />
          ))}
        </div>
      )}
      {(has("sparkles") || has("stars")) &&
        SPARKLES.map(([x, y, size, delay, dur], i) => (
          <span key={i} className="season-spark" style={{ left: `${x}%`, top: `${y}%`, "--s": `${size}px`, "--d": `${delay}s`, "--t": `${dur}s` } as CSSProperties} />
        ))}
    </div>
  );
}
