import type { MetadataRoute } from "next";

import { siteUrl } from "@/config/env";
import { navigation, routes } from "@/content/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl;
  if (!base) return [];
  return navigation.map((item) => ({
    url: new URL(item.href, base).href,
    changeFrequency: "monthly",
    priority: item.href === routes.home ? 1 : 0.7,
  }));
}
