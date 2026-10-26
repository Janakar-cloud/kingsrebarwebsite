import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Section, type Tone } from "@/components/ui/Section";
import styles from "./EditorialSection.module.css";

type Props = {
  id: string;
  eyebrow?: string;
  heading: string;
  tone?: Tone;
  /** Larger reading text for short, important passages. */
  large?: boolean;
  /** Clip-unmask the reading column. Default rise is unchanged. */
  reveal?: "up" | "clip";
  children: ReactNode;
  /** Full-width block below the split, used for diagrams that need the page measure. */
  after?: ReactNode;
};

/** Sticky label column beside a reading column; the site's main long-form layout. */
export function EditorialSection({ id, eyebrow, heading, tone, large, reveal = "up", children, after }: Props) {
  return (
    <Section tone={tone} labelledBy={id}>
      <div className={`split ${styles.align}`}>
        <div className={`split__aside ${styles.aside}`}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={id} className={styles.heading}>
            {heading}
          </h2>
        </div>
        <Reveal variant={reveal} className={large ? `${styles.body} ${styles.large}` : styles.body}>
          {children}
        </Reveal>
      </div>
      {after && <div className={styles.after}>{after}</div>}
    </Section>
  );
}
