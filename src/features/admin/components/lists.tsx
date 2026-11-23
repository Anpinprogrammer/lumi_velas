import Link from "next/link";
import { ArrowDown, ArrowUp, ExternalLink, Pencil } from "lucide-react";
import { Badge, Button, EmptyState, IconButton } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import type { AdminImage, AdminLink, AdminProduct } from "../queries";
import { ConfirmButton } from "./bits";
import { LINK_STYLE_LABELS } from "./labels";

type Act = (fd: FormData) => void | Promise<void>;

function MoveButtons({ id, move, name, first, last }: { id: string; move: Act; name: string; first: boolean; last: boolean }) {
  return (
    <div className="flex">
      {([-1, 1] as const).map((d) => (
        <form key={d} action={move}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="delta" value={d} />
          <IconButton type="submit" size="sm" label={`${d < 0 ? "Subir" : "Bajar"} ${name}`} disabled={d < 0 ? first : last} icon={d < 0 ? <ArrowUp className="size-4" aria-hidden /> : <ArrowDown className="size-4" aria-hidden />} />
        </form>
      ))}
    </div>
  );
}

const row = "flex flex-wrap items-center gap-3 border-b border-border py-3 last:border-0";

export function LinksList({ links, actions }: { links: AdminLink[]; actions: { toggle: Act; move: Act; remove: Act } }) {
  if (links.length === 0) {
    return <EmptyState title="Aún no hay enlaces" description="Mientras no haya enlaces activos, el Linktree muestra los enlaces por defecto." action={<Button href="/admin/links/nuevo">Crear el primero</Button>} />;
  }
  return (
    <ol className="rounded-2xl border border-border bg-surface px-4">
      {links.map((l, i) => (
        <li key={l.id} className={cn(row, !l.isActive && "opacity-70")}>
          <MoveButtons id={l.id} move={actions.move} name={l.label} first={i === 0} last={i === links.length - 1} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{l.label}</p>
            <p className="truncate text-sm text-text-muted">{l.url}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="neutral">{LINK_STYLE_LABELS[l.style]?.split(" (")[0] ?? l.style}</Badge>
            {l.isFeatured ? <Badge variant="accent">Destacado</Badge> : null}
            <Badge variant={l.isActive ? "success" : "warning"}>{l.isActive ? "Visible" : "Oculto"}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <form action={actions.toggle}>
              <input type="hidden" name="id" value={l.id} />
              <input type="hidden" name="active" value={String(!l.isActive)} />
              <Button type="submit" size="sm" variant="ghost">{l.isActive ? "Ocultar" : "Mostrar"}</Button>
            </form>
            <Button href={`/admin/links/${l.id}`} size="sm" variant="secondary" leftIcon={<Pencil className="size-4" aria-hidden />}>Editar</Button>
            <form action={actions.remove}>
              <input type="hidden" name="id" value={l.id} />
              <ConfirmButton message={`¿Eliminar el enlace «${l.label}»? No se puede deshacer.`}>Eliminar</ConfirmButton>
            </form>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProductsList({ products, categoryNames, actions }: { products: AdminProduct[]; categoryNames: Record<string, string>; actions: { setStatus: Act; move: Act } }) {
  if (products.length === 0) {
    return <EmptyState title="Aún no hay productos" description="Crea el primero y súbele fotos. Quedará oculto hasta que lo publiques." action={<Button href="/admin/productos/nuevo">Crear producto</Button>} />;
  }
  return (
    <ol className="rounded-2xl border border-border bg-surface px-4">
      {products.map((p, i) => {
        const cover = p.images[0]?.url;
        const next = p.status === "published" ? "hidden" : "published";
        return (
          <li key={p.id} className={cn(row, p.status !== "published" && "opacity-80")}>
            <MoveButtons id={p.id} move={actions.move} name={p.name} first={i === 0} last={i === products.length - 1} />
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- miniatura del panel, URL de Storage
              <img src={cover} alt="" className="h-14 w-11 shrink-0 rounded-t-full object-cover" />
            ) : (
              <div className="grid h-14 w-11 shrink-0 place-items-center rounded-t-full bg-cream-100 text-[10px] text-text-muted">Sin foto</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.name}</p>
              <p className="truncate text-sm text-text-muted">
                {p.type === "individual" ? (p.priceCOP != null ? formatCOP(p.priceCOP) : "Sin precio") : "Para eventos · se cotiza"}
                {p.categoryIds.length > 0 ? ` · ${p.categoryIds.map((c) => categoryNames[c]).filter(Boolean).join(", ")}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {p.isFeatured ? <Badge variant="accent">Destacado</Badge> : null}
              <Badge variant={p.status === "published" ? "success" : "warning"}>{p.status === "published" ? "Publicado" : "Oculto"}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <form action={actions.setStatus}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="status" value={next} />
                <Button type="submit" size="sm" variant="ghost">{p.status === "published" ? "Ocultar" : "Publicar"}</Button>
              </form>
              <Button href={`/admin/productos/${p.id}`} size="sm" variant="secondary" leftIcon={<Pencil className="size-4" aria-hidden />}>Editar</Button>
              {p.status === "published" ? (
                <Link href={`/catalogo/producto/${p.slug}`} target="_blank" aria-label={`Ver ${p.name} en el catálogo`} className="grid size-9 place-items-center rounded-md hover:bg-cream-100">
                  <ExternalLink className="size-4" aria-hidden />
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ProductImages({ productId, images, actions }: { productId: string; images: AdminImage[]; actions: { alt: Act; move: Act; remove: Act } }) {
  void productId;
  if (images.length === 0) return <p className="text-sm text-text-muted">Este producto aún no tiene fotos. Sin fotos no se ve bien en el catálogo.</p>;
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {images.map((img, i) => (
        <li key={img.id} className="flex gap-3 rounded-2xl border border-border bg-surface p-3">
          {img.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- miniatura del panel, URL de Storage
            <img src={img.url} alt={img.alt ?? ""} className="h-28 w-24 shrink-0 rounded-t-full object-cover" />
          ) : (
            <div className="h-28 w-24 shrink-0 rounded-t-full bg-cream-100" />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            {i === 0 ? <Badge variant="brand" className="self-start">Portada</Badge> : <span className="text-xs text-text-muted">Foto {i + 1}</span>}
            <form action={actions.alt} className="flex flex-col gap-1.5">
              <input type="hidden" name="id" value={img.id} />
              <label htmlFor={`alt-${img.id}`} className="text-xs font-medium">Texto alternativo</label>
              <input id={`alt-${img.id}`} name="alt" defaultValue={img.alt ?? ""} maxLength={200} placeholder="Describe la foto (accesibilidad)" className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm" />
              <Button type="submit" size="sm" variant="ghost" className="self-start">Guardar texto</Button>
            </form>
            <div className="mt-auto flex items-center justify-between">
              <MoveButtons id={img.id} move={actions.move} name={`foto ${i + 1}`} first={i === 0} last={i === images.length - 1} />
              <form action={actions.remove}>
                <input type="hidden" name="id" value={img.id} />
                <ConfirmButton message="¿Eliminar esta foto? No se puede deshacer.">Eliminar</ConfirmButton>
              </form>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
