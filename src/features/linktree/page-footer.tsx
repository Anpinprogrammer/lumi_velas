import { Mail } from "lucide-react";
import type { LinktreeSettings } from "./types";

export function PageFooter({ settings }: { settings: LinktreeSettings }) {
  return (
    <footer className="mt-4 flex flex-col items-center gap-2 border-t border-[var(--page-line)] pt-5 text-center lg:col-span-12 lg:mt-2 lg:items-center">
      <p className="font-display text-xl text-[var(--page-text)]">Hecho a mano, con cariño.</p>
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
