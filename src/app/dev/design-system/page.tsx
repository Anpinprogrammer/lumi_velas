import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Gift, Heart, Camera, Plus, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryCard } from "@/components/ui/category-card";
import { Container } from "@/components/ui/container";
import { IconButton } from "@/components/ui/icon-button";
import { ImageGallery } from "@/components/ui/image-gallery";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Select } from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { Textarea } from "@/components/ui/textarea";
import { ToastProvider } from "@/components/ui/toast";
import { InteractiveDemos } from "./demos";

export const metadata: Metadata = {
  title: "Sistema de diseño · Lumi",
  robots: { index: false, follow: false },
};

const swatches: { name: string; token: string; hex: string; note: string; dark?: boolean }[] = [
  { name: "Salvia", token: "sage-600", hex: "#666C48", note: "Primario · 5.2:1", dark: true },
  { name: "Salvia oscura", token: "sage-700", hex: "#4F5537", note: "Hover · 7.3:1", dark: true },
  { name: "Salvia suave", token: "sage-400", hex: "#858E65", note: "Decorativo", dark: true },
  { name: "Rosa", token: "blush-200", hex: "#FBD2CB", note: "Secundario" },
  { name: "Rosa claro", token: "blush-100", hex: "#FBDDD5", note: "Superficie" },
  { name: "Coral", token: "coral-600", hex: "#A84F3F", note: "Foco / acento · 5.1:1", dark: true },
  { name: "Ámbar", token: "amber-400", hex: "#D28A42", note: "Acento decorativo" },
  { name: "Llama", token: "flame", hex: "#FCBE5C", note: "Brillo / estacional" },
  { name: "Crema", token: "cream-50", hex: "#FBF7F0", note: "Fondo" },
  { name: "Vela", token: "cream-100", hex: "#F7E3D0", note: "Superficie cálida" },
  { name: "Kraft", token: "kraft-300", hex: "#E9C6A9", note: "Empaque" },
  { name: "Marrón del logo", token: "brown-700", hex: "#452E23", note: "Texto · tagline del logo", dark: true },
  { name: "Marrón medio", token: "brown-400", hex: "#846852", note: "Tono del mismo marrón", dark: true },
  { name: "Marfil", token: "ivory", hex: "#FEF5F1", note: "Superficies · vela del logo" },
];

const demoImages = [
  { src: "/brand/lumi-ilustracion.webp", alt: "Vela y detalle de lino (ilustración del logo)" },
  { src: "/brand/lumi-logo.webp", alt: "Logo completo de Lumi" },
];

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-t border-border py-12">
      <SectionHeading as="h2" title={title} className="mb-8" />
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  // En producción la ruta no existe salvo que se habilite explícitamente.
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_DESIGN_SYSTEM !== "true") {
    notFound();
  }
  return (
    <ToastProvider>
      <Container as="main" className="py-12">
        <header className="flex flex-col items-start gap-6 pb-12 sm:flex-row sm:items-center">
          <Image src="/brand/lumi-wordmark.webp" alt="Lumi · Velas · Recordatorios" width={240} height={79} priority />
          <div>
            <p className="eyebrow">Sistema de diseño · v0 propuesta</p>
            <h1 className="font-display text-[length:var(--text-h1)] leading-none">Lumi <em className="text-sage-600">design system</em></h1>
            <p className="mt-3 max-w-prose text-text-muted">
              Tipografías provisionales (compatibles, no idénticas al logo) pendientes de validación. Ruta solo para desarrollo, no indexada.
            </p>
          </div>
        </header>

        <Block id="logo" title="Logo y recursos">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="flex items-center justify-center"><Image src="/brand/lumi-logo.webp" alt="Logo completo" width={180} height={199} /></Card>
            <Card variant="warm" className="flex items-center justify-center"><Image src="/brand/lumi-wordmark.webp" alt="Wordmark" width={220} height={72} /></Card>
            <Card variant="dark" className="flex items-center justify-center"><Image src="/brand/lumi-wordmark-claro.webp" alt="Wordmark versión clara" width={220} height={72} /></Card>
          </div>
        </Block>

        <Block id="color" title="Color">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {swatches.map((s) => (
              <li key={s.token}>
                <div className="h-20 rounded-md border border-border" style={{ background: s.hex }} />
                <p className="mt-2 text-sm font-medium">{s.name}</p>
                <p className="text-[length:var(--text-caption)] text-text-muted">{s.hex} · {s.note}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="tipografia" title="Tipografía">
          <div className="flex flex-col gap-4">
            <p className="font-display text-[length:var(--text-h1)] leading-none">Pequeñas luces, <em className="text-coral-600">grandes</em> momentos</p>
            <p className="font-display text-[length:var(--text-h2)] leading-tight">Heading 2 — Cormorant Garamond</p>
            <p className="font-display text-[length:var(--text-h3)]">Heading 3 — Velas para habitar tus espacios</p>
            <p className="max-w-prose">Body — Plus Jakarta Sans. Creamos velas artesanales y detalles personalizados para iluminar tus celebraciones más especiales.</p>
            <p className="text-[length:var(--text-caption)] text-text-muted">Caption — Precios en pesos colombianos (COP)</p>
            <p className="eyebrow">Label · Velas · Recordatorios</p>
          </div>
        </Block>

        <Block id="formas" title="Radios, sombras y espaciado">
          <div className="grid gap-4 sm:grid-cols-4">
            {(["rounded-sm", "rounded-md", "rounded-lg", "rounded-pill"] as const).map((r) => (
              <div key={r} className={`flex h-24 items-center justify-center bg-blush-200 text-sm ${r}`}>{r.replace("rounded-", "radius ")}</div>
            ))}
            {(["shadow-soft", "shadow-lift", "shadow-glow"] as const).map((s) => (
              <div key={s} className={`flex h-24 items-center justify-center rounded-md bg-surface text-sm ${s}`}>{s}</div>
            ))}
          </div>
          <div className="mt-6 flex items-end gap-3">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1 text-[length:var(--text-caption)] text-text-muted">
                <div className="bg-sage-400" style={{ width: n * 4, height: n * 4 }} />{n}
              </div>
            ))}
          </div>
        </Block>

        <Block id="botones" title="Botones">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primario</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent">Acento</Button>
              <Button disabled>Deshabilitado</Button>
              <Button loading>Cargando</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Pequeño</Button>
              <Button size="md" leftIcon={<WhatsAppIcon className="size-4" />}>Cotiza por WhatsApp</Button>
              <Button size="lg" href="#logo" rightIcon={<Sparkles className="size-4" />}>Como enlace</Button>
              <IconButton label="Agregar" icon={<Plus />} variant="primary" />
              <IconButton label="Cámara" icon={<Camera />} variant="secondary" />
              <IconButton label="Favorito" icon={<Heart />} />
            </div>
          </div>
        </Block>

        <Block id="formularios" title="Formularios">
          <div className="grid max-w-3xl gap-5 sm:grid-cols-2">
            <Input label="Nombre del producto" placeholder="Vela Aurora" required />
            <Input label="Precio (COP)" inputMode="numeric" hint="Solo para productos individuales." />
            <Select label="Categoría" placeholder="Elige una" options={[{ value: "mat", label: "Matrimonios" }, { value: "bau", label: "Bautizos" }, { value: "cum", label: "Cumpleaños" }]} />
            <Input label="Enlace" defaultValue="javascript:alert(1)" error="Solo se permiten enlaces https, wa.me o mailto." />
            <Textarea className="sm:col-span-2" label="Descripción" hint="Máximo 400 caracteres." />
            <Input label="Deshabilitado" disabled defaultValue="No editable" />
          </div>
        </Block>

        <Block id="tarjetas" title="Badges y tarjetas">
          <div className="mb-8 flex flex-wrap gap-2">
            <Badge>Neutral</Badge><Badge variant="brand">Marca</Badge><Badge variant="blush">Rosa</Badge><Badge variant="accent">Favorita</Badge>
            <Badge variant="success">Publicado</Badge><Badge variant="warning">Oculto</Badge><Badge variant="error">Error</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCard name="Vela Aurora" href="#tarjetas" type="individual" priceCOP={35000} featured category="Serenidad" />
            <ProductCard name="Centro de mesa Gala" href="#tarjetas" type="evento" category="Para eventos" />
            <ProductCard name="Con foto" href="#tarjetas" type="individual" priceCOP={48000} imageSrc="/brand/lumi-ilustracion.webp" imageAlt="Vela con lazo" />
            <Card><p className="eyebrow">Card</p><p className="mt-2 text-text-muted">Superficie base con sombra suave.</p></Card>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <CategoryCard size="large" title="Matrimonios" description="Recuerdos para el día más importante" href="#tarjetas" icon={<Heart className="size-5" />} className="sm:col-span-2" />
            <CategoryCard title="Bautizos" description="Detalles delicados" href="#tarjetas" icon={<Gift className="size-5" />} />
          </div>
        </Block>

        <Block id="galeria" title="Galería de imágenes">
          <ImageGallery images={demoImages} className="max-w-sm" />
        </Block>

        <Block id="estados" title="Estados">
          <div className="grid gap-4 md:grid-cols-3">
            <EmptyState title="Aún no hay productos" description="Cuando publiques el primero aparecerá aquí." action={<Button size="sm">Crear producto</Button>} />
            <Card variant="outline"><LoadingState label="Cargando productos…" /></Card>
            <ErrorState description="Revisa tu conexión e inténtalo de nuevo." action={<Button size="sm" variant="secondary">Reintentar</Button>} />
          </div>
        </Block>

        <Block id="overlays" title="Modal, diálogo y toast">
          <InteractiveDemos />
        </Block>

        <Block id="estacional" title="Vista previa: tokens estacionales (navidad)">
          <div data-season="navidad" className="rounded-lg p-8" style={{ background: "linear-gradient(168deg,#666C48,#4F5537)", color: "#FBF7F0" }}>
            <p className="eyebrow" style={{ color: "#FBD2CB" }}>Navidad Lumi</p>
            <p className="mt-2 font-display text-4xl">Pequeños detalles que iluminan grandes momentos.</p>
            <Button className="mt-6 !bg-flame !text-brown-700">Explorar catálogo</Button>
          </div>
        </Block>
      </Container>
    </ToastProvider>
  );
}
