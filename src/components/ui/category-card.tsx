import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  description?: string;
  href: string;
  icon?: ReactNode;
  imageSrc?: string;
  /** large: tarjeta destacada · default: estándar */
  size?: "default" | "large";
  className?: string;
};

export function CategoryCard({ title, description, href, icon, imageSrc, size = "default", className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex overflow-hidden rounded-lg bg-surface shadow-soft",
        "transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-lift",
        size === "large" ? "min-h-64 flex-col justify-end p-7" : "min-h-40 flex-col justify-between p-5",
        className,
      )}
    >
      {imageSrc && (
        <Image src={imageSrc} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="-z-0 object-cover opacity-90" />
      )}
      <div className="relative z-10 flex items-start justify-between gap-3">
        {icon && <span aria-hidden className="inline-flex size-10 items-center justify-center rounded-pill bg-blush-100 text-sage-700">{icon}</span>}
        <ArrowUpRight
          aria-hidden
          className="ml-auto size-5 text-sage-600 transition-transform duration-[var(--dur-base)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <div className="relative z-10 mt-6">
        <h3 className={cn("font-display leading-tight", size === "large" ? "text-3xl" : "text-2xl")}>{title}</h3>
        {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      </div>
    </Link>
  );
}
