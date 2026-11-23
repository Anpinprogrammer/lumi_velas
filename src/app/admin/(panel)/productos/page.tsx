import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ProductsList } from "@/features/admin/components/lists";
import { listCategories, listProducts } from "@/features/admin/queries";
import { requireAdmin } from "@/lib/auth/admin";
import { moveProduct, setProductStatus } from "./actions";

export default async function Page() {
  await requireAdmin();
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);
  const names = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const published = products.filter((p) => p.status === "published").length;
  return (
    <Container size="wide" className="space-y-6 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow">Lumi Studio</p>
          <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">Productos</h1>
          <p className="max-w-2xl text-text-muted">
            {products.length} en total, {published} publicados. Los ocultos solo los ves tú y nunca aparecen en el catálogo ni en el PDF. El orden de esta lista es el del catálogo.
          </p>
        </div>
        <Button href="/admin/productos/nuevo">Nuevo producto</Button>
      </header>
      <ProductsList products={products} categoryNames={names} actions={{ setStatus: setProductStatus, move: moveProduct }} />
    </Container>
  );
}
