import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button, SectionHeading } from "@/components/ui";
import { getContact } from "@/features/catalog/components/contact";
import { CtaBand, Em, PageHero } from "@/features/catalog/components/page-hero";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { eventCategories, featuredProducts } from "@/features/catalog/data";
import { buildWhatsAppUrl } from "@/lib/validation/url";

export const metadata: Metadata = {
  title: "Catálogo · Lumi",
  description: "Velas artesanales y recordatorios para eventos. Explora, elige y escríbenos por WhatsApp.",
  alternates: { canonical: "/catalogo" },
};

const ENTRIES = [
  { href: "/catalogo/eventos", eyebrow: "Para celebrar", title: "Velas para eventos", text: "Matrimonios, bautizos, cumpleaños, baby showers y más. Se personalizan y se cotizan.", image: "/mock/catalogo/cat-matrimonios.webp" },
  { href: "/catalogo/velas", eyebrow: "Para regalar", title: "Velas individuales", text: "Piezas hechas a mano en pequeños lotes, con precio y listas para regalar.", image: "/mock/catalogo/vela-aurora.webp" },
] as const;

export default async function Catalogo() {
  const { whatsapp } = await getContact();
  const featured = featuredProducts();
  const events = eventCategories();

  return (
    <>
      <PageHero
        crumbs={[{ href: "/links", label: "Inicio" }, { label: "Catálogo" }]}
        eyebrow="Catálogo Lumi"
        title={<>Pequeños detalles que <Em>iluminan</Em> grandes momentos.</>}
        lead="Explora nuestras velas para eventos y velas individuales. Cuando encuentres lo que buscas, escríbenos por WhatsApp."
      />

      <section aria-label="Explorar por tipo" className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <ul className="grid gap-5 md:grid-cols-2">
          {ENTRIES.map((e, i) => (
            <li key={e.href} className="animate-rise" style={{ animationDelay: `${150 + i * 90}ms` }}>
              <Link href={e.href} className="group relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-lg p-7 text-ivory shadow-soft transition-shadow hover:shadow-lift sm:min-h-[28rem] sm:p-9">
                <Image src={e.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" priority={i === 0} className="-z-10 object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04]" />
                <span aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(79_85_55/0.9),rgb(79_85_55/0.35)_55%,transparent)]" />
                <span className="eyebrow !text-blush-200">{e.eyebrow}</span>
                <span className="font-display mt-1 text-4xl leading-tight sm:text-5xl">{e.title}</span>
                <span className="mt-2 max-w-sm text-ivory/90">{e.text}</span>
                <ArrowUpRight aria-hidden className="absolute right-7 top-7 size-7 transition-transform duration-[var(--dur-base)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="eventos-rapidos" className="mx-auto mt-20 max-w-6xl px-5 sm:px-8 lg:px-12">
        <h2 id="eventos-rapidos" className="eyebrow mb-4">Cotiza por tipo de evento</h2>
        <ul className="flex flex-wrap gap-2">
          {events.map((c) => (
            <li key={c.slug}>
              <Link href={`/catalogo/eventos/${c.slug}`} className="inline-flex min-h-10 items-center rounded-pill border border-border bg-surface px-4 text-sm transition-colors hover:border-sage-600/60 hover:bg-blush-100">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="favoritas" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="Favoritas de la casa" title={<span id="favoritas">Piezas que <Em>enamoran.</Em></span>} className="mb-10" />
          <ProductGrid products={featured} />
        </section>
      )}

      {whatsapp && (
        <div className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 lg:px-12">
          <CtaBand
            title="¿No encuentras lo que buscas?"
            text="Cuéntanos tu idea y la diseñamos contigo."
            action={<Button href={buildWhatsAppUrl(whatsapp, "Hola Lumi, vengo del catálogo y tengo una idea que quiero contarles.")} target="_blank">Escríbenos por WhatsApp</Button>}
          />
        </div>
      )}
    </>
  );
}
