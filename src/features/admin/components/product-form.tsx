"use client";

import { useActionState, useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import type { AdminCategory, AdminProduct } from "../queries";
import type { FormState } from "../schemas";
import { Check } from "./bits";

export function ProductForm({ action, product, categories }: { action: (prev: FormState, fd: FormData) => Promise<FormState>; product?: AdminProduct | null; categories: AdminCategory[] }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const [type, setType] = useState<"individual" | "evento">(product?.type ?? "individual");
  const e = state.fieldErrors ?? {};
  const kinds = [
    { kind: "evento" as const, title: "Categorías de eventos" },
    { kind: "vela" as const, title: "Colecciones de velas" },
  ];
  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5" noValidate>
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <Input name="name" label="Nombre" defaultValue={product?.name} required maxLength={120} error={e.name} />
      <Input name="slug" label="Dirección (slug)" defaultValue={product?.slug} maxLength={80} placeholder="se genera a partir del nombre" hint="Aparece en el enlace del producto: minúsculas, números y guiones. Si la dejas vacía se crea sola." error={e.slug} />
      <Textarea name="description" label="Descripción" rows={5} defaultValue={product?.description ?? ""} maxLength={2000} error={e.description} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          name="type"
          label="Tipo"
          value={type}
          onChange={(ev) => setType(ev.target.value as "individual" | "evento")}
          options={[{ value: "individual", label: "Vela individual (con precio)" }, { value: "evento", label: "Para eventos (se cotiza)" }]}
          error={e.type}
        />
        <Input
          name="price"
          label="Precio (COP)"
          inputMode="numeric"
          defaultValue={product?.priceCOP ?? ""}
          disabled={type === "evento"}
          hint={type === "evento" ? "Los productos para eventos se cotizan: no llevan precio." : "Opcional. Sin precio se muestra «Solicitar cotización»."}
          error={e.price}
        />
      </div>
      <Select
        name="status"
        label="Estado"
        defaultValue={product?.status ?? "hidden"}
        options={[{ value: "hidden", label: "Oculto (solo lo ves tú)" }, { value: "published", label: "Publicado (visible en el catálogo)" }]}
        error={e.status}
      />
      <Check name="isFeatured" label="Producto destacado" hint="Aparece primero en las secciones destacadas." defaultChecked={product?.isFeatured} />
      {kinds.map(({ kind, title }) => {
        const list = categories.filter((c) => c.kind === kind);
        if (list.length === 0) return null;
        return (
          <fieldset key={kind} className="rounded-2xl border border-border p-4">
            <legend className="eyebrow px-2">{title}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {list.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-3 text-sm">
                  <input type="checkbox" name="categoryIds" value={c.id} defaultChecked={product?.categoryIds.includes(c.id)} className="size-5 accent-[var(--color-brand)]" />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}
      {e.categoryIds ? <p role="alert" className="text-sm text-error">{e.categoryIds}</p> : null}
      {state.error ? <p role="alert" className="text-sm text-error">{state.error}</p> : null}
      <div className="flex gap-3">
        <Button type="submit" loading={pending}>{product ? "Guardar cambios" : "Crear producto"}</Button>
        <Button href="/admin/productos" variant="ghost">Cancelar</Button>
      </div>
    </form>
  );
}
