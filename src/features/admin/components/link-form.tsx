"use client";

import { useActionState } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { LINK_ICONS } from "@/features/linktree/icons";
import type { AdminLink } from "../queries";
import type { FormState } from "../schemas";
import { Check } from "./bits";
import { LINK_STYLE_LABELS } from "./labels";

const ICON_LABELS: Record<string, string> = {
  "book-open": "Libro abierto", calendar: "Calendario", "file-down": "Descarga", flame: "Llama", gift: "Regalo", "graduation-cap": "Birrete",
  heart: "Corazón", instagram: "Instagram", link: "Enlace", mail: "Correo", "map-pin": "Ubicación", "message-circle": "Chat", whatsapp: "WhatsApp", phone: "Teléfono", sparkles: "Destellos",
};

export function LinkForm({ action, link }: { action: (prev: FormState, fd: FormData) => Promise<FormState>; link?: AdminLink | null }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const e = state.fieldErrors ?? {};
  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5" noValidate>
      {link ? <input type="hidden" name="id" value={link.id} /> : null}
      <Input name="label" label="Texto del botón" defaultValue={link?.label} required maxLength={80} error={e.label} />
      <Textarea name="description" label="Descripción corta" rows={2} defaultValue={link?.description ?? ""} maxLength={160} hint="Opcional. Aparece bajo el texto del botón." error={e.description} />
      <Input name="url" label="Destino" defaultValue={link?.url} required placeholder="https://… · /catalogo · mailto: · tel:" hint="Solo https, mailto, tel o una ruta interna que empiece por /." error={e.url} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select name="style" label="Estilo" defaultValue={link?.style ?? "standard"} options={Object.entries(LINK_STYLE_LABELS).map(([value, label]) => ({ value, label }))} error={e.style} />
        <Select
          name="icon"
          label="Icono"
          defaultValue={link?.icon ?? ""}
          options={[{ value: "", label: "Sin icono" }, ...Object.keys(LINK_ICONS).map((value) => ({ value, label: ICON_LABELS[value] ?? value }))]}
          error={e.icon}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="link-image" className="text-[length:var(--text-label)] font-medium">Imagen</label>
        {link?.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- vista previa del panel, URL de Storage
          <img src={link.imageUrl} alt="" className="h-24 w-40 rounded-md object-cover" />
        ) : null}
        <input id="link-image" type="file" name="image" accept="image/jpeg,image/png,image/webp,image/avif" className="text-sm" />
        <p className="text-sm text-text-muted">Solo se usa con el estilo «Con imagen». JPG, PNG, WebP o AVIF, hasta 5 MB.</p>
        {e.image ? <p role="alert" className="text-sm text-error">{e.image}</p> : null}
        {link?.imageUrl ? <Check name="removeImage" label="Quitar la imagen actual" /> : null}
      </div>
      <div className="flex flex-col gap-3">
        <Check name="isActive" label="Visible en el Linktree" defaultChecked={link?.isActive ?? true} />
        <Check name="isFeatured" label="Marcar como destacado" hint="Solo puede haber uno: al marcarlo se libera el anterior." defaultChecked={link?.isFeatured ?? false} />
      </div>
      {state.error ? <p role="alert" className="text-sm text-error">{state.error}</p> : null}
      <div className="flex gap-3">
        <Button type="submit" loading={pending}>{link ? "Guardar cambios" : "Crear enlace"}</Button>
        <Button href="/admin/links" variant="ghost">Cancelar</Button>
      </div>
    </form>
  );
}
