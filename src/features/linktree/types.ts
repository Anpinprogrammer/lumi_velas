export type LinkStyle = "featured" | "standard" | "compact" | "image";
export const LINK_STYLES: readonly LinkStyle[] = ["featured", "standard", "compact", "image"];

export type LinkItem = {
  id: string;
  label: string;
  description: string | null;
  url: string;
  style: LinkStyle;
  icon: string | null;
  imageUrl: string | null;
};

export type LinktreeSettings = {
  whatsapp: string | null; // formato internacional sin "+"
  instagram: string | null;
  email: string | null;
};

export type LinktreeData = { links: LinkItem[]; settings: LinktreeSettings; source: "supabase" | "default" };
