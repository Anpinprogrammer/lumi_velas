import Image from "next/image";

/** Marcador temporal: el Linktree "Lumi Experience" ocupará "/" en la Fase 3. */
export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Image src="/brand/lumi-logo.webp" alt="Lumi · Velas · Recordatorios" width={260} height={287} priority />
      <p className="eyebrow">Próximamente</p>
    </main>
  );
}
