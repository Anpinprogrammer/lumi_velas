import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

/**
 * React PDF solo admite PNG/JPG: las imágenes del sitio (WebP) se convierten al vuelo con sharp.
 * Solo se leen archivos de /public (rutas que vienen de los datos del catálogo, nunca del usuario);
 * cualquier ruta fuera de /public se rechaza. Cuando las fotos vivan en Supabase Storage, aquí se
 * descargarán desde la URL pública del bucket.
 */
const PUBLIC_DIR = path.join(process.cwd(), "public");

export type PdfImage = { data: Buffer; format: "png" | "jpg" };

const cache = new Map<string, Promise<PdfImage | null>>();

function resolvePublic(src: string): string | null {
  if (!src.startsWith("/") || src.startsWith("//")) return null;
  const full = path.join(PUBLIC_DIR, path.normalize(src));
  return full.startsWith(PUBLIC_DIR + path.sep) ? full : null;
}

async function convert(src: string, width: number, alpha: boolean): Promise<PdfImage | null> {
  const file = resolvePublic(src);
  if (!file) return null;
  try {
    const input = sharp(await readFile(/*turbopackIgnore: true*/ file)) // archivos incluidos vía outputFileTracingIncludes.resize({ width, withoutEnlargement: true });
    return alpha
      ? { data: await input.png({ compressionLevel: 9 }).toBuffer(), format: "png" }
      : { data: await input.flatten({ background: "#FEF5F1" }).jpeg({ quality: 80, mozjpeg: true }).toBuffer(), format: "jpg" };
  } catch {
    return null; // la página se arma igual, con un marco vacío
  }
}

/** Fotografía (JPG). `width` en píxeles; ~2× el tamaño impreso basta para pantalla y casa. */
export function photo(src: string | undefined, width = 640) {
  if (!src) return Promise.resolve(null);
  const key = `jpg:${width}:${src}`;
  if (!cache.has(key)) cache.set(key, convert(src, width, false));
  return cache.get(key)!;
}

/** Logo o pieza con transparencia (PNG). */
export function transparent(src: string, width = 900) {
  const key = `png:${width}:${src}`;
  if (!cache.has(key)) cache.set(key, convert(src, width, true));
  return cache.get(key)!;
}
