"use client";

import Image from "next/image";
import { useId, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy, Pencil } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { Button, Input, Modal, Select, Textarea } from "@/components/ui";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { buildWhatsAppUrl } from "@/lib/validation/url";
import { PERSONALIZATION } from "../personalization";
import { quoteMessage, quoteSchema } from "../whatsapp";

type Props = {
  whatsapp: string;
  events: ReadonlyArray<{ slug: string; name: string }>;
  defaultEvent?: string;
  product?: { name: string; image?: string };
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

type Errors = Partial<Record<"name" | "event" | "month" | "quantity" | "idea", string>>;

/**
 * Botón + formulario de cotización para eventos. No guarda nada: valida, arma un mensaje
 * organizado y lo abre en WhatsApp (canal principal de contacto). Sin pagos ni checkout.
 */
export function QuoteButton({ whatsapp, events, defaultEvent = "", product, label = "Solicitar cotización", variant = "primary", size = "md", className }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [options, setOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const formId = useId();

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = quoteSchema(events.map((x) => x.slug)).safeParse({
      name: fd.get("name") ?? "",
      event: fd.get("event") ?? "",
      month: fd.get("month") ?? "",
      quantity: fd.get("quantity") ?? "",
      options,
      idea: fd.get("idea") ?? "",
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof Errors;
        if (k && !next[k]) next[k] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setErrors({});
    const eventName = events.find((x) => x.slug === parsed.data.event)?.name ?? parsed.data.event;
    setMessage(quoteMessage(parsed.data, eventName, product?.name));
  }

  async function copy() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <Button variant={variant} size={size} className={className} rightIcon={<ArrowRight className="size-4" aria-hidden />} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={message ? "Tu solicitud está lista" : "Cotiza tu evento"}
        description={message ? "Revisa el mensaje y envíalo por WhatsApp." : "Te respondemos por WhatsApp con una propuesta sin compromiso."}
        size="lg"
        footer={
          message ? (
            <>
              <Button variant="ghost" leftIcon={<Pencil className="size-4" aria-hidden />} onClick={() => setMessage(null)}>Editar</Button>
              <Button variant="secondary" leftIcon={copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />} onClick={copy}>
                {copied ? "Copiado" : "Copiar mensaje"}
              </Button>
              <Button href={buildWhatsAppUrl(whatsapp, message)} target="_blank" leftIcon={<WhatsAppIcon className="size-4" aria-hidden />}>Abrir WhatsApp</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" form={formId} rightIcon={<ArrowRight className="size-4" aria-hidden />}>Preparar mensaje</Button>
            </>
          )
        }
      >
        <span role="status" aria-live="polite" className="sr-only">{copied ? "Mensaje copiado" : ""}</span>
        {message ? (
          <div className="rounded-lg bg-sage-600/10 p-4">
            <p className="ml-auto max-w-[90%] whitespace-pre-line rounded-md rounded-tr-none bg-ivory p-4 text-sm shadow-soft">{message}</p>
          </div>
        ) : (
          <form id={formId} onSubmit={submit} noValidate className="flex flex-col gap-5">
            {product && (
              <div className="flex items-center gap-3 rounded-md bg-cream-100 p-3">
                {product.image && <Image src={product.image} alt="" width={48} height={60} className="h-15 w-12 rounded-sm object-cover" />}
                <div>
                  <p className="text-xs text-text-muted">Producto de interés</p>
                  <p className="font-medium">{product.name}</p>
                </div>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <Input name="name" label="Tu nombre" autoComplete="name" required maxLength={60} error={errors.name} />
              <Select
                name="event"
                label="Tipo de evento"
                required
                placeholder="Selecciona"
                defaultValue={defaultEvent}
                options={events.map((x) => ({ value: x.slug, label: x.name }))}
                error={errors.event}
              />
              <Input name="month" type="month" label="Fecha aproximada" hint="Opcional" error={errors.month} />
              <Input name="quantity" type="number" inputMode="numeric" min={1} label="Cantidad aproximada" placeholder="Ej. 80" hint="Opcional" error={errors.quantity} />
            </div>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-[length:var(--text-label)] font-medium tracking-wide">Personalización que te interesa</legend>
              <div className="flex flex-wrap gap-2">
                {PERSONALIZATION.map((o) => {
                  const on = options.includes(o.name);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setOptions((cur) => (on ? cur.filter((x) => x !== o.name) : [...cur, o.name]))}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-1.5 rounded-pill border px-4 text-sm transition-colors",
                        on ? "border-sage-600 bg-sage-600 text-ivory" : "border-border bg-surface hover:border-sage-600/60",
                      )}
                    >
                      {on && <Check aria-hidden className="size-3.5" />}
                      {o.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <Textarea name="idea" label="Cuéntanos tu idea" placeholder="Colores, estilo, aromas, lo que imaginas…" maxLength={500} hint="Opcional" error={errors.idea} />
          </form>
        )}
      </Modal>
    </>
  );
}
