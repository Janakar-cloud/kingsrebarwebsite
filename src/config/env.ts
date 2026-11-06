/**
 * Deployment settings read from environment variables. See .env.example.
 * Values used by pages are read at build time, so changing them requires a rebuild.
 */

const isProduction = process.env.NODE_ENV === "production";

function readSiteUrl(): URL | null {
  const raw = process.env.SITE_URL?.trim();
  const fallback = process.env.VERCEL_URL?.trim() ? `https://${process.env.VERCEL_URL.trim()}` : "";
  const value = raw || fallback;
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    throw new Error(`SITE_URL must be an absolute URL such as https://www.example.com (received "${value}")`);
  }
}

/** Production origin used for canonical URLs, Open Graph, sitemap and robots. */
export const siteUrl = readSiteUrl();

/**
 * Search engines may index the site only when a production URL is set and
 * indexing has been explicitly enabled, so preview deployments stay out of search.
 */
export const allowIndexing = siteUrl !== null && process.env.ALLOW_INDEXING === "true";

/**
 * Whether pending-content notes are rendered. Defaults to on in development
 * and off in production builds; set SHOW_CONTENT_PLACEHOLDERS=true to build a
 * client review copy that shows what is still missing.
 */
const placeholderSetting = process.env.SHOW_CONTENT_PLACEHOLDERS?.trim();
export const showPlaceholders = placeholderSetting ? placeholderSetting === "true" : !isProduction;

export { isProduction };
