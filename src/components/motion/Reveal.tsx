import type { CSSProperties, ReactNode } from "react";

type Props = {
  as?: "div" | "li" | "article" | "header" | "figure" | "ul";
  /** "up" rises into place, "fade" only fades, "scale" grows slightly, "clip" unmasks. */
  variant?: "up" | "fade" | "scale" | "clip";
  /** Position within a group; each step adds one stagger interval (capped). */
  index?: number;
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Marks content for a one-time scroll reveal handled by <RevealObserver>.
 * Renders fully visible markup; without JavaScript, or with reduced motion,
 * nothing is hidden.
 */
export function Reveal({ as: Tag = "div", variant = "up", index, className, id, style, children }: Props) {
  const merged = {
    ...(index ? { "--reveal-index": index } : {}),
    ...style,
  } as CSSProperties | undefined;
  return (
    <Tag data-reveal={variant} className={className} id={id} style={merged}>
      {children}
    </Tag>
  );
}
