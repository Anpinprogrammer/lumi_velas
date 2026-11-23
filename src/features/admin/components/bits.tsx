"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Botón de envío que pide confirmación antes de una acción que no se puede deshacer. */
export function ConfirmButton({ message, children, className }: { message: string; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={cn("rounded-md px-3 py-2 text-sm font-medium text-error hover:bg-blush-100 focus-visible:outline-2", className)}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

export function Check({ name, label, hint, defaultChecked, disabled }: { name: string; label: string; hint?: string; defaultChecked?: boolean; disabled?: boolean }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} disabled={disabled} className="mt-0.5 size-5 shrink-0 accent-[var(--color-brand)]" />
      <span>
        <span className="font-medium">{label}</span>
        {hint ? <span className="block text-text-muted">{hint}</span> : null}
      </span>
    </label>
  );
}
