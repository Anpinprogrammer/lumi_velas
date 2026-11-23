import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isStageBEnabled } from "@/lib/stage";

/**
 * AISLAMIENTO DE LA ETAPA B. Todo lo que cuelgue de este grupo de rutas
 * (servicios, cursos, historia, nuevo inicio…) responde 404 salvo que
 * ENABLE_STAGE_B=true. Esa variable no debe definirse en Production.
 * El valor se resuelve al compilar: cambiarlo exige un nuevo despliegue.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function EtapaBLayout({ children }: { children: ReactNode }) {
  if (!isStageBEnabled()) notFound();
  return children;
}
