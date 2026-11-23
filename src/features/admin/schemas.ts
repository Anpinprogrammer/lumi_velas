import { z } from "zod";
import { isLinkIconKey } from "@/features/linktree/icons";
import { LINK_STYLES } from "@/features/linktree/types";
import { safeLinkUrlSchema } from "@/lib/validation/url";
import { slugify, slugSchema } from "@/lib/validation/slug";

/** Validación de los formularios del panel. Se ejecuta SIEMPRE en el servidor (las Server Actions no confían en el navegador). */

export type FieldErrors = Record<string, string>;
export type FormState = { ok?: boolean; error?: string; fieldErrors?: FieldErrors };

export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const i of error.issues) {
    const key = String(i.path[0] ?? "form");
    if (!(key in out)) out[key] = i.message;
  }
  return out;
}

const text = (max: number) => z.string().trim().max(max, `Máximo ${max} caracteres.`);
const optionalText = (max: number) => text(max).transform((v) => (v === "" ? null : v));
const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

export const uuidSchema = z.uuid("Identificador no válido.");

/* ---------- Enlaces del Linktree ---------- */

export const linkFormSchema = z.object({
  label: text(80).min(1, "Escribe el texto del botón."),
  description: optionalText(160),
  url: safeLinkUrlSchema,
  style: z.enum(LINK_STYLES as [string, ...string[]], "Estilo no válido."),
  icon: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .refine((v) => v === null || isLinkIconKey(v), "Icono no válido."),
  isActive: checkbox,
  isFeatured: checkbox,
});
export type LinkFormValues = z.infer<typeof linkFormSchema>;

/* ---------- Productos ---------- */

const priceField = z
  .string()
  .trim()
  .transform((v) => v.replace(/[.\s$]/g, ""))
  .refine((v) => v === "" || /^\d{1,9}$/.test(v), "Escribe solo números (pesos, sin decimales).")
  .transform((v) => (v === "" ? null : Number(v)));

export const productFormSchema = z
  .object({
    name: text(120).min(1, "Escribe el nombre del producto."),
    slug: text(80),
    description: optionalText(2000),
    type: z.enum(["individual", "evento"], "Elige el tipo de producto."),
    price: priceField,
    status: z.enum(["published", "hidden"], "Estado no válido."),
    isFeatured: checkbox,
    categoryIds: z.array(uuidSchema).max(20),
  })
  .transform((v, ctx) => {
    const slug = v.slug === "" ? slugify(v.name) : v.slug;
    const parsed = slugSchema.safeParse(slug);
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", path: ["slug"], message: parsed.error.issues[0]?.message ?? "Dirección no válida." });
      return z.NEVER;
    }
    // Los productos para eventos se cotizan: nunca llevan precio (la base también lo exige).
    return { ...v, slug, price: v.type === "evento" ? null : v.price };
  });
export type ProductFormValues = z.output<typeof productFormSchema>;

export function readProductForm(fd: FormData) {
  return productFormSchema.safeParse({
    name: fd.get("name") ?? "",
    slug: fd.get("slug") ?? "",
    description: fd.get("description") ?? "",
    type: fd.get("type"),
    price: fd.get("price") ?? "",
    status: fd.get("status"),
    isFeatured: fd.get("isFeatured"),
    categoryIds: fd.getAll("categoryIds").map(String),
  });
}

export function readLinkForm(fd: FormData) {
  return linkFormSchema.safeParse({
    label: fd.get("label") ?? "",
    description: fd.get("description") ?? "",
    url: fd.get("url") ?? "",
    style: fd.get("style"),
    icon: fd.get("icon") ?? "",
    isActive: fd.get("isActive"),
    isFeatured: fd.get("isFeatured"),
  });
}

export const altTextSchema = optionalText(200);

/* ---------- Orden ---------- */

/** Nuevo orden de `ids` al mover `id` una posición (-1 arriba, +1 abajo). Devuelve el mismo arreglo si no se puede mover. */
export function moveId(ids: readonly string[], id: string, delta: -1 | 1): string[] {
  const out = [...ids];
  const i = out.indexOf(id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= out.length) return out;
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}
