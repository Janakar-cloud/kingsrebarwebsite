import { showPlaceholders } from "@/config/env";
import { isApproved, isProposed, type Approved } from "@/content/types";

/** Marks content the client still has to supply. Renders nothing in production builds. */
export function PendingNote({
  note,
  as: Tag = "p",
  label = "Content needed",
}: {
  note: string;
  as?: "p" | "div" | "li";
  label?: string;
}) {
  if (!showPlaceholders) return null;
  return (
    <Tag className="pending">
      <span className="pending__label">{label}</span>
      {note}
    </Tag>
  );
}

/** Renders approved paragraphs, or a pending note while the copy is outstanding. */
export function Paragraphs({ value, className }: { value: Approved<readonly string[]>; className?: string }) {
  if (isApproved(value)) {
    return value.map((paragraph) => (
      <p key={paragraph} className={className}>
        {paragraph}
      </p>
    ));
  }
  if (isProposed<readonly string[]>(value) && showPlaceholders) {
    return (
      <div className="pending">
        <span className="pending__label">Needs approval</span>
        <p>{value.pending}</p>
        {value.proposed.map((paragraph) => (
          <p key={paragraph} className={className}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  }
  return isProposed(value) || value.pending ? <PendingNote note={value.pending} /> : null;
}

/**
 * Renders a single approved paragraph. While it is pending, preview builds show
 * the note and production builds show `fallback` (neutral copy) or nothing.
 */
export function Text({
  value,
  fallback,
  className,
}: {
  value: Approved<string>;
  fallback?: string;
  className?: string;
}) {
  if (isApproved(value)) return <p className={className}>{value}</p>;
  if (isProposed<string>(value) && showPlaceholders) {
    return (
      <div className="pending">
        <span className="pending__label">Needs approval</span>
        <p>{value.pending}</p>
        <p className={className}>{value.proposed}</p>
      </div>
    );
  }
  if (typeof value !== "string" && showPlaceholders) return <PendingNote note={value.pending} />;
  return fallback ? <p className={className}>{fallback}</p> : null;
}

/** True when a section should be rendered: it has approved content, or placeholders are visible. */
export function shouldRender(...values: Approved<unknown>[]): boolean {
  return showPlaceholders || values.some((value) => isApproved(value));
}

/** True when any of the values has approved content, regardless of preview mode. */
export function hasApproved(...values: Approved<unknown>[]): boolean {
  return values.some((value) => isApproved(value));
}

export function PreviewBanner() {
  if (!showPlaceholders) return null;
  return (
    <div className="preview-banner" role="note">
      <p className="container">
        <strong>Preview build.</strong> Dashed yellow boxes mark content that Kings Rebar still needs to
        supply and approve. They are hidden in production builds.
      </p>
    </div>
  );
}
