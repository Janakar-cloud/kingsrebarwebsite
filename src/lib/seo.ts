import type { Metadata } from "next";

import { siteUrl } from "@/config/env";
import type { Route } from "@/content/routes";
import { site } from "@/content/site";
import type { PageMeta } from "@/content/types";

/**
 * Builds metadata for a page from its centrally managed title and description.
 * Metadata merges shallowly, so every page must restate the shared Open Graph fields.
 */
export function pageMetadata(meta: PageMeta, path: Route, options?: { absoluteTitle?: boolean }): Metadata {
  const fullTitle = options?.absoluteTitle ? meta.title : `${meta.title} | ${site.siteTitle}`;
  const image = site.assets.socialImage;

  return {
    title: options?.absoluteTitle ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: siteUrl ? { canonical: path } : undefined,
    openGraph: {
      type: "website",
      siteName: site.siteTitle,
      title: fullTitle,
      description: meta.description,
      url: siteUrl ? path : undefined,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: meta.description,
      images: [image.src],
    },
  };
}
