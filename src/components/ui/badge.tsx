import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "brand" | "blush" | "accent" | "success" | "warning" | "error";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-cream-100 text-cocoa-700",
  brand: "bg-sage-600 text-white",
  blush: "bg-blush-200 text-sage-700",
  accent: "bg-coral-600 text-white",
  success: "bg-[#e3eedf] text-success",
  warning: "bg-[#f6e6cf] text-amber-600",
  error: "bg-[#f6dcd8] text-error",
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
