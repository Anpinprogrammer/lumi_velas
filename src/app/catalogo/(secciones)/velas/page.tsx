import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui";
import { CtaBand, Em, PageHero } from "@/features/catalog/components/page-hero";
import { VelasBrowser } from "@/features/catalog/components/velas-browser";
import { candleCategories, getCatalog } from "@/features/catalog/data";
import { isProductionMode } from "@/lib/mode";

export const metadata: Metadata = {
  title: "Velas individuales · Lumi",
  description: "Velas artesanales hechas a mano en pequeños lotes. Para regalar, decorar o regalarte un momento.",
  alternates: { canonical: "/catalogo/velas" },
};

export default function Velas() {
  // En producción el cliente solo tiene el catálogo pagado: esta sección va a WhatsApp desde el Linktree.
  if (isProductionMode()) notFound();
  const catalog = getCatalog();
  return (
    <>
      <PageHero
        crumbs={[{ href: "/links", label: "Inicio" }, { href: "/catalogo", label: "Catálogo" }, { label: "Velas" }]}
        eyebrow="Velas individuales"
        title={<>Velas para <Em>habitar</Em> tus espacios.</>}
        lead="Piezas hechas a mano en pequeños lotes, con ceras naturales y aromas elegidos con calma. Para regalar, decorar o regalarte un momento."
      />
      <section aria-label="Velas" className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12">
        <VelasBrowser products={catalog.products.filter((p) => p.type === "individual")} categories={candleCategories(catalog)} />
        <div className="mt-20">
          <CtaBand title="¿Buscas algo para tu evento?" text="Recuerdos, centros de mesa y velas de ceremonia hechos a la medida." action={<Button href="/catalogo/eventos">Explorar eventos</Button>} />
        </div>
      </section>
    </>
  );
}
