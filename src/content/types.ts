/**
 * Content that has not yet been supplied and approved by the client.
 * `note` describes what is needed; it is shown only in preview builds
 * and is never rendered in a production build.
 */
export type Pending = { readonly pending: string };

/** A value that is either approved for publication or still pending. */
export type Approved<T> = T | Pending;

export const pending = (note: string): Pending => ({ pending: note });

export function isPending(value: unknown): value is Pending {
  return typeof value === "object" && value !== null && "pending" in value;
}

export function isApproved<T>(value: Approved<T> | undefined | null): value is T {
  if (value === undefined || value === null || isPending(value)) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export type ImageAsset = {
  /** Path under /public, e.g. "/images/home-hero.webp". */
  src: string;
  /** Describe the image content. Use "" only for purely decorative images. */
  alt: string;
  width: number;
  height: number;
};

export type PostalAddress = {
  /** Lines exactly as they should be displayed. */
  lines: string[];
  /** Optional structured fields, used for schema.org markup when present. */
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  /** ISO 3166-1 alpha-2 code, e.g. "GB". */
  addressCountry?: string;
};

export type TextSection = {
  heading: string;
  paragraphs: Approved<string[]>;
};

export type ListSection = {
  heading: string;
  intro?: Approved<string>;
  items: Approved<{ title: string; description?: string }[]>;
};
