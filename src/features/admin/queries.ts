import "server-only";
import { createClient } from "@/lib/supabase/server";
import { siteMediaUrl } from "@/lib/supabase/public";

/**
 * Lecturas del panel. Usan el cliente con la sesión de la administradora: RLS le permite ver TODO
 * (también lo oculto), a diferencia del cliente público. Cada página llama antes a requireAdmin().
 */

export type AdminLink = {
  id: string;
  label: string;
  description: string | null;
  url: string;
  style: string;
  icon: string | null;
  imagePath: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type AdminCategory = { id: string; slug: string; name: string; kind: "evento" | "vela" };
export type AdminImage = { id: string; path: string; url: string | null; alt: string | null; sortOrder: number };
export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  type: "individual" | "evento";
  priceCOP: number | null;
  status: "published" | "hidden";
  isFeatured: boolean;
  sortOrder: number;
  categoryIds: string[];
  images: AdminImage[];
};

type LinkRow = { id: string; label: string; description: string | null; url: string; style: string; icon: string | null; image_path: string | null; is_active: boolean; is_featured: boolean; sort_order: number };

const toLink = (r: LinkRow): AdminLink => ({
  id: r.id,
  label: r.label,
  description: r.description,
  url: r.url,
  style: r.style,
  icon: r.icon,
  imagePath: r.image_path,
  imageUrl: r.image_path ? siteMediaUrl(r.image_path) : null,
  isActive: r.is_active,
  isFeatured: r.is_featured,
  sortOrder: r.sort_order,
});

const LINK_COLS = "id,label,description,url,style,icon,image_path,is_active,is_featured,sort_order";

export async function listLinks(): Promise<AdminLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("linktree_links").select(LINK_COLS).order("sort_order").order("created_at");
  if (error) throw new Error("No se pudieron cargar los enlaces.");
  return (data as LinkRow[]).map(toLink);
}

export async function getLink(id: string): Promise<AdminLink | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("linktree_links").select(LINK_COLS).eq("id", id).maybeSingle();
  return data ? toLink(data as LinkRow) : null;
}

export async function listCategories(): Promise<AdminCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("id,slug,name,kind").order("kind").order("sort_order").order("name");
  if (error) throw new Error("No se pudieron cargar las categorías.");
  return data as AdminCategory[];
}

type ProductRow = {
  id: string; slug: string; name: string; description: string | null; type: "individual" | "evento"; price_cop: number | null;
  status: "published" | "hidden"; is_featured: boolean; sort_order: number;
  product_images: { id: string; storage_path: string; alt_text: string | null; sort_order: number }[];
  product_categories: { category_id: string }[];
};

const toProduct = (r: ProductRow): AdminProduct => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description,
  type: r.type,
  priceCOP: r.price_cop,
  status: r.status,
  isFeatured: r.is_featured,
  sortOrder: r.sort_order,
  categoryIds: r.product_categories.map((c) => c.category_id),
  images: [...r.product_images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => ({ id: i.id, path: i.storage_path, url: siteMediaUrl(i.storage_path), alt: i.alt_text, sortOrder: i.sort_order })),
});

const PRODUCT_COLS = "id,slug,name,description,type,price_cop,status,is_featured,sort_order,product_images(id,storage_path,alt_text,sort_order),product_categories(category_id)";

export async function listProducts(): Promise<AdminProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_COLS).order("sort_order").order("created_at");
  if (error) throw new Error("No se pudieron cargar los productos.");
  return (data as unknown as ProductRow[]).map(toProduct);
}

export async function getProduct(id: string): Promise<AdminProduct | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(PRODUCT_COLS).eq("id", id).maybeSingle();
  return data ? toProduct(data as unknown as ProductRow) : null;
}

export type DashboardStats = {
  products: { published: number; hidden: number; featured: number };
  links: { active: number; inactive: number };
  categories: number;
  pdf: { version: number; generatedAt: string; isPublished: boolean } | null;
  hasWhatsapp: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const [products, links, categories, pdf, settings] = await Promise.all([
    supabase.from("products").select("status,is_featured"),
    supabase.from("linktree_links").select("is_active"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("catalog_versions").select("version,generated_at,is_published").order("version", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("site_settings").select("value").eq("key", "whatsapp_number").maybeSingle(),
  ]);
  const p = (products.data ?? []) as { status: string; is_featured: boolean }[];
  const l = (links.data ?? []) as { is_active: boolean }[];
  const wa = settings.data?.value;
  return {
    products: { published: p.filter((x) => x.status === "published").length, hidden: p.filter((x) => x.status !== "published").length, featured: p.filter((x) => x.is_featured).length },
    links: { active: l.filter((x) => x.is_active).length, inactive: l.filter((x) => !x.is_active).length },
    categories: categories.count ?? 0,
    pdf: pdf.data ? { version: pdf.data.version, generatedAt: pdf.data.generated_at, isPublished: pdf.data.is_published } : null,
    hasWhatsapp: typeof wa === "string" ? wa.replace(/\D/g, "").length > 0 : Boolean(process.env.WHATSAPP_NUMBER),
  };
}
