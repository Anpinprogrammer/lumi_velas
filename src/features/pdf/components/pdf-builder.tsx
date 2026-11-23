"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, RefreshCw } from "lucide-react";
import { Button, IconButton, Select } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { moveWithinType, pdfHref, type SectionOrder } from "../selection";

export type BuilderItem = {
  slug: string;
  name: string;
  type: "individual" | "evento";
  categoryName: string;
  priceCOP: number | null;
  image: string | null;
};

type Row = BuilderItem & { on: boolean };

const SECTIONS: { type: BuilderItem["type"]; title: string }[] = [
  { type: "individual", title: "Colección · velas individuales" },
  { type: "evento", title: "Para eventos" },
];

/**
 * Generador del catálogo PDF: elegir productos, ordenarlos, ver la vista previa y descargar.
 * El PDF se arma en el servidor (/catalogo/pdf) con la selección en la URL; aquí no se guarda nada.
 * Guardar versiones y marcar la publicada llega con Supabase (tabla catalog_versions).
 */
export function PdfBuilder({ items }: { items: BuilderItem[] }) {
  const [rows, setRows] = useState<Row[]>(() => items.map((x) => ({ ...x, on: true })));
  const [order, setOrder] = useState<SectionOrder>("velas-primero");
  const chosen = useMemo(() => rows.filter((r) => r.on).map((r) => r.slug), [rows]);
  const all = chosen.length === rows.length && rows.every((r, k) => r.slug === items[k]?.slug);
  // Catálogo completo en su orden original → URL sin parámetros (la del PDF público).
  const slugs = all ? [] : chosen;
  const [preview, setPreview] = useState(() => pdfHref());
  const next = pdfHref({ slugs, sectionOrder: order });
  const stale = next !== preview;

  const toggle = (slug: string) => setRows((rs) => rs.map((r) => (r.slug === slug ? { ...r, on: !r.on } : r)));
  const setAll = (on: boolean) => setRows((rs) => rs.map((r) => ({ ...r, on })));
  const move = (slug: string, d: -1 | 1) => setRows((rs) => moveWithinType(rs, slug, d));

  const sections = order === "eventos-primero" ? [...SECTIONS].reverse() : SECTIONS;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <Select
              label="Orden de las secciones"
              value={order}
              onChange={(e) => setOrder(e.target.value as SectionOrder)}
              options={[
                { value: "velas-primero", label: "Primero la colección, luego eventos" },
                { value: "eventos-primero", label: "Primero eventos, luego la colección" },
              ]}
            />
          </div>
          <Button size="sm" variant="ghost" onClick={() => setAll(true)}>Todos</Button>
          <Button size="sm" variant="ghost" onClick={() => setAll(false)}>Ninguno</Button>
        </div>

        <p className="text-sm text-text-muted" aria-live="polite">
          {chosen.length} de {rows.length} productos seleccionados. Los productos ocultos nunca aparecen en el PDF.
        </p>

        {sections.map((sec) => {
          const list = rows.filter((r) => r.type === sec.type);
          return (
            <fieldset key={sec.type} className="rounded-2xl border border-border bg-surface p-4">
              <legend className="eyebrow px-2">{sec.title}</legend>
              <ol className="divide-y divide-border">
                {list.map((r, k) => (
                  <li key={r.slug} className={cn("flex items-center gap-3 py-2", !r.on && "opacity-55")}>
                    <input
                      id={`pdf-${r.slug}`}
                      type="checkbox"
                      checked={r.on}
                      onChange={() => toggle(r.slug)}
                      className="size-5 shrink-0 accent-[var(--color-brand)]"
                    />
                    {r.image ? (
                      <Image src={r.image} alt="" width={40} height={50} className="h-12 w-10 shrink-0 rounded-t-full object-cover" />
                    ) : null}
                    <label htmlFor={`pdf-${r.slug}`} className="min-w-0 flex-1 cursor-pointer">
                      <span className="block truncate font-medium">{r.name}</span>
                      <span className="block text-xs text-text-muted">
                        {r.categoryName} · {r.type === "individual" && r.priceCOP ? formatCOP(r.priceCOP) : "Precio a cotizar"}
                      </span>
                    </label>
                    <IconButton size="sm" label={`Subir ${r.name}`} icon={<ArrowUp className="size-4" aria-hidden />} disabled={k === 0} onClick={() => move(r.slug, -1)} />
                    <IconButton size="sm" label={`Bajar ${r.name}`} icon={<ArrowDown className="size-4" aria-hidden />} disabled={k === list.length - 1} onClick={() => move(r.slug, 1)} />
                  </li>
                ))}
              </ol>
            </fieldset>
          );
        })}
      </div>

      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setPreview(next)} disabled={!stale || chosen.length === 0} leftIcon={<RefreshCw className="size-4" aria-hidden />}>
            Actualizar vista previa
          </Button>
          {chosen.length > 0 ? (
            <Button href={pdfHref({ slugs, sectionOrder: order, download: true })} download variant="secondary" leftIcon={<Download className="size-4" aria-hidden />}>
              Descargar PDF
            </Button>
          ) : null}
        </div>
        {chosen.length === 0 ? <p className="text-sm text-error">Elige al menos un producto.</p> : null}
        {stale && chosen.length > 0 ? <p className="text-sm text-text-muted">Hay cambios sin ver: actualiza la vista previa.</p> : null}
        <iframe key={preview} src={preview} title="Vista previa del catálogo PDF" className="aspect-[1/1.414] w-full rounded-2xl border border-border bg-surface" />
      </div>
    </div>
  );
}
