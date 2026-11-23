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

const ARROW = "transition-transform duration-[var(--dur-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5";
const TITLE = "font-display font-bold leading-[1.08] tracking-[-0.02em]";

/**
 * Tarjeta de enlace (bento) con 4 jerarquías visuales (featured, image, standard, compact).
 * El texto se renderiza siempre como texto de React (nunca HTML).
 */
export function LinkCard({ link, index }: { link: LinkItem; index: number }) {
  const delay = { animationDelay: `${150 + index * 70}ms` } as CSSProperties;
  const base = "lumi-card animate-rise group relative isolate flex overflow-hidden";

  if (link.style === "featured") {
    return (
      <Anchor link={link} style={delay} className={cn(base, "min-h-[118px] flex-col justify-end rounded-lg p-4 text-cream-50 sm:min-h-64 sm:p-7")}>
        {link.imageUrl && <Image src={link.imageUrl} alt="" fill priority={index === 0} sizes="(min-width: 1024px) 640px, 100vw" className="-z-10 object-cover object-[50%_30%] transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]" />}
        <span aria-hidden className="lumi-scrim absolute inset-0 -z-10" />
        <span className="mb-1.5 inline-flex w-fit rounded-pill bg-flame px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brown-700">Destacado</span>
        <span className={cn(TITLE, "pr-14 text-2xl sm:text-[1.7rem]")}>{link.label}</span>
        {link.description && <span className="mt-1 pr-14 text-xs leading-snug text-cream-50/90 sm:text-sm">{link.description}</span>}
        <span aria-hidden className="lumi-arrow-btn absolute bottom-4 right-4 inline-flex size-10 items-center justify-center rounded-pill bg-cream-50/90 text-brown-700 sm:bottom-6 sm:right-6 sm:size-11">
          <ArrowUpRight className="size-5" />
        </span>
      </Anchor>
    );
  }

  if (link.style === "image") {
    return (
      <Anchor link={link} style={delay} className={cn(base, "items-center gap-3.5 rounded-lg bg-ivory p-3 text-brown-700 hover:bg-cream-50")}>
        {link.imageUrl && (
          <span className="relative block size-16 shrink-0 overflow-hidden rounded-md sm:size-20">
            <Image src={link.imageUrl} alt="" fill sizes="80px" className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.06]" />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col justify-center pr-6">
          <span className={cn(TITLE, "text-lg sm:text-xl")}>{link.label}</span>
          {link.description && <span className="mt-0.5 text-xs leading-snug opacity-85 sm:text-sm">{link.description}</span>}
        </span>
        <ArrowUpRight aria-hidden className={cn("absolute right-4 top-4 size-5 opacity-70", ARROW)} />
      </Anchor>
    );
  }

  if (link.style === "compact") {
    return (
      <Anchor link={link} style={delay} className={cn(base, "items-center justify-center gap-2 rounded-pill border border-flame/60 bg-cream-50/10 px-5 py-3 text-sm font-semibold text-[var(--page-text)] backdrop-blur-sm hover:bg-cream-50/20")}>
        <LinkIcon name={link.icon} className="size-[18px]" />
        {link.label}
      </Anchor>
    );
  }

  return (
    <Anchor link={link} style={delay} className={cn(base, "h-full items-center gap-3.5 rounded-lg bg-ivory/95 p-4 text-brown-700 hover:bg-ivory sm:flex-col sm:items-start sm:gap-3 sm:p-5")}>
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill bg-blush-200 text-sage-700"><LinkIcon name={link.icon} className="size-5" /></span>
      <span className="flex min-w-0 flex-1 flex-col pr-6">
        <span className={cn(TITLE, "text-lg")}>{link.label}</span>
        {link.description && <span className="mt-0.5 text-xs leading-snug opacity-85 sm:text-sm">{link.description}</span>}
      </span>
      <ArrowUpRight aria-hidden className={cn("absolute right-4 top-4 size-5 opacity-70", ARROW)} />
    </Anchor>
  );
}
