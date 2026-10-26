import type { MetadataRoute } from "next";

import { allowIndexing, siteUrl } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing || !siteUrl) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
    host: siteUrl.origin,
  };
}
