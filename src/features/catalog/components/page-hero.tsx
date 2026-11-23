import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export type Crumb = { href?: string; label: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta" className="text-sm text-text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden className="size-3.5 opacity-60" />}
            {c.href ? (
              <Link href={c.href} className="underline-offset-4 hover:text-text hover:underline">{c.label}</Link>
            ) : (
              <span aria-current="page" className="text-text">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Encabezado editorial de las páginas del catálogo (estructura del prototipo aprobado). */
export function PageHero({ crumbs, eyebrow, title, lead, actions }: { crumbs: Crumb[]; eyebrow?: string; title: ReactNode; lead?: ReactNode; actions?: ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:px-12">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
        <div className="animate-rise">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="font-display text-[length:var(--text-h1)] font-normal leading-[0.98] tracking-tight">{title}</h1>
        </div>
        {(lead || actions) && (
          <div className="animate-rise flex flex-col gap-5" style={{ animationDelay: "120ms" }}>
            {lead && <p className="text-lg text-text-muted">{lead}</p>}
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
        )}
      </div>
    </section>
  );
}

/** Banda de llamada a la acción. */
export function CtaBand({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 rounded-lg bg-blush-100 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-[length:var(--text-h3)] leading-tight">{title}</h2>
        {text && <p className="text-text-muted">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Texto destacado en cursiva de la tipografía display (estilo del prototipo). */
export function Em({ children }: { children: ReactNode }) {
  return <em className="font-display italic text-sage-700">{children}</em>;
}
