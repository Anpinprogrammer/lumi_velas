"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui";

/** Compartir: usa el menú nativo del teléfono si existe; si no, copia el enlace. */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const [status, setStatus] = useState("");

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus("Enlace copiado");
    } catch (e) {
      if ((e as Error).name !== "AbortError") setStatus("No se pudo compartir. Copia el enlace de la barra del navegador.");
    }
    setTimeout(() => setStatus(""), 3000);
  }

  return (
    <>
      <Button variant="ghost" leftIcon={status === "Enlace copiado" ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />} onClick={share}>
        {status === "Enlace copiado" ? "Enlace copiado" : "Compartir"}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">{status}</span>
    </>
  );
}
