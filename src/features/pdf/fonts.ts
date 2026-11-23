import path from "node:path";
import { Font } from "@react-pdf/renderer";

/**
 * Tipografías del PDF (archivos WOFF locales; React PDF no usa next/font).
 * Mismas familias PROVISIONALES del sitio. Ver fonts/README.md.
 */
const dir = path.join(process.cwd(), "src/features/pdf/fonts");
const f = (name: string) => path.join(dir, name);

let registered = false;

export const SERIF = "Cormorant Garamond";
export const SANS = "DM Sans";

export function registerPdfFonts() {
  if (registered) return;
  Font.register({
    family: SERIF,
    fonts: [
      { src: f("cormorant-garamond-latin-300-normal.woff"), fontWeight: 300 },
      { src: f("cormorant-garamond-latin-300-italic.woff"), fontWeight: 300, fontStyle: "italic" },
      { src: f("cormorant-garamond-latin-400-normal.woff"), fontWeight: 400 },
      { src: f("cormorant-garamond-latin-400-italic.woff"), fontWeight: 400, fontStyle: "italic" },
      { src: f("cormorant-garamond-latin-500-normal.woff"), fontWeight: 500 },
      { src: f("cormorant-garamond-latin-500-italic.woff"), fontWeight: 500, fontStyle: "italic" },
    ],
  });
  Font.register({
    family: SANS,
    fonts: [
      { src: f("dm-sans-latin-400-normal.woff"), fontWeight: 400 },
      { src: f("dm-sans-latin-500-normal.woff"), fontWeight: 500 },
      { src: f("dm-sans-latin-600-normal.woff"), fontWeight: 600 },
    ],
  });
  // Sin guiones automáticos (el separador por defecto está pensado para inglés).
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
