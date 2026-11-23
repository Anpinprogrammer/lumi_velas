import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { Badge } from "./badge";

export type ProductCardProps = {
  name: string;
  href: string;
  /** "individual" muestra precio; "evento" muestra "Solicitar cotización". */
  type: "individual" | "evento";
  priceCOP?: number | null;
  imageSrc?: string;
  imageAlt?: string;
  featured?: boolean;
  category?: string;
  className?: string;
};

export function ProductCard({ name, href, type, priceCOP, imageSrc, imageAlt, featured, category, className }: ProductCardProps) {
  const showPrice = type === "individual" && typeof priceCOP === "number";
  return (
    <article className={cn("group relative flex flex-col gap-4", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gradient-to-b from-blush-100 to-cream-100">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden className="flex size-full items-center justify-center text-amber-400/70">
            <Flame className="size-12" strokeWidth={1.25} />
          </div>
        )}
        {featured && <Badge variant="accent" className="absolute left-3 top-3">Favorita</Badge>}
      </div>
      <div className="flex flex-col gap-1">
        {category && <p className="eyebrow">{category}</p>}
        <h3 className="font-display text-[length:var(--text-h3)] leading-tight">
          {/* El enlace cubre toda la tarjeta (área táctil completa). */}
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg">
            {name}
          </Link>
        </h3>
        <p className={cn("text-sm", showPrice ? "font-medium text-text" : "text-sage-600")}>
          {showPrice ? formatCOP(priceCOP) : "Solicitar cotización"}
        </p>
      </div>
    </article>
  );
}
