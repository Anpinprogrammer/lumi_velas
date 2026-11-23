import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

// PROVISIONAL (pendiente de validación): compatibles con el wordmark del logo, no idénticas.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumi · Velas · Recordatorios",
  description: "Lumi — velas y recordatorios artesanales.",
  // Hasta autorizar publicación, nada se indexa.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
