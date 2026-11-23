import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type Props<T extends ElementType> = {
  as?: T;
  /** narrow: lectura/formularios · default: contenido · wide: galerías */
  size?: "narrow" | "default" | "wide";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const sizes = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-[1320px]",
} as const;

export function Container<T extends ElementType = "div">({
  as,
  size = "default",
  className,
  ...rest
}: Props<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag
      className={cn("mx-auto w-full px-5 sm:px-8 lg:px-12", sizes[size], className)}
      {...rest}
    />
  );
}
