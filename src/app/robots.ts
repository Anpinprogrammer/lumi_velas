import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { isIndexable } from "@/lib/stage";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/dev"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
