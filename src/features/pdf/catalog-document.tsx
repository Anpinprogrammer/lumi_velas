/* eslint-disable jsx-a11y/alt-text -- <Image> de React PDF no es un <img> del DOM: no admite alt. */
import { Document, Image, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";
import { formatCOP } from "@/lib/format";
import type { CatalogCategory, CatalogProduct } from "@/features/catalog/types";
import { SANS, SERIF } from "./fonts";
import type { PdfImage } from "./images";
import { pairs, type PdfSection } from "./selection";

/**
 * Plantilla editorial del catálogo PDF (A4). Solo colores del logo (mismos tokens que el sitio):
 * salvia, rosa, coral, ámbar, crema, kraft y café. Estructura: portada → marca → eventos →
 * productos (2 por página, por sección) → contraportada con contacto y enlace al catálogo en línea.
 */
export const PDF_COLORS = {
  ivory: "#FEF5F1",
  cream: "#FBF3EA",
  blush100: "#FBDDD5",
  blush200: "#FBD2CB",
  kraft: "#E9C6A9",
  coral: "#A84F3F",
  amber: "#9A5F1F",
  sage700: "#4F5537",
  sage600: "#666C48",
  brown700: "#452E23",
  brown400: "#846852",
} as const;
const C = PDF_COLORS;

export type PdfProduct = CatalogProduct & { categoryName: string; image: PdfImage | null };
export type PdfEvent = Pick<CatalogCategory, "slug" | "name" | "description"> & { image: PdfImage | null };

export type CatalogPdfProps = {
  sections: (Omit<PdfSection, "products"> & { products: PdfProduct[] })[];
  events: PdfEvent[];
  logo: PdfImage | null;
  wordmark: PdfImage | null;
  wordmarkLight: PdfImage | null;
  brandImage: PdfImage | null;
  contact: { whatsapp: string | null; whatsappLabel: string | null; instagram: string | null; instagramLabel: string | null };
  catalogUrl: string;
  catalogUrlLabel: string;
  year: number;
  isMock: boolean;
};

const MOCK_NOTE = "Material de referencia: imágenes ilustrativas; productos, textos y precios por confirmar.";

const s = StyleSheet.create({
  page: { backgroundColor: C.ivory, color: C.brown700, fontFamily: SANS, fontSize: 9.5, paddingTop: 40, paddingBottom: 56, paddingHorizontal: 48 },
  eyebrow: { fontFamily: SANS, fontWeight: 600, fontSize: 7.5, letterSpacing: 2.4, textTransform: "uppercase", color: C.coral },
  h1: { fontFamily: SERIF, fontWeight: 400, fontSize: 34, lineHeight: 1.08, color: C.brown700 },
  body: { fontSize: 10, lineHeight: 1.6, color: C.brown700 },
  muted: { color: C.brown400 },
  rule: { height: 0.75, backgroundColor: C.kraft },
  // Cabecera y pie de las páginas interiores
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, marginBottom: 22, borderBottomWidth: 0.75, borderBottomColor: C.kraft },
  footer: { position: "absolute", left: 48, right: 48, bottom: 26, flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 7, color: C.brown400 },
  arch: { overflow: "hidden", backgroundColor: C.blush100 },
});

/** Título con la última palabra en cursiva (mismo gesto editorial del sitio). */
function Title({ text, size = 34, color = C.brown700, align = "left" }: { text: string; size?: number; color?: string; align?: "left" | "center" }) {
  const i = text.trimEnd().lastIndexOf(" ");
  const head = i > 0 ? text.slice(0, i + 1) : "";
  const tail = i > 0 ? text.slice(i + 1) : text;
  return (
    <Text style={[s.h1, { fontSize: size, color, textAlign: align }]}>
      {head}
      <Text style={{ fontStyle: "italic", color: color === C.brown700 ? C.sage600 : color }}>{tail}</Text>
    </Text>
  );
}

/** Marco en arco (esquinas superiores redondeadas al ancho completo). */
function Arch({ image, width, height, children }: { image: PdfImage | null; width: number; height: number; children?: ReactNode }) {
  return (
    <View style={[s.arch, { width, height, borderTopLeftRadius: width / 2, borderTopRightRadius: width / 2 }]}>
      {image ? <Image src={image} style={{ width, height, objectFit: "cover" }} /> : children}
    </View>
  );
}

function InnerHeader({ wordmark, label }: { wordmark: PdfImage | null; label: string }) {
  return (
    <View style={s.header} fixed>
      {wordmark ? <Image src={wordmark} style={{ width: 54, height: 17.8 }} /> : <Text style={{ fontFamily: SERIF, fontSize: 14, letterSpacing: 3 }}>LUMI</Text>}
      <Text style={[s.eyebrow, { color: C.sage600 }]}>{label}</Text>
    </View>
  );
}

function InnerFooter({ isMock }: { isMock: boolean }) {
  return (
    <View style={s.footer} fixed>
      <Text>Lumi · Catálogo de colección</Text>
      {isMock ? <Text style={{ fontSize: 6.5, color: C.coral }}>{MOCK_NOTE}</Text> : null}
      <Text render={({ pageNumber }) => String(pageNumber).padStart(2, "0")} />
    </View>
  );
}

function Cover({ logo, year, isMock }: Pick<CatalogPdfProps, "logo" | "year" | "isMock">) {
  return (
    <Page size="A4" style={[s.page, { paddingTop: 0, paddingBottom: 0, alignItems: "center" }]}>
      <View style={{ marginTop: 52, width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={[s.eyebrow, { color: C.sage600 }]}>Velas · Recordatorios</Text>
        <Text style={[s.eyebrow, { color: C.sage600 }]}>Edición {year}</Text>
      </View>
      <View style={{ marginTop: 40, width: 340, height: 430, borderTopLeftRadius: 170, borderTopRightRadius: 170, backgroundColor: C.blush100, alignItems: "center", justifyContent: "center" }}>
        {logo ? <Image src={logo} style={{ width: 250, height: 276 }} /> : <Text style={{ fontFamily: SERIF, fontSize: 64, letterSpacing: 10 }}>LUMI</Text>}
      </View>
      <View style={{ marginTop: 34, width: 60, ...s.rule }} />
      <Text style={{ marginTop: 22, fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: C.brown700 }}>Catálogo de colección</Text>
      <Text style={[s.eyebrow, { marginTop: 12 }]}>Momentos que brillan · {year}</Text>
      {isMock ? <Text style={{ position: "absolute", bottom: 30, fontSize: 7, color: C.coral }}>{MOCK_NOTE}</Text> : null}
    </Page>
  );
}

function Brand({ brandImage, wordmark, isMock }: Pick<CatalogPdfProps, "brandImage" | "wordmark" | "isMock">) {
  return (
    <Page size="A4" style={s.page}>
      <InnerHeader wordmark={wordmark} label="Nuestra marca" />
      <View style={{ flexDirection: "row", marginTop: 30 }}>
        <Arch image={brandImage} width={240} height={420} />
        <View style={{ flex: 1, paddingLeft: 32, paddingTop: 60 }}>
          <Text style={s.eyebrow}>Hecho a mano</Text>
          <View style={{ marginTop: 12 }}>
            <Title text="Cada vela cuenta una historia." size={32} />
          </View>
          <Text style={[s.body, { marginTop: 18 }]}>
            En Lumi transformamos la cera en pequeños recuerdos llenos de significado. Creamos velas artesanales y detalles personalizados para
            iluminar tus celebraciones más especiales.
          </Text>
          <Text style={[s.body, { marginTop: 10 }]}>
            Lumi nace del gusto por los detalles hechos a mano. Vertimos, decoramos y empacamos cada pieza con calma, para que acompañe una
            celebración, llene de calidez un espacio o se convierta en el recuerdo que alguien guarda por años.
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 70, alignItems: "center" }}>
        <View style={{ width: 40, ...s.rule }} />
        <Text style={{ marginTop: 20, fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: C.coral, textAlign: "center" }}>
          Pequeños detalles, grandes emociones.
        </Text>
      </View>
      <InnerFooter isMock={isMock} />
    </Page>
  );
}

function Events({ events, wordmark, isMock }: Pick<CatalogPdfProps, "events" | "wordmark" | "isMock">) {
  return (
    <Page size="A4" style={s.page}>
      <InnerHeader wordmark={wordmark} label="Eventos" />
      <Text style={s.eyebrow}>Para tus celebraciones</Text>
      <View style={{ marginTop: 10, width: 380 }}>
        <Title text="Celebraciones que merecen brillar." size={30} />
      </View>
      <Text style={[s.body, { marginTop: 12, width: 420 }]}>
        Nuestro corazón está en los eventos. Diseñamos cada detalle con tu historia, tu paleta y tu fecha para que la luz también sea parte del
        recuerdo.
      </Text>
      <View style={{ marginTop: 22, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 18 }}>
        {events.map((e) => (
          <View key={e.slug} style={{ width: 154 }} wrap={false}>
            <Arch image={e.image} width={154} height={150} />
            <Text style={{ marginTop: 9, fontFamily: SERIF, fontWeight: 500, fontSize: 14, lineHeight: 1.15 }}>{e.name}</Text>
            <Text style={{ marginTop: 4, fontSize: 8.5, lineHeight: 1.45, color: C.brown400 }}>{e.description}</Text>
          </View>
        ))}
      </View>
      <Text style={{ marginTop: 22, fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: C.sage700 }}>
        Cada evento se cotiza a la medida: cuéntanos la fecha, la cantidad de invitados y tu idea.
      </Text>
      <InnerFooter isMock={isMock} />
    </Page>
  );
}

function ProductBlock({ p, n, flip }: { p: PdfProduct; n: number; flip: boolean }) {
  const specs = Object.entries(p.specs ?? {}).slice(0, 3);
  const showPrice = p.type === "individual" && typeof p.priceCOP === "number";
  return (
    <View style={{ flexDirection: flip ? "row-reverse" : "row", alignItems: "center", height: 305 }} wrap={false}>
      <Arch image={p.image} width={222} height={288} />
      <View style={{ flex: 1, paddingLeft: flip ? 0 : 30, paddingRight: flip ? 30 : 0 }}>
        <Text style={{ fontFamily: SANS, fontWeight: 400, fontSize: 22, letterSpacing: 1, color: C.kraft }}>{String(n).padStart(2, "0")}</Text>
        <Text style={[s.eyebrow, { marginTop: 4 }]}>{p.categoryName}</Text>
        <View style={{ marginTop: 6 }}>
          <Title text={p.name} size={24} />
        </View>
        <Text style={[s.body, { marginTop: 9, fontSize: 9.5, lineHeight: 1.55 }]}>{p.description}</Text>
        {specs.length > 0 ? (
          <View style={{ marginTop: 12, flexDirection: "row", columnGap: 16 }}>
            {specs.map(([k, v]) => (
              <View key={k} style={{ flex: 1 }}>
                <Text style={{ fontSize: 6.5, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: C.sage600 }}>{k}</Text>
                <Text style={{ marginTop: 2, fontSize: 8.5 }}>{v}</Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={{ marginTop: 14, ...s.rule }} />
        {showPrice ? (
          <Text style={{ marginTop: 10, fontFamily: SERIF, fontWeight: 500, fontSize: 20, color: C.sage700 }}>{formatCOP(p.priceCOP!)}</Text>
        ) : (
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 17, color: C.coral }}>Precio a cotizar</Text>
            <Text style={{ marginTop: 2, fontSize: 8, color: C.brown400 }}>Personalizable con tus colores, nombres y fecha.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function SectionPages({ section, startAt, wordmark, isMock }: { section: CatalogPdfProps["sections"][number]; startAt: number; wordmark: PdfImage | null; isMock: boolean }) {
  return (
    <>
      {pairs(section.products).map((pair, i) => (
        <Page key={pair[0].id} size="A4" style={s.page}>
          <InnerHeader wordmark={wordmark} label={section.eyebrow} />
          {i === 0 ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={s.eyebrow}>{section.eyebrow}</Text>
              <View style={{ marginTop: 6 }}>
                <Title text={section.title} size={26} />
              </View>
            </View>
          ) : null}
          <View style={{ flex: 1, justifyContent: i === 0 ? "flex-start" : "center", rowGap: 18 }}>
            {pair.map((p, j) => (
              <ProductBlock key={p.id} p={p} n={startAt + i * 2 + j} flip={j === 1} />
            ))}
          </View>
          <InnerFooter isMock={isMock} />
        </Page>
      ))}
    </>
  );
}

function BackCover({ wordmarkLight, contact, catalogUrl, catalogUrlLabel, isMock }: Pick<CatalogPdfProps, "wordmarkLight" | "contact" | "catalogUrl" | "catalogUrlLabel" | "isMock">) {
  const light = C.ivory;
  const row = (label: string, value: string, href: string) => (
    <View style={{ alignItems: "center", marginTop: 16 }}>
      <Text style={[s.eyebrow, { color: C.blush200 }]}>{label}</Text>
      <Link src={href} style={{ marginTop: 5, fontSize: 12, color: light, textDecoration: "none" }}>
        {value}
      </Link>
    </View>
  );
  return (
    <Page size="A4" style={[s.page, { backgroundColor: C.sage700, color: light, alignItems: "center", justifyContent: "center" }]}>
      {wordmarkLight ? <Image src={wordmarkLight} style={{ width: 170, height: 56 }} /> : <Text style={{ fontFamily: SERIF, fontSize: 40, letterSpacing: 8 }}>LUMI</Text>}
      <View style={{ marginTop: 40, width: 380 }}>
        <Text style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 32, lineHeight: 1.15, textAlign: "center", color: light }}>
          Momentos que brillan, <Text style={{ fontStyle: "italic", color: C.blush200 }}>recuerdos que perduran.</Text>
        </Text>
      </View>
      <Text style={{ marginTop: 18, width: 340, textAlign: "center", fontSize: 10, lineHeight: 1.6, color: C.blush100 }}>
        Escríbenos y te ayudamos a elegir, personalizar y preparar cada detalle para tu celebración o tu espacio.
      </Text>
      <View style={{ marginTop: 26, width: 60, height: 0.75, backgroundColor: C.kraft }} />
      {contact.whatsapp && contact.whatsappLabel ? row("WhatsApp", contact.whatsappLabel, `https://wa.me/${contact.whatsapp}`) : null}
      {contact.instagram && contact.instagramLabel ? row("Instagram", contact.instagramLabel, contact.instagram) : null}
      {row("Catálogo en línea", catalogUrlLabel, catalogUrl)}
      {isMock ? <Text style={{ position: "absolute", bottom: 30, fontSize: 7, color: C.blush200 }}>{MOCK_NOTE}</Text> : null}
    </Page>
  );
}

export function CatalogPdf(props: CatalogPdfProps) {
  const { sections, wordmark, isMock } = props;
  const starts = sections.map((_, i) => 1 + sections.slice(0, i).reduce((sum, sec) => sum + sec.products.length, 0));
  return (
    <Document title={`Lumi · Catálogo de colección ${props.year}`} author="Lumi Velas Artesanales" subject="Catálogo de velas y recordatorios" language="es-CO">
      <Cover logo={props.logo} year={props.year} isMock={isMock} />
      <Brand brandImage={props.brandImage} wordmark={wordmark} isMock={isMock} />
      {props.events.length > 0 ? <Events events={props.events} wordmark={wordmark} isMock={isMock} /> : null}
      {sections.map((sec, i) => (
        <SectionPages key={sec.key} section={sec} startAt={starts[i]} wordmark={wordmark} isMock={isMock} />
      ))}
      <BackCover {...props} />
    </Document>
  );
}
