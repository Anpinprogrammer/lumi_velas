import { Container } from "@/components/ui/container";
import { PdfWorkspace } from "@/features/pdf/components/pdf-workspace";

export default function Page() {
  return (
    <Container size="wide" className="py-10">
      <PdfWorkspace />
    </Container>
  );
}
