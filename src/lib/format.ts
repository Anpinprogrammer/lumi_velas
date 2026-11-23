const cop = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** 35000 -> "$ 35.000" (COP, sin decimales). */
export function formatCOP(value: number): string {
  return cop.format(value);
}
