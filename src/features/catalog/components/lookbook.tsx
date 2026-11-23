"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Download, LayoutGrid, Maximize, MessageCircle } from "lucide-react";
import { Button, Modal } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatCOP } from "@/lib/format";
import { buildWhatsAppUrl } from "@/lib/validation/url";
import { productInquiryMessage } from "../whatsapp";
import type { CatalogProduct } from "../types";
import { QuoteButton } from "./quote-dialog";
import "./lookbook.css";

export type LookbookItem = CatalogProduct & { categoryName: string };

type Props = {
  items: readonly LookbookItem[];
  events: ReadonlyArray<{ slug: string; name: string }>;
  whatsapp: string | null;
  siteUrl: string;
  /** Catálogo PDF publicado (descarga). Sin valor, no se muestran los botones. */
  pdfUrl?: string;
  coverImage: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** Última palabra del nombre en cursiva, como en el prototipo aprobado. */
function Title({ name }: { name: string }) {
  const w = name.split(" ");
  const last = w.pop();
  return (
    <>
      {w.length ? `${w.join(" ")} ` : null}
      <em>{last}</em>
    </>
  );
}

/**
 * Catálogo web en modo slider (estructura aprobada por el cliente en el prototipo, vista #catalogo):
 * portada → una diapositiva por pieza → cierre de contacto. Flechas, teclado, deslizar, miniaturas,
 * índice y pantalla completa. Solo transform/opacity; con movimiento reducido las transiciones se anulan.
 */
export function Lookbook({ items, events, whatsapp, siteUrl, coverImage, pdfUrl }: Props) {
  const last = items.length + 1;
  const [i, setI] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const [canFs, setCanFs] = useState(false);
  const [hint, setHint] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback((k: number) => setI(Math.max(0, Math.min(last, k))), [last]);

  useEffect(() => {
    // Capacidades del navegador: solo se conocen en el cliente.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanFs(Boolean(document.fullscreenEnabled));
    if (window.matchMedia("(hover: none)").matches) {
      const a = setTimeout(() => setHint(true), 1400);
      const b = setTimeout(() => setHint(false), 4600);
      return () => {
        clearTimeout(a);
        clearTimeout(b);
      };
    }
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (indexOpen || e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, dialog[open]")) return;
      const d = ({ ArrowRight: 1, ArrowLeft: -1, PageDown: 1, PageUp: -1 } as Record<string, number>)[e.key];
      if (d) {
        e.preventDefault();
        setI((cur) => Math.max(0, Math.min(last, cur + d)));
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(last);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, last, indexOpen]);

  useEffect(() => {
    const s = strip.current;
    const b = s?.querySelector<HTMLElement>(`[data-go="${i}"]`);
    if (s && b) s.scrollTo({ left: b.offsetLeft - s.clientWidth / 2 + b.clientWidth / 2 });
  }, [i]);

  const label = i === 0 ? "Portada" : i === last ? "Contacto" : `${items[i - 1].name}, ${i} de ${items.length}`;

  return (
    <div ref={root} className="lb" aria-roledescription="carrusel" aria-label="Catálogo Lumi">
      <div className="lb-bar">
        <div>
          <Link href="/links" className="lb-back">
            <ArrowLeft aria-hidden className="size-4" />
            <span className="t">Volver</span>
          </Link>
        </div>
        <Link href="/links" aria-label="Lumi, inicio" className="lb-logo">
          <Image src="/brand/lumi-wordmark.webp" alt="" width={200} height={66} priority className="h-auto w-20 sm:w-24" />
          <small>Catálogo</small>
        </Link>
        <div className="lb-r">
          {pdfUrl && (
            <a href={pdfUrl} download className="lb-ibtn" aria-label="Descargar catálogo en PDF" title="Descargar PDF">
              <Download aria-hidden className="size-[18px]" />
            </a>
          )}
          <button type="button" className="lb-ibtn" aria-label="Ver índice de piezas" title="Índice" onClick={() => setIndexOpen(true)}>
            <LayoutGrid aria-hidden className="size-[18px]" />
          </button>
          {canFs && (
            <button
              type="button"
              className="lb-ibtn lb-fs"
              aria-label="Pantalla completa"
              title="Pantalla completa"
              onClick={() => (document.fullscreenElement ? document.exitFullscreen() : root.current?.requestFullscreen())?.catch(() => {})}
            >
              <Maximize aria-hidden className="size-[18px]" />
            </button>
          )}
        </div>
      </div>

      <div
        className="lb-stage"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={(e) => {
          const s = touch.current;
          touch.current = null;
          if (!s) return;
          const dx = e.changedTouches[0].clientX - s.x;
          const dy = e.changedTouches[0].clientY - s.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) go(i + (dx < 0 ? 1 : -1));
        }}
      >
        {/* Portada */}
        <section className={cn("lb-slide", i === 0 && "is-active")} aria-roledescription="diapositiva" aria-label="Portada" aria-hidden={i !== 0} inert={i !== 0}>
          <div className="lb-cover">
            <div className="lb-cover-bg">
              <Image src={coverImage} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>
            <div className="lb-cover-in">
              <p className="eyebrow lb-eyebrow-light">Velas · Recordatorios</p>
              <h1 className="lb-cover-logo">
                <Image src="/brand/lumi-wordmark-claro.webp" alt="Lumi" width={200} height={66} priority className="h-auto w-full" />
              </h1>
              <p className="lb-cover-sub">Catálogo de colección</p>
              <p className="lb-cover-meta">{items.length} piezas · Momentos que brillan</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button className="lb-btn-light" rightIcon={<ArrowRight className="size-4" aria-hidden />} onClick={() => go(1)}>
                  Comenzar recorrido
                </Button>
                {pdfUrl && (
                  <Button href={pdfUrl} download variant="secondary" className="lb-btn-outline" leftIcon={<Download className="size-4" aria-hidden />}>
                    Descargar PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {items.map((p, k) => {
          const n = k + 1;
          const on = i === n;
          const isEvent = p.type === "evento";
          const specs = Object.entries(p.specs ?? {}).slice(0, 3);
          return (
            <section
              key={p.id}
              className={cn("lb-slide", k % 2 === 0 && "arch", on && "is-active")}
              aria-roledescription="diapositiva"
              aria-label={`${p.name}, ${n} de ${items.length}`}
              aria-hidden={!on}
              inert={!on}
            >
              <div className="lb-amb" aria-hidden>
                {Math.abs(i - n) <= 1 && <Image src={p.images[0].src} alt="" fill sizes="40vw" className="object-cover" />}
              </div>
              <div className="lb-media">
                <span className="lb-num" aria-hidden>
                  <small>{isEvent ? "Para eventos" : "Pieza"}</small>
                  {pad(n)}
                </span>
                <div className="lb-frame">
                  {isEvent ? <span className="lb-tag">Personalizable</span> : p.featured ? <span className="lb-tag lb-tag--accent">Favorita</span> : null}
                  {Math.abs(i - n) <= 2 && (
                    <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width: 900px) 45vw, 80vw" className="object-cover" />
                  )}
                </div>
              </div>
              <div className="lb-info">
                <p className="eyebrow">{p.categoryName}</p>
                <h2 className="lb-title">
                  <Title name={p.name} />
                </h2>
                <p className="lb-desc">{p.description}</p>
                {specs.length > 0 && (
                  <dl className="lb-specs">
                    {specs.map(([a, b]) => (
                      <div key={a}>
                        <dt>{a}</dt>
                        <dd>{b}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {isEvent || p.priceCOP === null ? (
                  <p className="lb-price q">
                    Precio a cotizar <small>según cantidad y personalización</small>
                  </p>
                ) : (
                  <p className="lb-price">
                    {formatCOP(p.priceCOP)} <small>COP</small>
                  </p>
                )}
                <div className="lb-cta">
                  {whatsapp &&
                    (isEvent ? (
                      <QuoteButton whatsapp={whatsapp} events={events} defaultEvent={p.categories[0]} product={{ name: p.name, image: p.images[0].src }} />
                    ) : (
                      <Button
                        href={buildWhatsAppUrl(whatsapp, productInquiryMessage(p, `${siteUrl}/catalogo/producto/${p.slug}`))}
                        target="_blank"
                        leftIcon={<MessageCircle className="size-4" aria-hidden />}
                      >
                        Lo quiero
                      </Button>
                    ))}
                  <Link href={`/catalogo/producto/${p.slug}`} className="lb-link">
                    Ver detalles <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })}

        {/* Cierre */}
        <section className={cn("lb-slide", i === last && "is-active")} aria-roledescription="diapositiva" aria-label="Contacto" aria-hidden={i !== last} inert={i !== last}>
          <div className="lb-cover lb-end">
            <div className="lb-cover-in">
              <p className="eyebrow lb-eyebrow-light">Hagamos realidad tu idea</p>
              <h2 className="lb-end-title">
                ¿Lista para <em>encender</em> tu momento?
              </h2>
              <p className="lb-end-text">Escríbenos y te ayudamos a elegir, personalizar y preparar cada detalle para tu celebración o tu espacio.</p>
              {whatsapp && (
                <div className="flex flex-wrap justify-center gap-3">
                  <QuoteButton whatsapp={whatsapp} events={events} label="Cotiza tu evento" className="lb-btn-light" />
                  <Button
                    href={buildWhatsAppUrl(whatsapp, "Hola Lumi, vi el catálogo y quiero más información.")}
                    target="_blank"
                    variant="secondary"
                    className="lb-btn-outline"
                    leftIcon={<MessageCircle className="size-4" aria-hidden />}
                  >
                    Escríbenos
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-3">
                <Button size="sm" variant="secondary" className="lb-btn-outline" onClick={() => go(0)}>
                  Volver al inicio del catálogo
                </Button>
                <Button size="sm" variant="secondary" className="lb-btn-outline" href="/catalogo/eventos">
                  Ver eventos
                </Button>
                {pdfUrl && (
                  <Button size="sm" variant="secondary" className="lb-btn-outline" href={pdfUrl} download leftIcon={<Download className="size-4" aria-hidden />}>
                    Descargar PDF
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="lb-controls">
        <div className="lb-count" aria-hidden>
          {i === 0 ? <i>Portada</i> : i === last ? <i>Contacto</i> : (
            <>
              <i>{pad(i)}</i> <span>/ {pad(items.length)}</span>
            </>
          )}
        </div>
        <div className="lb-prog" aria-hidden>
          <b style={{ width: `${(i / last) * 100}%` }} />
        </div>
        <div className="lb-strip" ref={strip}>
          <button type="button" data-go={0} aria-label="Ir a la portada" aria-current={i === 0} onClick={() => go(0)}>
            <span className="sb-txt">L</span>
          </button>
          {items.map((p, k) => (
            <button key={p.id} type="button" data-go={k + 1} aria-label={`Ir a ${p.name}`} aria-current={i === k + 1} onClick={() => go(k + 1)}>
              <Image src={p.images[0].src} alt="" width={40} height={50} className="size-full object-cover" />
            </button>
          ))}
          <button type="button" data-go={last} aria-label="Ir a contacto" aria-current={i === last} onClick={() => go(last)}>
            <span className="sb-txt">✦</span>
          </button>
        </div>
        <div className="lb-nav">
          <button type="button" className="lb-ibtn" aria-label="Anterior" disabled={i === 0} onClick={() => go(i - 1)}>
            <ArrowLeft aria-hidden className="size-[18px]" />
          </button>
          <button type="button" className="lb-ibtn" aria-label="Siguiente" disabled={i === last} onClick={() => go(i + 1)}>
            <ArrowRight aria-hidden className="size-[18px]" />
          </button>
        </div>
      </div>
      <span className={cn("lb-hint", hint && "show")} aria-hidden>
        Desliza para ver más
      </span>
      <p className="sr-only" aria-live="polite">
        {label}
      </p>

      <Modal open={indexOpen} onClose={() => setIndexOpen(false)} title="Índice del catálogo" description={`${items.length} piezas`} size="lg" className="max-w-4xl">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((p, k) => (
            <li key={p.id}>
              <button
                type="button"
                aria-current={i === k + 1}
                onClick={() => {
                  go(k + 1);
                  setIndexOpen(false);
                }}
                className="group flex w-full flex-col gap-2 text-left"
              >
                <span className="relative block aspect-[4/5] overflow-hidden rounded-md bg-cream-100 group-aria-[current=true]:outline group-aria-[current=true]:outline-2 group-aria-[current=true]:outline-offset-2 group-aria-[current=true]:outline-sage-600">
                  <Image src={p.images[0].src} alt="" fill sizes="200px" className="object-cover" />
                </span>
                <span className="font-display text-lg leading-tight">{p.name}</span>
                <span className="text-xs text-text-muted">{p.type === "individual" && p.priceCOP !== null ? formatCOP(p.priceCOP) : "A cotizar"}</span>
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  );
}
