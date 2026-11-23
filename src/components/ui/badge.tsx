import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "brand" | "blush" | "accent" | "success" | "warning" | "error";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-cream-100 text-brown-700",
  brand: "bg-sage-600 text-ivory",
  blush: "bg-blush-200 text-sage-700",
  accent: "bg-coral-600 text-ivory",
  success: "bg-sage-300/25 text-sage-700",
  warning: "bg-amber-400/20 text-amber-600",
  error: "bg-coral-400/20 text-coral-600",
};

export function Badge({ variant = "neutral", children, className }: { variant?: BadgeVariant; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-[length:var(--text-caption)] font-medium uppercase tracking-[0.12em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
