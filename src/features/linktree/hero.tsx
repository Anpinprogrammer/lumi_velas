import Image from "next/image";
import type { ResolvedSeason } from "@/features/seasonal";
import { MOCK_MEDIA } from "./mock-media";

export function Hero({ season, className = "" }: { season: ResolvedSeason; className?: string }) {
  const { theme } = season;
  const dark = Boolean(theme.palette && season.seasonal);
  const photo = theme.heroImage ?? MOCK_MEDIA.velas;
  const badge = season.message?.badge ?? "Velas · Recordatorios";
  const title = season.message?.title ?? "Bienvenido al universo Lumi.";
  const subtitle = season.message?.subtitle ?? "Pequeños detalles que iluminan grandes momentos.";

  return (
    <header className={`flex flex-col items-center text-center lg:items-start lg:text-left ${className}`}>
      <Image
        src={dark ? "/brand/lumi-wordmark-claro.webp" : "/brand/lumi-wordmark.webp"}
        alt="Lumi · Velas · Recordatorios"
        width={200}
        height={66}
        priority
        className="h-auto w-44 lg:w-52"
      />

      <div className="lumi-arch animate-rise relative mt-8 w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[340px]" style={{ animationDelay: "80ms" }}>
        <div className="lumi-arch-frame relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-lg">
          <Image src={photo} alt="" fill priority sizes="(min-width: 1024px) 340px, 300px" className="object-cover" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/25 to-transparent" />
        </div>
        {/* Sello con la ilustración oficial del logo */}
        <span className="absolute -bottom-4 -right-3 flex size-24 items-center justify-center rounded-full bg-cream-50 p-2 shadow-lift sm:size-28 lg:-right-6">
          <Image src="/brand/lumi-ilustracion.webp" alt="" width={90} height={72} className="h-auto w-full" />
        </span>
      </div>

      <p className="eyebrow mt-8 !text-[var(--page-accent)]">{badge}</p>
      <h1 className="font-display mt-3 max-w-[14ch] text-[clamp(2.5rem,1.6rem+3.2vw,4rem)] leading-[0.98] tracking-tight text-[var(--page-text)] lg:max-w-[12ch]">{title}</h1>
      <p className="mt-4 max-w-sm text-lg text-[var(--page-muted)]">{subtitle}</p>
    </header>
  );
}
