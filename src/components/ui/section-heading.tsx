import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Nivel semántico del título; el aspecto no cambia. */
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="font-display text-[length:var(--text-h2)] font-normal leading-[1.05] tracking-tight text-text">
        {title}
      </Tag>
      {description && <p className="max-w-prose text-text-muted">{description}</p>}
    </div>
  );
}
