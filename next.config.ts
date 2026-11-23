import type { NextConfig } from "next";

// Imágenes de Supabase Storage (bucket público site-media) permitidas en next/image.
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/site-media/**" }]
      : [],
  },
  // El catálogo PDF (React PDF) lee fuentes e imágenes del disco en tiempo de ejecución:
  // se incluyen en la función de Vercel y el paquete se carga desde node_modules (no se empaqueta).
  serverExternalPackages: ["@react-pdf/renderer"],
  outputFileTracingIncludes: {
    "/catalogo/pdf": ["./src/features/pdf/fonts/*.woff", "./public/brand/*.webp", "./public/mock/**/*.webp"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
