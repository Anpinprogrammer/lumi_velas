import { getLinktreeData } from "@/features/linktree/data";

/** Contacto público (WhatsApp/Instagram): mismas fuentes que el Linktree (Supabase → variables → demo en desarrollo). */
export async function getContact() {
  return (await getLinktreeData()).settings;
}
