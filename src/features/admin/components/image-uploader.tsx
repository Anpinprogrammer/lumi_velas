"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import type { FormState } from "../schemas";

export function ImageUploader({ action, productId }: { action: (prev: FormState, fd: FormData) => Promise<FormState>; productId: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-dashed border-border p-4">
      <input type="hidden" name="productId" value={productId} />
      <label htmlFor="product-images" className="text-[length:var(--text-label)] font-medium">Agregar fotos</label>
      <input id="product-images" type="file" name="images" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="text-sm" />
      <p className="text-sm text-text-muted">JPG, PNG, WebP o AVIF, hasta 5 MB cada una y 8 por vez. La primera de la lista es la portada.</p>
      {state.error ? <p role="alert" className="text-sm text-error">{state.error}</p> : null}
      <div>
        <Button type="submit" size="sm" loading={pending}>Subir</Button>
      </div>
    </form>
  );
}
