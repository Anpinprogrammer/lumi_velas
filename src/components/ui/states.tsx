import type { ReactNode } from "react";
import { AlertCircle, Flame } from "lucide-react";
import { cn } from "@/lib/cn";

const wrap = "flex flex-col items-center gap-3 rounded-lg px-6 py-12 text-center";

export function EmptyState({ title, description, action, icon, className }: { title: string; description?: string; action?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cn(wrap, "bg-cream-100", className)}>
      <span aria-hidden className="text-amber-400">{icon ?? <Flame className="size-10" strokeWidth={1.25} />}</span>
      <h3 className="font-display text-2xl">{title}</h3>
      {description && <p className="max-w-sm text-text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Cargando…", lines = 3, className }: { label?: string; lines?: number; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex flex-col gap-3", className)}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, n) => (
        <div
          key={n}
          aria-hidden
          style={{ width: `${100 - n * 15}%` }}
          className="h-4 rounded-pill bg-[linear-gradient(90deg,var(--lumi-cream-100),var(--lumi-blush-100),var(--lumi-cream-100))] bg-[length:200%_100%] animate-[lumi-shimmer_1.6s_linear_infinite]"
        />
      ))}
    </div>
  );
}

export function ErrorState({ title = "No pudimos cargar esto", description, action, className }: { title?: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div role="alert" className={cn(wrap, "border border-error/30 bg-[#fbeeec]", className)}>
      <AlertCircle aria-hidden className="size-9 text-error" strokeWidth={1.5} />
      <h3 className="font-display text-2xl">{title}</h3>
      {description && <p className="max-w-sm text-text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
