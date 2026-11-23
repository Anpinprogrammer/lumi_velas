import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { EmptyState, SectionHeading } from "@/components/ui";
import { getContact } from "@/features/catalog/components/contact";
import { Breadcrumbs, CtaBand, Em } from "@/features/catalog/components/page-hero";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { QuoteButton } from "@/features/catalog/components/quote-dialog";
import { eventCategories, findCategory, productsIn } from "@/features/catalog/data";
import { isProductionMode } from "@/lib/mode";

export function generateStaticParams() {
  return eventCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/eventos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = findCategory(slug);
  if (!c || c.kind !== "evento") return {};
  return {
    title: `${c.name} · Velas para eventos · Lumi`,
    description: c.description,
    alternates: { canonical: `/catalogo/eventos/${c.slug}` },
    openGraph: c.image ? { images: [c.image.src] } : undefined,
  };
}

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi"];

export default async function EventoCategoria({ params }: PageProps<"/catalogo/eventos/[slug]">) {
  // En producción el cliente solo tiene el catálogo pagado: esta sección va a WhatsApp desde el Linktree.
  if (isProductionMode()) notFound();
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat || cat.kind !== "evento") notFound();

  const { whatsapp } = await getContact();
  const events = eventCategories();
  const quoteEvents = events.map(({ slug, name }) => ({ slug, name }));
  const index = events.findIndex((x) => x.slug === cat.slug);
  const products = productsIn(cat.slug);
  const quote = (label?: string, variant?: "primary" | "secondary") =>
    whatsapp ? <QuoteButton whatsapp={whatsapp} events={quoteEvents} defaultEvent={cat.slug} label={label} variant={variant} /> : null;

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <Breadcrumbs items={[{ href: "/catalogo", label: "Catálogo" }, { href: "/catalogo/eventos", label: "Eventos" }, { label: cat.name }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div className="animate-rise flex flex-col gap-5">
            <p className="eyebrow">Eventos · {String(index + 1).padStart(2, "0")}</p>
            <h1 className="font-display text-[length:var(--text-h1)] font-normal leading-[0.98] tracking-tight">{cat.name}</h1>
            <p className="text-lg text-text-muted">{cat.intro ?? cat.description}</p>
            <div className="flex flex-wrap gap-3">
              {quote()}
              <Link href="/catalogo/eventos" className="inline-flex h-11 items-center gap-2 rounded-pill px-5 text-sm font-medium hover:bg-cream-100">
                <ArrowLeft aria-hidden className="size-4" /> Todos los eventos
              </Link>
            </div>
          </div>
          {cat.image && (
            <div className="animate-rise relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-lg shadow-lift" style={{ animationDelay: "120ms" }}>
              <Image src={cat.image.src} alt={cat.image.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </section>

      {cat.ideas && cat.ideas.length > 0 && (
        <section aria-labelledby="ideas-title" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="Inspiración" title={<span id="ideas-title">Ideas para <Em>tu día.</Em></span>} className="mb-8" />
          <ol className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {cat.ideas.map((t, i) => (
              <li key={t} className="flex gap-4 border-b border-border pb-4">
                <span className="font-display w-8 shrink-0 text-xl italic text-amber-600">{ROMAN[i]}.</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section aria-labelledby="rel-title" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Productos para este evento" title={<span id="rel-title">Piezas <Em>pensadas</Em> para celebrar.</span>} className="mb-10" />
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState title="Estamos preparando esta selección" description="Aún no hay productos publicados para esta categoría. Cuéntanos tu idea y la diseñamos contigo." action={quote()} />
        )}
      </section>

      {whatsapp && (
        <div className="mx-auto mt-20 max-w-6xl px-5 sm:px-8 lg:px-12">
          <CtaBand title="Diseñemos juntas tu celebración." text="Los precios de eventos dependen de la cantidad y la personalización: te enviamos una propuesta sin compromiso." action={quote()} />
        </div>
      )}
    </>
  );
}
