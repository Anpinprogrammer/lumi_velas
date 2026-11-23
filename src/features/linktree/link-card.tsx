import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { LinkIcon } from "./icons";
import type { LinkItem } from "./types";

function Anchor({ link, className, children, style }: { link: LinkItem; className: string; children: ReactNode; style?: CSSProperties }) {
  const external = link.url.startsWith("https://");
  if (link.url.startsWith("/")) {
    return <Link href={link.url} className={className} style={style}>{children}</Link>;
  }
  return (
    <a href={link.url} className={className} style={style} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

/**
 * Tarjeta de enlace con 4 jerarquías visuales (featured, image, standard, compact).
 * El texto se renderiza siempre como texto de React (nunca HTML).
 */
export function LinkCard({ link, index }: { link: LinkItem; index: number }) {
  const delay = { animationDelay: `${150 + index * 70}ms` } as CSSProperties;
  const base = "lumi-card animate-rise group relative isolate flex overflow-hidden";

  if (link.style === "featured") {
    return (
      <Anchor link={link} style={delay} className={cn(base, "min-h-60 flex-col justify-end rounded-lg p-6 text-cream-50 sm:min-h-72 sm:p-8")}>
        {link.imageUrl && <Image src={link.imageUrl} alt="" fill priority={index === 0} sizes="(min-width: 1024px) 560px, 100vw" className="-z-10 object-cover object-[50%_30%] transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]" />}
        <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(var(--page-scrim)/0.92),rgb(var(--page-scrim)/0.5)_55%,rgb(var(--page-scrim)/0.05))]" />
        <span className="absolute right-5 top-5 inline-flex size-11 items-center justify-center rounded-pill bg-cream-50/90 text-brown-700 backdrop-blur"><LinkIcon name={link.icon ?? "sparkles"} className="size-5" /></span>
        <span className="eyebrow !text-blush-200">Destacado</span>
        <span className="font-display text-3xl leading-tight sm:text-4xl">{link.label}</span>
        {link.description && <span className="mt-1 text-sm text-cream-50/85">{link.description}</span>}
        <ArrowUpRight aria-hidden className="absolute bottom-6 right-6 size-6 transition-transform duration-[var(--dur-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:bottom-8 sm:right-8" />
      </Anchor>
    );
  }

  if (link.style === "image") {
    return (
      <Anchor link={link} style={delay} className={cn(base, "items-stretch gap-4 rounded-lg bg-[var(--page-surface)] p-3 text-[var(--page-on-surface)] sm:gap-5")}>
        {link.imageUrl && (
          <span className="relative block size-24 shrink-0 overflow-hidden rounded-md sm:size-28">
            <Image src={link.imageUrl} alt="" fill sizes="112px" className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.06]" />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col justify-center py-1 pr-2">
          <span className="font-display text-2xl leading-tight">{link.label}</span>
          {link.description && <span className="mt-0.5 text-sm opacity-80">{link.description}</span>}
        </span>
        <ArrowUpRight aria-hidden className="absolute right-4 top-4 size-5 opacity-70 transition-transform duration-[var(--dur-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Anchor>
    );
  }

  if (link.style === "compact") {
    return (
      <Anchor link={link} style={delay} className={cn(base, "items-center justify-center gap-2 rounded-pill border border-[var(--page-line)] px-5 py-3 text-sm font-medium text-[var(--page-text)]")}>
        <LinkIcon name={link.icon} className="size-[18px]" />
        {link.label}
      </Anchor>
    );
  }

  return (
    <Anchor link={link} style={delay} className={cn(base, "items-center gap-4 rounded-lg bg-[var(--page-surface)] p-4 text-[var(--page-on-surface)] sm:p-5")}>
      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-pill bg-blush-200 text-sage-700"><LinkIcon name={link.icon} className="size-5" /></span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-display text-2xl leading-tight">{link.label}</span>
        {link.description && <span className="text-sm opacity-80">{link.description}</span>}
      </span>
      <ArrowUpRight aria-hidden className="size-5 shrink-0 opacity-70 transition-transform duration-[var(--dur-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Anchor>
  );
}
