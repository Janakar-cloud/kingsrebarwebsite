import type { MetadataRoute } from "next";

import { navigation } from "@/content/site";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  if (!base) return [];
  return navigation.map((item) => ({
    url: new URL(item.href, base).href,
    changeFrequency: "monthly",
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
