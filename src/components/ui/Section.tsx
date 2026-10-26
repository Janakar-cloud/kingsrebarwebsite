import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export type Tone = "light" | "sunken" | "dark";

type Props = {
  tone?: Tone;
  compact?: boolean;
  /** Wrap children in the page-width container. Disable for full-bleed layouts. */
  contained?: boolean;
  /** id of the heading that names this region. */
  labelledBy?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

/** A full-width page band. `tone` switches every semantic colour token inside it. */
export function Section({
  tone = "light",
  compact,
  contained = true,
  labelledBy,
  className,
  containerClassName,
  children,
}: Props) {
  return (
    <section
      className={cn("section", compact && "section--compact", tone === "dark" && "grain", className)}
      data-tone={tone}
      aria-labelledby={labelledBy}
    >
      {contained ? <div className={cn("container", containerClassName)}>{children}</div> : children}
    </section>
  );
}
