/**
 * Content that has not yet been supplied and approved by the client.
 * `note` describes what is needed; it is shown only in preview builds
 * and is never rendered in a production build.
 */
export type Pending = { readonly pending: string };

/** Draft copy shown in preview builds, with a marker, and hidden in production. */
export type Proposed<T> = Pending & { readonly proposed: T };

/** A value that is either approved for publication or still pending. */
export type Approved<T> = T | Pending | Proposed<T>;

export const pending = (note: string): Pending => ({ pending: note });

export const proposed = <T,>(value: T, note: string): Proposed<T> => ({ pending: note, proposed: value });

export function isPending(value: unknown): value is Pending {
  return typeof value === "object" && value !== null && "pending" in value;
}

export function isProposed<T>(value: unknown): value is Proposed<T> {
  return isPending(value) && "proposed" in value;
}

/** Approved value, or the draft value when preview markers are being shown. */
export function publishedOrPreview<T>(value: Approved<T> | undefined | null, allowPreview: boolean): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (isApproved(value)) return value;
  if (allowPreview && isProposed<T>(value)) return value.proposed;
  return undefined;
}

export function isApproved<T>(value: Approved<T> | undefined | null): value is T {
  if (value === undefined || value === null || isPending(value)) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export type PageMeta = { title: string; description: string };

export type ImageAsset = {
  /** Path under /public, e.g. "/images/home-hero.webp". */
  src: string;
  /** Describe the image content. Use "" only for purely decorative images. */
  alt: string;
  width: number;
  height: number;
  /** CSS object-position, used when the frame crops the image. */
  objectPosition?: string;
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
  paragraphs: Approved<readonly string[]>;
};

export type FlagCode = "US" | "GB";

export type ListItem = { title: string; description?: string; flag?: FlagCode };

export type ListSection = {
  heading: string;
  intro?: Approved<string>;
  items: Approved<readonly ListItem[]>;
};

export type Offer = {
  name: string;
  summary: string;
  items: string[];
};

export type Application = ListItem & { description?: string };

export type Role = {
  title: string;
  requirements: string[];
};

export type ProofPoint = {
  value: string;
  label: string;
};
