import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { LinkForm } from "@/features/admin/components/link-form";
import { getLink } from "@/features/admin/queries";
import { uuidSchema } from "@/features/admin/schemas";
import { requireAdmin } from "@/lib/auth/admin";
import { saveLink } from "../actions";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!uuidSchema.safeParse(id).success) notFound();
  const link = await getLink(id);
  if (!link) notFound();
  return (
    <Container size="wide" className="space-y-6 py-10">
      <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Editar enlace</h1>
      <LinkForm action={saveLink} link={link} />
    </Container>
  );
}
