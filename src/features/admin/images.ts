/**
 * Validación de imágenes subidas desde el panel. No se confía en el tipo que declara el navegador:
 * se leen los primeros bytes (firma) y se comparan con los formatos permitidos del bucket `site-media`.
 */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // igual que el límite del bucket
export const MAX_IMAGES_PER_UPLOAD = 8;

export type ImageKind = "jpeg" | "png" | "webp" | "avif";
export const IMAGE_MIME: Record<ImageKind, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };
export const IMAGE_EXT: Record<ImageKind, string> = { jpeg: "jpg", png: "png", webp: "webp", avif: "avif" };

export function sniffImage(bytes: Uint8Array): ImageKind | null {
  const at = (i: number, s: string) => s.split("").every((c, k) => bytes[i + k] === c.charCodeAt(0));
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes.length >= 8 && bytes[0] === 0x89 && at(1, "PNG") && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return "png";
  if (bytes.length >= 12 && at(0, "RIFF") && at(8, "WEBP")) return "webp";
  if (bytes.length >= 12 && at(4, "ftyp") && (at(8, "avif") || at(8, "avis"))) return "avif";
  return null;
}

export type ImageCheck = { ok: true; kind: ImageKind } | { ok: false; error: string };

export function checkImage(name: string, size: number, head: Uint8Array): ImageCheck {
  if (size <= 0) return { ok: false, error: `«${name}» está vacío.` };
  if (size > MAX_IMAGE_BYTES) return { ok: false, error: `«${name}» pesa más de 5 MB.` };
  const kind = sniffImage(head);
  if (!kind) return { ok: false, error: `«${name}» no es una imagen JPG, PNG, WebP o AVIF.` };
  return { ok: true, kind };
}

/** Ruta en el bucket: carpeta por dueño (producto/enlace) y nombre aleatorio; nunca se usa el nombre original. */
export function imagePath(scope: "products" | "links", ownerId: string, kind: ImageKind, uid: string): string {
  return `${scope}/${ownerId}/${uid}.${IMAGE_EXT[kind]}`;
}
