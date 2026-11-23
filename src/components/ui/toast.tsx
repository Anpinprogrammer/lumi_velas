"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warning" | "error";
type ToastItem = { id: number; message: string; tone: Tone };
type Ctx = { toast: (message: string, tone?: Tone) => void };

const ToastContext = createContext<Ctx | null>(null);

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle } as const;
const tones: Record<Tone, string> = {
  info: "text-sage-600",
  success: "text-success",
  warning: "text-amber-600",
  error: "text-error",
};

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const dismiss = useCallback((id: number) => setItems((l) => l.filter((t) => t.id !== id)), []);
  const toast = useCallback(
    (message: string, tone: Tone = "info") => {
      const id = Date.now() + Math.random();
      setItems((l) => [...l.slice(-2), { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* aria-live: los lectores de pantalla anuncian sin robar el foco */}
      <div
        role="region"
        aria-label="Notificaciones"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {items.map((t) => {
          const Icon = icons[t.tone];
          return (
            <div
              key={t.id}
              role={t.tone === "error" ? "alert" : "status"}
              className="pointer-events-auto animate-rise flex w-full max-w-sm items-start gap-3 rounded-md bg-surface p-4 text-sm shadow-lift"
            >
              <Icon aria-hidden className={cn("mt-0.5 size-5 shrink-0", tones[t.tone])} />
              <p className="flex-1">{t.message}</p>
              <button type="button" aria-label="Cerrar notificación" onClick={() => dismiss(t.id)} className="text-text-muted hover:text-text">
                <X className="size-4" aria-hidden />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
