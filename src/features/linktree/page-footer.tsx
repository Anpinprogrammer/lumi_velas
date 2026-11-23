import { Mail } from "lucide-react";
import type { LinktreeSettings } from "./types";

export function PageFooter({ settings }: { settings: LinktreeSettings }) {
  return (
    <footer className="mt-14 flex flex-col items-center gap-3 border-t border-[var(--page-line)] pt-8 text-center lg:items-start lg:text-left">
      <p className="font-display text-2xl text-[var(--page-text)]">Hecho a mano, con cariño.</p>
      {settings.email && (
        <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 text-sm text-[var(--page-muted)] underline-offset-4 hover:underline">
          <Mail aria-hidden className="size-4" />
          {settings.email}
        </a>
      )}
      <p className="eyebrow">Lumi · Velas · Recordatorios</p>
    </footer>
  );
}
