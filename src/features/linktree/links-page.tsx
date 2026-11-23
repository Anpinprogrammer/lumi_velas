import Image from "next/image";

/**
 * Marcador del Linktree "Lumi Experience" (Fase 3). Sirve en "/" y en "/links".
 * Estrategia: "/" y "/links" renderizan este mismo componente; la URL canónica es /links,
 * de modo que cuando la web completa ocupe "/", el Linktree siga vivo en /links sin enlaces rotos.
 */
export function LinksPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/brand/lumi-logo.webp" alt="Lumi · Velas · Recordatorios" width={260} height={287} priority />
      <p className="eyebrow">Próximamente</p>
    </main>
  );
}
