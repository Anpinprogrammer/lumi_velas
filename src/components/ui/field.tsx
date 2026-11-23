import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
};

/** Etiqueta + ayuda + error accesibles. Usado por Input, Textarea y Select. */
export function Field({ id, label, hint, error, required, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[length:var(--text-label)] font-medium tracking-wide text-text">
        {label}
        {required && <span aria-hidden className="ml-0.5 text-coral-600">*</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[length:var(--text-caption)] text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-[length:var(--text-caption)] text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const fieldControl =
  "w-full rounded-md border bg-surface px-4 text-text placeholder:text-brown-400 " +
  "transition-colors duration-[var(--dur-base)] ease-[var(--ease)] " +
  "hover:border-sage-600/60 focus-visible:border-sage-600 " +
  "disabled:cursor-not-allowed disabled:bg-cream-100 disabled:opacity-60";

export function describedBy(id: string, hint?: string, error?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}
