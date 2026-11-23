/** "573001234567" → "+57 300 123 4567". Otros formatos se muestran con "+" y sin espacios. */
export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("57")) return `+57 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return `+${d}`;
}

/** "https://www.instagram.com/lumi.velas/" → "@lumi.velas". Si no parece Instagram, devuelve null. */
export function instagramHandle(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!/(^|\.)instagram\.com$/.test(u.hostname)) return null;
    const user = u.pathname.split("/").filter(Boolean)[0];
    return user ? `@${user}` : null;
  } catch {
    return null;
  }
}

/** "https://lumi.co" → "lumi.co/catalogo" (texto visible del enlace). */
export function displayUrl(siteUrl: string, pathname = "/catalogo"): string {
  return `${siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}${pathname}`;
}
