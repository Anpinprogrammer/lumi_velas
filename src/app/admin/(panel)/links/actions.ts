"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fieldErrors, moveId, readLinkForm, uuidSchema, type FormState } from "@/features/admin/schemas";
import { removeImages, uploadImage } from "@/features/admin/storage";
import { LINKTREE_CACHE_TAG } from "@/features/linktree/data";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

/** Cada acción empieza con requireAdmin(): el proxy es solo un filtro optimista y RLS es la última barrera. */

const GENERIC = "No pudimos guardar los cambios. Intenta de nuevo.";
const done = () => updateTag(LINKTREE_CACHE_TAG); // el Linktree público refleja el cambio al instante

export async function saveLink(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const idRaw = String(fd.get("id") ?? "");
  const id = idRaw ? uuidSchema.safeParse(idRaw) : null;
  if (id && !id.success) return { error: "Enlace no válido." };

  const parsed = readLinkForm(fd);
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const v = parsed.data;

  const supabase = await createClient();
  const current = id
    ? (await supabase.from("linktree_links").select("id,image_path").eq("id", id.data).maybeSingle()).data
    : null;
  if (id && !current) return { error: "Ese enlace ya no existe." };

  // Imagen opcional (estilo «image»)
  let imagePath: string | null = current?.image_path ?? null;
  const file = fd.get("image");
  const ownerId = current?.id ?? crypto.randomUUID();
  const oldImage = imagePath;
  if (file instanceof File && file.size > 0) {
    const up = await uploadImage(supabase, "links", ownerId, file);
    if ("error" in up) return { fieldErrors: { image: up.error } };
    imagePath = up.path;
  } else if (fd.get("removeImage") === "on") {
    imagePath = null;
  }

  // Un solo destacado: se libera el anterior antes de marcar este.
  if (v.isFeatured) {
    const { error } = await supabase.from("linktree_links").update({ is_featured: false }).eq("is_featured", true).neq("id", current?.id ?? ownerId);
    if (error) return { error: GENERIC };
  }

  const row = { label: v.label, description: v.description, url: v.url, style: v.style, icon: v.icon, image_path: imagePath, is_active: v.isActive, is_featured: v.isFeatured };
  if (current) {
    const { error } = await supabase.from("linktree_links").update(row).eq("id", current.id);
    if (error) return { error: GENERIC };
  } else {
    const { data: last } = await supabase.from("linktree_links").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from("linktree_links").insert({ ...row, id: ownerId, sort_order: (last?.sort_order ?? -1) + 1 });
    if (error) return { error: GENERIC };
  }
  if (oldImage && oldImage !== imagePath) await removeImages(supabase, [oldImage]);
  done();
  redirect("/admin/links");
}

const idOnly = z.object({ id: uuidSchema });

export async function deleteLink(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  if (!p.success) return;
  const supabase = await createClient();
  const { data } = await supabase.from("linktree_links").select("image_path").eq("id", p.data.id).maybeSingle();
  const { error } = await supabase.from("linktree_links").delete().eq("id", p.data.id);
  if (error) return;
  if (data?.image_path) await removeImages(supabase, [data.image_path]);
  done();
  redirect("/admin/links");
}

export async function toggleLink(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  if (!p.success) return;
  const supabase = await createClient();
  await supabase.from("linktree_links").update({ is_active: fd.get("active") === "true" }).eq("id", p.data.id);
  done();
  redirect("/admin/links");
}

export async function moveLink(fd: FormData) {
  await requireAdmin();
  const p = idOnly.safeParse({ id: fd.get("id") });
  const delta = fd.get("delta") === "-1" ? -1 : fd.get("delta") === "1" ? 1 : 0;
  if (!p.success || delta === 0) return;
  const supabase = await createClient();
  const { data } = await supabase.from("linktree_links").select("id").order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string);
  const next = moveId(ids, p.data.id, delta);
  await Promise.all(next.map((id, i) => supabase.from("linktree_links").update({ sort_order: i }).eq("id", id)));
  done();
  redirect("/admin/links");
}
