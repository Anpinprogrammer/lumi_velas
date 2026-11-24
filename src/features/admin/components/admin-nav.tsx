"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

export const ADMIN_NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/links", label: "Enlaces" },
  { href: "/admin/catalogo-pdf", label: "Catálogo PDF" },
] as const;

/** Enlace activo: /admin solo en su ruta exacta; las secciones también en sus subrutas. */
export function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Navegación del panel. Escritorio (≥lg): enlaces en línea. Móvil y tablet: botón hamburguesa que abre
 * un panel lateral desde la izquierda (40% del ancho) sobre un fondo que lo cierra al tocarlo.
 * Usa <dialog> modal: el navegador atrapa el foco, bloquea el fondo, cierra con Esc y devuelve el foco al botón.
 */
export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const panelId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Si se pasa a escritorio con el menú abierto, se cierra.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* Escritorio: sin cambios respecto al diseño anterior */}
      <nav aria-label="Panel" className="hidden flex-wrap gap-x-5 gap-y-1 text-sm lg:flex">
        {ADMIN_NAV.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isActive(pathname, l.href) ? "page" : undefined} className={l.href === "/admin" ? "font-medium" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Móvil y tablet */}
      <div className="flex items-center gap-2 lg:hidden">
        <button
          type="button"
          aria-label="Menú del panel"
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
          className="-ml-2 inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-text transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] hover:bg-cream-100"
        >
          <Menu className="size-6" aria-hidden />
        </button>
        <span className="font-display text-xl leading-none">Lumi Studio</span>
      </div>

      <dialog
        ref={ref}
        id={panelId}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // Toque en el fondo (fuera del panel) = cerrar.
          if (e.target === ref.current) setOpen(false);
        }}
        className={cn(
          "admin-drawer fixed inset-y-0 left-0 right-auto m-0 h-dvh max-h-none w-[40vw] max-w-none overflow-y-auto",
          "border-r border-border bg-surface p-0 text-text shadow-lift lg:hidden",
          "backdrop:bg-brown-700/55",
        )}
      >
        <div className="flex min-h-full flex-col gap-4 px-3 pt-3 pb-6">
          <div className="flex items-center justify-between gap-1">
            <h2 id={titleId} className="eyebrow min-w-0 truncate">Menú</h2>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill text-text transition-colors duration-[var(--dur-fast)] ease-[var(--ease)] hover:bg-cream-100"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Panel">
            <ul className="flex flex-col gap-1">
              {ADMIN_NAV.map((l) => {
                const active = isActive(pathname, l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center rounded-sm px-2 text-sm leading-tight transition-colors duration-[var(--dur-fast)] ease-[var(--ease)]",
                        active ? "bg-blush-100 font-semibold text-brand-hover" : "hover:bg-cream-100",
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </dialog>
    </>
  );
}
