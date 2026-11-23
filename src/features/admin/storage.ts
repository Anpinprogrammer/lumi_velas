import "server-only";
import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { checkImage, imagePath } from "./images";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Valida (firma, tamaño) y sube una imagen a `site-media`. Devuelve la ruta guardada o un mensaje de error. */
export async function uploadImage(supabase: Supabase, scope: "products" | "links", ownerId: string, file: File): Promise<{ path: string } | { error: string }> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkImage(file.name || "imagen", bytes.length, bytes.subarray(0, 16));
  if (!check.ok) return { error: check.error };
  const path = imagePath(scope, ownerId, check.kind, randomUUID());
  const { error } = await supabase.storage.from("site-media").upload(path, bytes, { contentType: `image/${check.kind}`, cacheControl: "31536000", upsert: false });
  if (error) return { error: `No se pudo subir «${file.name}».` };
  return { path };
}

/** Borra archivos de Storage (mejor esfuerzo: si falla, queda un archivo huérfano pero la base ya es coherente). */
export async function removeImages(supabase: Supabase, paths: string[]) {
  if (paths.length > 0) await supabase.storage.from("site-media").remove(paths);
}
