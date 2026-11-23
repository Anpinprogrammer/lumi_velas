"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";

export type GalleryImage = { src: string; alt: string };

/** Imagen principal + miniaturas. Flechas del teclado cambian de imagen. */
export function ImageGallery({ images, className }: { images: GalleryImage[]; className?: string }) {
  const [i, setI] = useState(0);
  if (images.length === 0) return null;
  const go = (n: number) => setI((n + images.length) % images.length);
  const cur = images[i];

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      role="group"
      aria-roledescription="galería"
      aria-label={`Fotografías, ${i + 1} de ${images.length}`}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(i - 1);
        if (e.key === "ArrowRight") go(i + 1);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-cream-100">
        <Image key={cur.src} src={cur.src} alt={cur.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="animate-[lumi-fade_var(--dur-base)_var(--ease)] object-cover" priority={i === 0} />
        {images.length > 1 && (
          <>
            <IconButton label="Foto anterior" icon={<ChevronLeft />} variant="primary" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2" onClick={() => go(i - 1)} />
            <IconButton label="Foto siguiente" icon={<ChevronRight />} variant="primary" size="sm" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => go(i + 1)} />
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto" role="list">
          {images.map((img, n) => (
            <li key={img.src}>
              <button
                type="button"
                aria-label={`Ver foto ${n + 1}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className={cn("relative size-16 overflow-hidden rounded-md border-2 transition-colors", n === i ? "border-sage-600" : "border-transparent opacity-70 hover:opacity-100")}
              >
                <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
