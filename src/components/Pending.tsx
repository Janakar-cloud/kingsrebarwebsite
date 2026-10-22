import { isApproved, type Approved } from "@/content/types";
import { showPlaceholders } from "@/lib/env";

/** Marks content the client still has to supply. Renders nothing in production builds. */
export function PendingNote({ note, as: Tag = "p" }: { note: string; as?: "p" | "div" | "li" }) {
  if (!showPlaceholders) return null;
  return (
    <Tag className="pending">
      <span className="pending__label">Content needed</span>
      {note}
    </Tag>
  );
}

/** Renders approved paragraphs, or a pending note while the copy is outstanding. */
export function Paragraphs({ value, className }: { value: Approved<string[]>; className?: string }) {
  if (isApproved(value)) {
    return value.map((paragraph) => (
      <p key={paragraph} className={className}>
        {paragraph}
      </p>
    ));
  }
  return <PendingNote note={value.pending} />;
}

/** Renders a single approved paragraph, or a pending note while it is outstanding. */
export function Text({ value, className }: { value: Approved<string>; className?: string }) {
  if (isApproved(value)) return <p className={className}>{value}</p>;
  if (typeof value === "string") return null;
  return <PendingNote note={value.pending} />;
}

/** True when a section should be rendered: it has approved content, or placeholders are visible. */
export function shouldRender(...values: Approved<unknown>[]): boolean {
  return showPlaceholders || values.some((value) => isApproved(value));
}

export function PreviewBanner() {
  if (!showPlaceholders) return null;
  return (
    <div className="preview-banner">
      <p className="container">
        <strong>Preview build.</strong> Dashed yellow boxes mark content that Kings Rebar still needs to
        supply and approve. They are hidden in production builds.
      </p>
    </div>
  );
}
