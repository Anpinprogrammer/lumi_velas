import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "surface" | "warm" | "blush" | "outline" | "dark";

const variants: Record<CardVariant, string> = {
  surface: "bg-surface shadow-soft",
  warm: "bg-cream-100",
  blush: "bg-blush-100",
  outline: "border border-border bg-transparent",
  dark: "bg-sage-600 text-cream-50",
};

type Props<T extends ElementType> = {
  as?: T;
  variant?: CardVariant;
  /** Eleva la tarjeta al pasar el cursor; úsalo solo si toda la tarjeta es interactiva. */
  interactive?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Card<T extends ElementType = "div">({ as, variant = "surface", interactive, className, ...rest }: Props<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cn(
        "rounded-lg p-6",
        variants[variant],
        interactive &&
          "transition-[transform,box-shadow] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-lift",
        className,
      )}
      {...rest}
    />
  );
}
