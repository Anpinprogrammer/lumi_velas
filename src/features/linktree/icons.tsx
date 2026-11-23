import { BookOpen, Calendar, FileDown, Flame, Gift, GraduationCap, Heart, Link2, Mail, MapPin, MessageCircle, Phone, Sparkles, type LucideIcon } from "lucide-react";
import type { SVGProps } from "react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

/** Lucide ya no incluye iconos de marcas: glifo simple propio para Instagram. */
function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </svg>
  );
}

type IconComponent = LucideIcon | typeof InstagramGlyph | typeof WhatsAppIcon;

/** Lista permitida de iconos: la base de datos solo guarda estas claves. */
export const LINK_ICONS = {
  "book-open": BookOpen,
  calendar: Calendar,
  "file-down": FileDown,
  flame: Flame,
  gift: Gift,
  "graduation-cap": GraduationCap,
  heart: Heart,
  instagram: InstagramGlyph,
  link: Link2,
  mail: Mail,
  "map-pin": MapPin,
  "message-circle": MessageCircle,
  whatsapp: WhatsAppIcon,
  phone: Phone,
  sparkles: Sparkles,
} as const satisfies Record<string, IconComponent>;

export type LinkIconKey = keyof typeof LINK_ICONS;
export const isLinkIconKey = (k: string): k is LinkIconKey => Object.hasOwn(LINK_ICONS, k);

export function LinkIcon({ name, className }: { name: string | null; className?: string }) {
  const Icon = name && isLinkIconKey(name) ? LINK_ICONS[name] : Link2;
  return <Icon aria-hidden className={className} />;
}
