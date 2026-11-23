import { z } from "zod";
import { formatCOP } from "@/lib/format";
import { PERSONALIZATION } from "./personalization";
import type { CatalogProduct } from "./types";

/** Mensaje para consultar un producto individual. */
export function productInquiryMessage(p: Pick<CatalogProduct, "name" | "priceCOP" | "type">, url: string): string {
  if (p.type === "evento") return `Hola Lumi, quiero cotizar "${p.name}" para un evento.\n${url}`;
  const price = typeof p.priceCOP === "number" ? ` (${formatCOP(p.priceCOP)})` : "";
  return `Hola Lumi, me interesa la ${p.name}${price}. ¿Me cuentas más sobre disponibilidad y entrega?\n${url}`;
}

const optionNames = PERSONALIZATION.map((o) => o.name) as [string, ...string[]];

/** Validación de la solicitud de cotización (cliente y pruebas usan el mismo esquema). */
export function quoteSchema(eventSlugs: readonly string[]) {
  return z.object({
    name: z.string().trim().min(1, "Cuéntanos cómo te llamas.").max(60, "Máximo 60 caracteres."),
    event: z.string().refine((v) => eventSlugs.includes(v), "Elige el tipo de evento."),
    month: z
      .string()
      .trim()
      .refine((v) => v === "" || /^\d{4}-(0[1-9]|1[0-2])$/.test(v), "Fecha no válida.")
      .optional()
      .default(""),
    quantity: z
      .string()
      .trim()
      .refine((v) => v === "" || (/^\d+$/.test(v) && +v >= 1 && +v <= 100000), "Ingresa una cantidad válida (1 o más).")
      .optional()
      .default(""),
    options: z.array(z.enum(optionNames)).max(optionNames.length).default([]),
    idea: z.string().trim().max(500, "Máximo 500 caracteres.").optional().default(""),
  });
}
export type QuoteInput = z.infer<ReturnType<typeof quoteSchema>>;

/** "2027-03" -> "marzo de 2027" (sin depender de la zona horaria). */
export function formatMonth(value: string): string {
  const [y, m] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
}

/** Mensaje de cotización para eventos, en el formato del prototipo aprobado. */
export function quoteMessage(q: QuoteInput, eventName: string, productName?: string): string {
  const lines = [`Hola Lumi, soy ${q.name}. Quiero cotizar detalles para un evento.`, "", `• Evento: ${eventName}`];
  if (productName) lines.push(`• Producto de interés: ${productName}`);
  if (q.month) lines.push(`• Fecha aproximada: ${formatMonth(q.month)}`);
  if (q.quantity) lines.push(`• Cantidad aproximada: ${q.quantity}`);
  if (q.options.length) lines.push(`• Personalización: ${q.options.join(", ")}`);
  if (q.idea) lines.push("", q.idea);
  return lines.join("\n");
}
