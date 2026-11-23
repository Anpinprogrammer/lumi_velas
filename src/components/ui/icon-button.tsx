import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonBase, buttonVariants, type ButtonVariant } from "./button";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & {
  /** Obligatorio: el botón no tiene texto visible. */
  label: string;
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
};

const sizes = { sm: "size-9", md: "size-11", lg: "size-13" } as const;

export function IconButton({ label, icon, variant = "ghost", size = "md", className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cn(buttonBase, buttonVariants[variant], sizes[size], "shrink-0 p-0", className)}
    >
      <span aria-hidden className="inline-flex">{icon}</span>
    </button>
  );
}
