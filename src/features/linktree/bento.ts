import type { LinkItem } from "./types";

/**
 * Cuántas columnas ocupa cada enlace "principal" (no compact) en la cuadrícula bento de 2 columnas.
 * featured/image ocupan el ancho completo; los standard se emparejan de a dos y, si una tanda de
 * standard consecutivos es impar, el último se estira para no dejar huecos.
 */
export function bentoSpans(links: ReadonlyArray<Pick<LinkItem, "style">>): Array<1 | 2> {
  const spans: Array<1 | 2> = links.map(() => 2);
  let i = 0;
  while (i < links.length) {
    if (links[i].style !== "standard") { i++; continue; }
    let j = i;
    while (j < links.length && links[j].style === "standard") j++;
    const run = j - i;
    for (let k = i; k < j; k++) spans[k] = k === j - 1 && run % 2 === 1 ? 2 : 1;
    i = j;
  }
  return spans;
}
