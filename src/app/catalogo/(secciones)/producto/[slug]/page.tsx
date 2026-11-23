import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Badge, Button, ImageGallery, SectionHeading } from "@/components/ui";
import { getContact } from "@/features/catalog/components/contact";
import { Breadcrumbs, Em } from "@/features/catalog/components/page-hero";
import { ProductGrid } from "@/features/catalog/components/product-grid";
import { QuoteButton } from "@/features/catalog/components/quote-dialog";
import { ShareButton } from "@/features/catalog/components/share-button";
import { eventCategories, findCategory, findProduct, getCatalog, relatedProducts } from "@/features/catalog/data";
import { productInquiryMessage } from "@/features/catalog/whatsapp";
import { getSiteUrl } from "@/lib/env";
import { formatCOP } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/validation/url";

export function generateStaticParams() {
  return getCatalog().products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogo/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} · Lumi`,
    description: p.description,
    alternates: { canonical: `/catalogo/producto/${p.slug}` },
    openGraph: { title: p.name, description: p.description, images: p.images[0] ? [p.images[0].src] : undefined },
  };
}

export default async function Producto({ params }: PageProps<"/catalogo/producto/[slug]">) {
  const { slug } = await params;
  const p = findProduct(slug);
  if (!p) notFound();

  const { whatsapp } = await getContact();
  const isEvent = p.type === "evento";
  const section = isEvent ? { href: "/catalogo/eventos", label: "Eventos" } : { href: "/catalogo/velas", label: "Velas" };
  const url = `${getSiteUrl()}/catalogo/producto/${p.slug}`;
  const cats = p.categories.map((s) => findCategory(s)).filter((c) => c !== undefined);
  const specs = Object.entries(p.specs ?? {});
  const related = relatedProducts(p);
  const quoteEvents = eventCategories().map(({ slug, name }) => ({ slug, name }));
  const firstEvent = cats.find((c) => c.kind === "evento")?.slug;

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12">
        <Breadcrumbs items={[{ href: "/catalogo", label: "Catálogo" }, section, { label: p.name }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ImageGallery images={[...p.images]} />
          <div className="flex flex-col gap-6 lg:pt-4">
            <div className="flex flex-col gap-3">
              <p className="eyebrow">{cats[0]?.name ?? section.label}</p>
              <h1 className="font-display text-[length:var(--text-h2)] font-normal leading-[1.02] tracking-tight">{p.name}</h1>
              {isEvent ? (
                <p className="flex flex-col">
                  <span className="font-display text-3xl italic text-sage-700">Precio a cotizar</span>
                  <span className="text-sm text-text-muted">Según cantidad y personalización</span>
                </p>
              ) : (
                p.priceCOP !== null && (
                  <p className="flex flex-col">
                    <span className="font-display text-3xl">{formatCOP(p.priceCOP)}</span>
                    <span className="text-sm text-text-muted">Precio de referencia · COP</span>
                  </p>
                )
              )}
            </div>
            <p className="text-lg text-text-muted">{p.description}</p>
            {cats.length > 0 && (
              <ul aria-label="Categorías" className="flex flex-wrap gap-2">
                {cats.map((c) => (
                  <li key={c.slug}>
                    <Link href={c.kind === "evento" ? `/catalogo/eventos/${c.slug}` : `/catalogo/velas?categoria=${c.slug}`} className="inline-flex">
                      <Badge variant="blush">{c.name}</Badge>
                    </Link>
                  </li>
                ))}
                {isEvent && <li><Badge variant="accent">Personalizable</Badge></li>}
              </ul>
            )}
            {specs.length > 0 && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-border py-5 text-sm">
                {specs.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {whatsapp &&
                (isEvent ? (
                  <QuoteButton whatsapp={whatsapp} events={quoteEvents} defaultEvent={firstEvent} product={{ name: p.name, image: p.images[0]?.src }} size="lg" />
                ) : (
                  <Button href={buildWhatsAppUrl(whatsapp, productInquiryMessage(p, url))} target="_blank" size="lg" leftIcon={<WhatsAppIcon className="size-4" aria-hidden />}>
                    Consultar por WhatsApp
                  </Button>
                ))}
              <ShareButton title={p.name} url={url} />
            </div>
            <p className="flex gap-2 rounded-md bg-cream-100 p-4 text-sm text-text-muted">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-amber-600" />
              {isEvent
                ? "Las piezas para eventos se elaboran por pedido. Te enviaremos una propuesta con tiempos de producción y valor."
                : "Cada vela es hecha a mano: pueden existir pequeñas variaciones que la hacen única."}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="rel-title" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="También te puede gustar" title={<span id="rel-title">Piezas <Em>relacionadas.</Em></span>} className="mb-10" />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
