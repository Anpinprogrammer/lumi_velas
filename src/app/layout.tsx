import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import { isIndexable } from "@/lib/stage";
import "./globals.css";

// Emparejamiento editorial: Cormorant Garamond (títulos, 600/700) + Plus Jakarta Sans (cuerpo/UI).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Lumi · Velas · Recordatorios",
  description: "Lumi — velas y recordatorios artesanales.",
  // Hasta autorizar la publicación (SITE_INDEXABLE=true), nada se indexa.
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
