import { Container } from "@/components/ui/container";
import { ProductForm } from "@/features/admin/components/product-form";
import { listCategories } from "@/features/admin/queries";
import { requireAdmin } from "@/lib/auth/admin";
import { saveProduct } from "../actions";

export default async function Page() {
  await requireAdmin();
  const categories = await listCategories();
  return (
    <Container size="wide" className="space-y-6 py-10">
      <div className="space-y-2">
        <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Nuevo producto</h1>
        <p className="text-text-muted">Se crea oculto. Al guardar podrás subirle las fotos y publicarlo.</p>
      </div>
      <ProductForm action={saveProduct} categories={categories} />
    </Container>
  );
}
