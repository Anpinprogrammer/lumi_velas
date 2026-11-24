import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AdminHeader } from "@/features/admin/components/admin-header";
import { DashboardView } from "@/features/admin/components/dashboard-view";
import { LinkForm } from "@/features/admin/components/link-form";
import { LinksList, ProductImages, ProductsList } from "@/features/admin/components/lists";
import { ProductForm } from "@/features/admin/components/product-form";
import { ImageUploader } from "@/features/admin/components/image-uploader";
import type { AdminCategory, AdminLink, AdminProduct } from "@/features/admin/queries";

export const metadata: Metadata = { title: "Panel (vista de diseño) · Lumi", robots: { index: false, follow: false } };

/**
 * Vista de DISEÑO del panel con datos inventados, para revisarlo sin Supabase. Las acciones no hacen nada.
 * Solo existe en desarrollo (o con NEXT_PUBLIC_SHOW_DESIGN_SYSTEM=true), como /dev/design-system.
 */
const IMG = (s: string) => `/mock/catalogo/${s}.webp`;
const cats: AdminCategory[] = [
  { id: "c1", slug: "matrimonios", name: "Matrimonios", kind: "evento" },
  { id: "c2", slug: "bautizos", name: "Bautizos y primeras comuniones", kind: "evento" },
  { id: "c3", slug: "serenidad", name: "Serenidad", kind: "vela" },
];
const products: AdminProduct[] = [
  { id: "p1", slug: "vela-aurora", name: "Vela Aurora", description: "Cera de soja con notas de vainilla.", type: "individual", priceCOP: 35000, status: "published", isFeatured: true, sortOrder: 0, categoryIds: ["c3"], images: [{ id: "i1", path: "x", url: IMG("vela-aurora"), alt: "Vela Aurora encendida", sortOrder: 0 }, { id: "i2", path: "y", url: IMG("vela-aurora-detalle"), alt: null, sortOrder: 1 }] },
  { id: "p2", slug: "recuerdo-lumi", name: "Recuerdo Lumi", description: null, type: "evento", priceCOP: null, status: "hidden", isFeatured: false, sortOrder: 1, categoryIds: ["c1", "c2"], images: [] },
];
const links: AdminLink[] = [
  { id: "l1", label: "Explorar catálogo", description: "Velas y detalles hechos a mano", url: "/catalogo", style: "featured", icon: "book-open", imagePath: null, imageUrl: null, isActive: true, isFeatured: true, sortOrder: 0 },
  { id: "l2", label: "Instagram", description: null, url: "https://www.instagram.com/lumi", style: "compact", icon: "instagram", imagePath: null, imageUrl: null, isActive: false, isFeatured: false, sortOrder: 1 },
];

async function noop() {
  "use server";
}
async function noopState() {
  "use server";
  return {};
}

export default function Page() {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_DESIGN_SYSTEM !== "true") notFound();
  const names = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  return (
    <>
    <AdminHeader email="admin@ejemplo.co" signOut={noop} />
    <Container size="wide" className="space-y-14 py-10">
      <p className="rounded-md bg-blush-100 p-3 text-sm">Vista de diseño con datos inventados: las acciones no hacen nada. El panel real está en /admin.</p>
      <DashboardView email="admin@ejemplo.co" stats={{ products: { published: 1, hidden: 1, featured: 1 }, links: { active: 1, inactive: 1 }, categories: 3, pdf: null, hasWhatsapp: false }} />
      <section className="space-y-4"><h2 className="font-display text-3xl">Enlaces</h2><LinksList links={links} actions={{ toggle: noop, move: noop, remove: noop }} /></section>
      <section className="space-y-4"><h2 className="font-display text-3xl">Formulario de enlace</h2><LinkForm action={noopState} link={links[0]} /></section>
      <section className="space-y-4"><h2 className="font-display text-3xl">Productos</h2><ProductsList products={products} categoryNames={names} actions={{ setStatus: noop, move: noop }} /></section>
      <section className="space-y-4"><h2 className="font-display text-3xl">Formulario de producto</h2><ProductForm action={noopState} product={products[0]} categories={cats} /></section>
      <section className="space-y-4"><h2 className="font-display text-3xl">Fotos</h2><ProductImages productId="p1" images={products[0].images} actions={{ alt: noop, move: noop, remove: noop }} /><ImageUploader action={noopState} productId="p1" /></section>
    </Container>
    </>
  );
}
