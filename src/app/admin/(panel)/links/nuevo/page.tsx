import { Container } from "@/components/ui/container";
import { LinkForm } from "@/features/admin/components/link-form";
import { requireAdmin } from "@/lib/auth/admin";
import { saveLink } from "../actions";

export default async function Page() {
  await requireAdmin();
  return (
    <Container size="wide" className="space-y-6 py-10">
      <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Nuevo enlace</h1>
      <LinkForm action={saveLink} />
    </Container>
  );
}
