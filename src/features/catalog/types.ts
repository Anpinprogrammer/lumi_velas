/**
 * Modelo del catálogo que consumen las páginas. Hoy se llena con datos de muestra (mock-data.ts);
 * cuando el cliente entregue fotos y textos se llenará desde Supabase con la MISMA forma
 * (tablas products, product_images, categories, product_categories). Ver docs/catalog.md.
 */
export type ProductType = "individual" | "evento";
export type CategoryKind = "evento" | "vela";

export type CatalogImage = { src: string; alt: string };

export type CatalogCategory = {
  slug: string;
  name: string;
  kind: CategoryKind;
  /** Frase corta para tarjetas. */
  description: string;
  /** Texto de presentación de la página de la categoría (solo eventos). */
  intro?: string;
  /** Ideas de inspiración (solo eventos). */
  ideas?: readonly string[];
  image?: CatalogImage;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: ProductType;
  /** Solo individuales. Los productos para eventos se cotizan (nunca llevan precio). */
  priceCOP: number | null;
  featured: boolean;
  /** Slugs de categorías (un producto puede tener varias). */
  categories: readonly string[];
  /** La primera es la portada. */
  images: readonly CatalogImage[];
  /** Ficha técnica opcional (clave → valor). */
  specs?: Readonly<Record<string, string>>;
};

export type Catalog = {
  categories: readonly CatalogCategory[];
  products: readonly CatalogProduct[];
  /** "mock" mientras se usan datos de muestra. */
  source: "mock" | "supabase";
};
