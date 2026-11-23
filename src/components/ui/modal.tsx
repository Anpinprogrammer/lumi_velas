"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

/**
 * Modal sobre <dialog> nativo: el navegador atrapa el foco, bloquea el fondo,
 * cierra con Esc y devuelve el foco al elemento que lo abrió.
 */
export function Modal({ open, onClose, title, description, children, footer, size = "md", className }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        // Clic en el fondo (backdrop) = cerrar.
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] rounded-lg bg-surface p-0 text-text shadow-lift",
        "backdrop:bg-sage-700/50 backdrop:backdrop-blur-[2px]",
        "open:animate-rise",
        sizes[size],
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 p-6 pb-2">
        <div>
          <h2 id={titleId} className="font-display text-2xl leading-tight">{title}</h2>
          {description && <p id={descId} className="mt-1 text-sm text-text-muted">{description}</p>}
        </div>
        <IconButton label="Cerrar" icon={<X className="size-5" />} size="sm" onClick={onClose} />
      </div>
      {children && <div className="px-6 py-4">{children}</div>}
      {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-border p-6 pt-4">{footer}</div>}
    </dialog>
  );
}
