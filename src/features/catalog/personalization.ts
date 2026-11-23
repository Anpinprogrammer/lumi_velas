/** Opciones de personalización para eventos (textos del prototipo aprobado; editables). */
export const PERSONALIZATION = [
  { id: "aromas", name: "Aromas", description: "Vainilla, sándalo, lavanda, café, flores blancas o el aroma que defina tu celebración." },
  { id: "colores", name: "Colores", description: "Ajustamos el tono de la cera y los detalles a la paleta de tu evento." },
  { id: "formas", name: "Formas y tamaños", description: "Velas cónicas, pilares, frascos, latas o moldes especiales en distintos tamaños." },
  { id: "etiquetas", name: "Etiquetas con nombres o fechas", description: "Iniciales, nombres, fechas o una frase corta impresa en etiquetas artesanales." },
  { id: "empaques", name: "Empaques personalizados", description: "Cajas kraft, lino, cintas y tarjetas con el estilo de tu celebración." },
  { id: "medida", name: "Diseños completamente a medida", description: "Creamos contigo una pieza única desde cero, pensada solo para tu momento." },
] as const;

export type PersonalizationId = (typeof PERSONALIZATION)[number]["id"];

/** Pasos para cotizar (prototipo aprobado). */
export const QUOTE_STEPS = [
  ["Cuéntanos tu idea", "Completa la solicitud con el tipo de evento, la cantidad aproximada y lo que imaginas."],
  ["Conversamos por WhatsApp", "Tu solicitud llega como un mensaje organizado y resolvemos juntas cada detalle."],
  ["Recibe tu propuesta", "Te enviamos opciones de diseño, aromas y empaques con el valor según cantidad y personalización."],
  ["Creamos y entregamos", "Elaboramos cada pieza a mano y coordinamos la entrega para tu fecha."],
] as const;
