import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { getContact } from "@/features/catalog/components/contact";
import { eventCategories, getCatalog, primaryCategoryName } from "@/features/catalog/data";
import { getSiteUrl } from "@/lib/env";
import { CatalogPdf, type CatalogPdfProps } from "./catalog-document";
import { displayUrl, formatPhone, instagramHandle } from "./contact-format";
import { registerPdfFonts } from "./fonts";
import { photo, transparent } from "./images";
import { selectProducts, type SectionOrder } from "./selection";

/** Portada de la página de marca (maqueta; se reemplaza por una foto real del taller). */
const BRAND_IMAGE = "/mock/mock-catalogo.webp";

export type RenderOptions = { slugs?: readonly string[]; sectionOrder?: SectionOrder; now?: Date };

/** Arma el PDF del catálogo (Node.js). Sin selección → catálogo completo (el PDF público). */
export async function renderCatalogPdf(opts: RenderOptions = {}): Promise<Buffer> {
  registerPdfFonts();
  const catalog = getCatalog();
  const selection = selectProducts(catalog, opts.slugs ?? [], opts.sectionOrder);
  const contact = await getContact();
  const siteUrl = getSiteUrl();

  const [logo, wordmark, wordmarkLight, brandImage, events, sections] = await Promise.all([
    transparent("/brand/lumi-logo.webp", 560),
    transparent("/brand/lumi-wordmark.webp", 320),
    transparent("/brand/lumi-wordmark-claro.webp", 500),
    photo(BRAND_IMAGE, 640),
    Promise.all(eventCategories(catalog).map(async (c) => ({ slug: c.slug, name: c.name, description: c.description, image: await photo(c.image?.src, 420) }))),
    Promise.all(
      selection.sections.map(async (sec) => ({
        ...sec,
        products: await Promise.all(sec.products.map(async (p) => ({ ...p, categoryName: primaryCategoryName(p, catalog), image: await photo(p.images[0]?.src, 600) }))),
      })),
    ),
  ]);

  const props: CatalogPdfProps = {
    sections,
    events,
    logo,
    wordmark,
    wordmarkLight,
    brandImage,
    contact: {
      whatsapp: contact.whatsapp,
      whatsappLabel: contact.whatsapp ? formatPhone(contact.whatsapp) : null,
      instagram: contact.instagram,
      instagramLabel: instagramHandle(contact.instagram),
    },
    catalogUrl: `${siteUrl}/catalogo`,
    catalogUrlLabel: displayUrl(siteUrl),
    year: (opts.now ?? new Date()).getFullYear(),
    isMock: catalog.source === "mock",
  };
  return renderToBuffer(<CatalogPdf {...props} />);
}
