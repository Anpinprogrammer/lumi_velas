import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/** Marcador honesto de una ruta cuya funcionalidad llega en una fase posterior. No es contenido final. */
export function PhasePlaceholder({ title, phase, note }: { title: string; phase: string; note?: string }) {
  return (
    <Container as="main" size="narrow" className="py-16">
      <SectionHeading as="h1" eyebrow={`En construcción · ${phase}`} title={title} description={note} />
    </Container>
  );
}
