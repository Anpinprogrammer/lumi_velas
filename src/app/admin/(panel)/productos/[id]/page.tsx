import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ImageUploader } from "@/features/admin/components/image-uploader";
import { ProductImages } from "@/features/admin/components/lists";
import { ProductForm } from "@/features/admin/components/product-form";
import { ConfirmButton } from "@/features/admin/components/bits";
import { getProduct, listCategories } from "@/features/admin/queries";
import { uuidSchema } from "@/features/admin/schemas";
import { requireAdmin } from "@/lib/auth/admin";
import { deleteProduct, deleteProductImage, moveProductImage, saveProduct, updateImageAlt, uploadProductImages } from "../actions";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ guardado?: string; nuevo?: string; imgerror?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const q = await searchParams;
  if (!uuidSchema.safeParse(id).success) notFound();
  const [product, categories] = await Promise.all([getProduct(id), listCategories()]);
  if (!product) notFound();
  return (
    <Container size="wide" className="space-y-10 py-10">
      <header className="space-y-2">
        <h1 className="font-display text-[length:var(--text-h2)] leading-[1.05]">{product.name}</h1>
        {q.nuevo ? <p role="status" className="rounded-md bg-blush-100 p-3 text-sm">Producto creado y oculto. Súbele las fotos aquí abajo y publícalo cuando esté listo.</p> : null}
        {q.guardado ? <p role="status" className="rounded-md bg-blush-100 p-3 text-sm">Cambios guardados.</p> : null}
        {q.imgerror ? <p role="alert" className="rounded-md bg-blush-100 p-3 text-sm text-error">{q.imgerror.slice(0, 400)}</p> : null}
      </header>
      <ProductForm action={saveProduct} product={product} categories={categories} />
      <section id="imagenes" className="max-w-4xl space-y-4">
        <h2 className="font-display text-2xl">Fotos</h2>
        <ProductImages productId={product.id} images={product.images} actions={{ alt: updateImageAlt, move: moveProductImage, remove: deleteProductImage }} />
        <ImageUploader action={uploadProductImages} productId={product.id} />
      </section>
      <section className="max-w-2xl space-y-3 border-t border-border pt-6">
        <h2 className="font-display text-2xl">Eliminar producto</h2>
        <p className="text-sm text-text-muted">Se borran también sus fotos. Si solo quieres que deje de verse, mejor ocúltalo.</p>
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton message={`¿Eliminar «${product.name}» y todas sus fotos? No se puede deshacer.`} className="border border-error">Eliminar producto</ConfirmButton>
        </form>
      </section>
    </Container>
  );
}
