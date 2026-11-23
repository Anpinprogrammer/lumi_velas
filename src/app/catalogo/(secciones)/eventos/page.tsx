import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { getContact } from "@/features/catalog/components/contact";
import { CtaBand, Em, PageHero } from "@/features/catalog/components/page-hero";
import { QuoteButton } from "@/features/catalog/components/quote-dialog";
import { eventCategories } from "@/features/catalog/data";
import { PERSONALIZATION, QUOTE_STEPS } from "@/features/catalog/personalization";

export const metadata: Metadata = {
  title: "Velas para eventos · Lumi",
  description: "Velas y recuerdos personalizados para matrimonios, bautizos, cumpleaños, baby showers y eventos empresariales. Cotiza por WhatsApp.",
  alternates: { canonical: "/catalogo/eventos" },
};

export default async function Eventos() {
  const { whatsapp } = await getContact();
  const events = eventCategories();
  const quoteEvents = events.map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <PageHero
        crumbs={[{ href: "/links", label: "Inicio" }, { href: "/catalogo", label: "Catálogo" }, { label: "Eventos" }]}
        eyebrow="Velas para eventos"
        title={<>Detalles que hacen <Em>inolvidable</Em> cada celebración.</>}
        lead="Personalizamos cada vela para que refleje la esencia de tu momento especial."
        actions={whatsapp ? <QuoteButton whatsapp={whatsapp} events={quoteEvents} /> : undefined}
      />

      <section aria-labelledby="cats-title" className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Elige tu celebración" title={<span id="cats-title">Seis maneras de <Em>iluminar</Em> tu evento.</span>} className="mb-10" />
        <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e, i) => (
            <li key={e.slug}>
              <Link href={`/catalogo/eventos/${e.slug}`} className="group flex flex-col gap-4">
                <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-cream-100">
                  {e.image && <Image src={e.image.src} alt={e.image.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]" />}
                  <span className="absolute left-4 top-4 rounded-pill bg-ivory/90 px-3 py-1 font-display text-lg text-sage-700">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-display text-[length:var(--text-h3)] leading-tight">{e.name}</span>
                  <span className="text-sm text-text-muted">{e.description}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-sage-700">
                    Explorar diseños <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pers-title" className="mt-24 bg-cream-100 py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow="Personalización"
            title={<span id="pers-title">Tu idea, <Em>hecha luz.</Em></span>}
            description="Cada propuesta se arma contigo. Estas son las piezas con las que podemos jugar para que el resultado sea solo tuyo."
            className="mb-10"
          />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PERSONALIZATION.map((o) => (
              <li key={o.id} className="rounded-lg bg-surface p-6 shadow-soft">
                <h3 className="font-display text-2xl leading-tight">{o.name}</h3>
                <p className="mt-2 text-sm text-text-muted">{o.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="how-title" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8 lg:px-12">
        <SectionHeading eyebrow="Cómo cotizar" title={<span id="how-title">Del primer mensaje <Em>a tu celebración.</Em></span>} className="mb-10" />
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {QUOTE_STEPS.map(([t, d], i) => (
            <li key={t} className="border-t border-border pt-5">
              <span className="font-display text-3xl text-amber-600">0{i + 1}</span>
              <h3 className="font-display mt-2 text-2xl leading-tight">{t}</h3>
              <p className="mt-2 text-sm text-text-muted">{d}</p>
            </li>
          ))}
        </ol>
        {whatsapp && (
          <div className="mt-16">
            <CtaBand title="¿Tienes una fecha en mente?" text="Escríbenos con tiempo para reservar la producción de tu evento." action={<QuoteButton whatsapp={whatsapp} events={quoteEvents} />} />
          </div>
        )}
      </section>
    </>
  );
}
