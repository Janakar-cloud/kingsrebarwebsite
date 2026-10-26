import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";
import styles from "./SectionHeading.module.css";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  /** Supporting copy below the heading. */
  children?: ReactNode;
  align?: "start" | "center";
  /** Let supporting copy use the full section width, including as a single line on wide screens. */
  wide?: boolean;
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, children, align = "start", wide = false, className }: Props) {
  return (
    <Reveal className={cn(styles.heading, align === "center" && styles.center, wide && styles.wide, className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {children && <div className={styles.body}>{children}</div>}
    </Reveal>
  );
}
