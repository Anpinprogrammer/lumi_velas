import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "border border-brand text-brand hover:bg-blush-100",
  ghost: "text-text hover:bg-cream-100",
  accent: "bg-coral-600 text-white hover:bg-[#8f4234]",
};
export const buttonSizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[length:var(--text-label)]",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium tracking-wide whitespace-nowrap select-none " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease)] " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  children: ReactNode;
};
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Common> & { href?: undefined };
type AsLink = Common & { href: string; target?: string; rel?: string; "aria-label"?: string };

export function Button(props: AsButton | AsLink) {
  const { variant = "primary", size = "md", loading, leftIcon, rightIcon, className, children } = props;
  const cls = cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
  const content = (
    <>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  );

  if (props.href !== undefined) {
    const { href, target, rel } = props;
    const external = target === "_blank";
    return (
      <Link
        href={href}
        target={target}
        rel={external ? (rel ?? "noopener noreferrer") : rel}
        aria-label={props["aria-label"]}
        className={cls}
      >
        {content}
      </Link>
    );
  }

  const { variant: _v, size: _s, loading: _l, leftIcon: _li, rightIcon: _ri, className: _c, children: _ch, href: _h, ...rest } = props;
  void [_v, _s, _l, _li, _ri, _c, _ch, _h];
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || loading}
      aria-busy={loading || undefined}
      className={cls}
    >
      {content}
    </button>
  );
}
