import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/validation/url";
import { getContact } from "./contact";

const NAV = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo/eventos", label: "Eventos" },
  { href: "/catalogo/velas", label: "Velas" },
] as const;

export async function CatalogHeader() {
  const { whatsapp } = await getContact();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 sm:px-8 lg:px-12">
        <Link href="/links" aria-label="Lumi · inicio" className="shrink-0">
          <Image src="/brand/lumi-wordmark.webp" alt="Lumi" width={200} height={66} className="h-auto w-24 sm:w-28" priority />
        </Link>
        <nav aria-label="Catálogo" className="order-3 -mx-1 w-full overflow-x-auto sm:order-none sm:mx-0 sm:w-auto">
          <ul className="flex gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex h-10 items-center rounded-pill px-4 text-sm font-medium text-text transition-colors hover:bg-blush-100">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {whatsapp && (
          <a
            href={buildWhatsAppUrl(whatsapp, "Hola Lumi, vengo del catálogo y quiero más información.")}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-pill bg-brand px-4 text-sm font-medium text-ivory transition-colors hover:bg-brand-hover"
          >
            <MessageCircle aria-hidden className="size-4" />
            <span>Escríbenos</span>
          </a>
        )}
      </div>
    </header>
  );
}

export function CatalogFooter({ mock }: { mock: boolean }) {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-12 text-center sm:px-8 lg:px-12">
        <p className="font-display text-2xl">Hecho a mano, con cariño.</p>
        <p className="eyebrow">Lumi · Velas · Recordatorios</p>
        <Link href="/links" className="text-sm text-text-muted underline-offset-4 hover:underline">Todos nuestros enlaces</Link>
        {mock && <p className="mt-2 max-w-md text-xs text-text-muted">Imágenes ilustrativas. Muy pronto verás aquí fotografías de nuestras piezas reales.</p>}
      </div>
    </footer>
  );
}
