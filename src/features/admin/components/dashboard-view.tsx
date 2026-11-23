import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "../queries";

const dateFmt = new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeZone: "America/Bogota" });

function Stat({ label, value, detail, href }: { label: string; value: number | string; detail: string; href: string }) {
  return (
    <Card as={Link} href={href} interactive className="flex flex-col gap-1 p-5">
      <span className="eyebrow">{label}</span>
      <span className="font-display text-5xl leading-none">{value}</span>
      <span className="text-sm text-text-muted">{detail}</span>
    </Card>
  );
}

export function DashboardView({ stats, email }: { stats: DashboardStats; email: string | null }) {
  const alerts: { text: string; href?: string; cta?: string }[] = [];
  if (!stats.hasWhatsapp) alerts.push({ text: "Falta el número de WhatsApp: los botones de contacto no se muestran. Defínelo en la variable WHATSAPP_NUMBER de Vercel o en la tabla site_settings (clave whatsapp_number)." });
  if (stats.products.published === 0) alerts.push({ text: "No hay productos publicados: el catálogo muestra datos de muestra.", href: "/admin/productos", cta: "Ir a productos" });
  if (stats.links.active === 0) alerts.push({ text: "No hay enlaces visibles: el Linktree usa los enlaces por defecto.", href: "/admin/links", cta: "Ir a enlaces" });
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Lumi Studio</p>
        <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Resumen</h1>
        {email ? <p className="text-text-muted">Sesión de {email}</p> : null}
      </header>
      {alerts.length > 0 ? (
        <ul className="space-y-2">
          {alerts.map((a) => (
            <li key={a.text} className="flex items-start gap-3 rounded-2xl border border-border bg-blush-100 p-4 text-sm">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-coral-600" aria-hidden />
              <span>
                {a.text}{" "}
                {a.href ? <Link href={a.href} className="underline underline-offset-4">{a.cta}</Link> : null}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Productos" value={stats.products.published} detail={`publicados · ${stats.products.hidden} ocultos · ${stats.products.featured} destacados`} href="/admin/productos" />
        <Stat label="Enlaces" value={stats.links.active} detail={`visibles en el Linktree · ${stats.links.inactive} ocultos`} href="/admin/links" />
        <Stat label="Categorías" value={stats.categories} detail="eventos y colecciones de velas" href="/admin/productos" />
        <Stat
          label="Catálogo PDF"
          value={stats.pdf ? `v${stats.pdf.version}` : "—"}
          detail={stats.pdf ? `${stats.pdf.isPublished ? "publicada" : "sin publicar"} · ${dateFmt.format(new Date(stats.pdf.generatedAt))}` : "aún no hay versiones guardadas"}
          href="/admin/catalogo-pdf"
        />
      </div>
    </div>
  );
}
