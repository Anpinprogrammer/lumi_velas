import { ProductCard } from "@/components/ui";
import { primaryCategoryName } from "../data";
import type { CatalogProduct } from "../types";

export function ProductGrid({ products }: { products: readonly CatalogProduct[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard
            name={p.name}
            href={`/catalogo/producto/${p.slug}`}
            type={p.type}
            priceCOP={p.priceCOP}
            imageSrc={p.images[0]?.src}
            imageAlt={p.images[0]?.alt}
            featured={p.featured && p.type === "individual"}
            category={primaryCategoryName(p)}
          />
        </li>
      ))}
    </ul>
  );
}
