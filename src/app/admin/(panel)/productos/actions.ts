"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { MAX_IMAGES_PER_UPLOAD } from "@/features/admin/images";
import { altTextSchema, fieldErrors, moveId, readProductForm, uuidSchema, type FormState } from "@/features/admin/schemas";
import { removeImages, uploadImage } from "@/features/admin/storage";
import { LINKTREE_CACHE_TAG } from "@/features/linktree/data";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

/** Cada acción empieza con requireAdmin(): el proxy es solo un filtro optimista y RLS es la última barrera. */

const GENERIC = "No pudimos guardar los cambios. Intenta de nuevo.";
const CATALOG_TAG = "catalog";
const done = () => {
  updateTag(CATALOG_TAG); // el catálogo público (cuando lea de Supabase) refleja el cambio al instante
  updateTag(LINKTREE_CACHE_TAG);
};
const idOnly = z.object({ id: uuidSchema });

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const idRaw = String(fd.get("id") ?? "");
  const id = idRaw ? uuidSchema.safeParse(idRaw) : null;
  if (id && !id.success) return { error: "Producto no válido." };

  const parsed = readProductForm(fd);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const v = parsed.data;

  const supabase = await createClient();
  const row = { slug: v.slug, name: v.name, description: v.description, type: v.type, price_cop: v.price, status: v.status, is_featured: v.isFeatured };

  let productId: string;
  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id.data);
    if (error) return error.code === "23505" ? { fieldErrors: { slug: "Esa dirección ya la usa otro producto." } } : { error: GENERIC };
    productId = id.data;
  } else {
    const { data: last } = await supabase.from("products").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { data, error } = await supabase.from("products").insert({ ...row, sort_order: (last?.sort_order ?? -1) + 1 }).select("id").single();
    if (error || !data) return error?.code === "23505" ? { fieldErrors: { slug: "Esa dirección ya la usa otro producto." } } : { error: GENERIC };
    productId = data.id;
  }

  // Categorías: se reemplaza el conjunto completo (solo ids que existen; la FK lo garantiza).
  const del = await supabase.from("product_categories").delete().eq("product_id", productId);
  if (del.error) return { error: GENERIC };
  if (v.categoryIds.length > 0) {
    const ins = await supabase.from("product_categories").insert(v.categoryIds.map((category_id) => ({ product_id: productId, category_id })));
    if (ins.error) return { error: GENERIC };
  }
  done();
  redirect(`/admin/productos/${productId}${id ? "?guardado=1" : "?nuevo=1"}`);
}

export async function setProductStatus(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  const status = fd.get("status") === "published" ? "published" : "hidden";
  if (!p.success) return;
  const supabase = await createClient();
  await supabase.from("products").update({ status }).eq("id", p.data.id);
  done();
  redirect("/admin/productos");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  if (!p.success) return;
  const supabase = await createClient();
  const { data: imgs } = await supabase.from("product_images").select("storage_path").eq("product_id", p.data.id);
  const { error } = await supabase.from("products").delete().eq("id", p.data.id);
  if (error) return;
  await removeImages(supabase, (imgs ?? []).map((i) => i.storage_path as string));
  done();
  redirect("/admin/productos");
}

export async function moveProduct(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  const delta = fd.get("delta") === "-1" ? -1 : fd.get("delta") === "1" ? 1 : 0;
  if (!p.success || delta === 0) return;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("id").order("sort_order").order("created_at");
  const next = moveId((data ?? []).map((r) => r.id as string), p.data.id, delta);
  await Promise.all(next.map((id, i) => supabase.from("products").update({ sort_order: i }).eq("id", id)));
  done();
  redirect("/admin/productos");
}

/* ---------- Imágenes ---------- */

export async function uploadProductImages(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("productId") });
  if (!p.success) return { error: "Producto no válido." };
  const files = fd.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { error: "Elige al menos una imagen." };
  if (files.length > MAX_IMAGES_PER_UPLOAD) return { error: `Sube hasta ${MAX_IMAGES_PER_UPLOAD} imágenes a la vez.` };

  const supabase = await createClient();
  const { data: last } = await supabase.from("product_images").select("sort_order").eq("product_id", p.data.id).order("sort_order", { ascending: false }).limit(1).maybeSingle();
  let order = (last?.sort_order ?? -1) + 1;
  const errors: string[] = [];
  for (const file of files) {
    const up = await uploadImage(supabase, "products", p.data.id, file);
    if ("error" in up) {
      errors.push(up.error);
      continue;
    }
    const { error } = await supabase.from("product_images").insert({ product_id: p.data.id, storage_path: up.path, alt_text: null, sort_order: order });
    if (error) {
      await removeImages(supabase, [up.path]);
      errors.push(`No se pudo guardar «${file.name}».`);
      continue;
    }
    order += 1;
  }
  done();
  redirect(`/admin/productos/${p.data.id}${errors.length ? `?imgerror=${encodeURIComponent(errors.join(" "))}` : "?guardado=1"}#imagenes`);
}

async function productIdOfImage(imageId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("product_images").select("id,product_id,storage_path").eq("id", imageId).maybeSingle();
  return { supabase, image: data as { id: string; product_id: string; storage_path: string } | null };
}

export async function updateImageAlt(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  const alt = altTextSchema.safeParse(fd.get("alt") ?? "");
  if (!p.success || !alt.success) return;
  const { supabase, image } = await productIdOfImage(p.data.id);
  if (!image) return;
  await supabase.from("product_images").update({ alt_text: alt.data }).eq("id", image.id);
  done();
  redirect(`/admin/productos/${image.product_id}?guardado=1#imagenes`);
}

export async function moveProductImage(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  const delta = fd.get("delta") === "-1" ? -1 : fd.get("delta") === "1" ? 1 : 0;
  if (!p.success || delta === 0) return;
  const { supabase, image } = await productIdOfImage(p.data.id);
  if (!image) return;
  const { data } = await supabase.from("product_images").select("id").eq("product_id", image.product_id).order("sort_order").order("created_at");
  const next = moveId((data ?? []).map((r) => r.id as string), image.id, delta);
  await Promise.all(next.map((id, i) => supabase.from("product_images").update({ sort_order: i }).eq("id", id)));
  done();
  redirect(`/admin/productos/${image.product_id}#imagenes`);
}

export async function deleteProductImage(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  if (!p.success) return;
  const { supabase, image } = await productIdOfImage(p.data.id);
  if (!image) return;
  const { error } = await supabase.from("product_images").delete().eq("id", image.id);
  if (error) return;
  await removeImages(supabase, [image.storage_path]);
  done();
  redirect(`/admin/productos/${image.product_id}#imagenes`);
}
