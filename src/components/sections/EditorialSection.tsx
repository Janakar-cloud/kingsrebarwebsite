import Image from "next/image";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Section, type Tone } from "@/components/ui/Section";
import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/cn";
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
  /** Sits under the heading in the label column. */
  media?: ReactNode;
  /** Full-width block below the split, used for diagrams that need the page measure. */
  after?: ReactNode;
  /**
   * Full-bleed photo behind the section. The section switches to the dark tone
   * and a scrim keeps the text readable. The photo is decorative, so give it alt="".
   */
  backdrop?: ImageAsset;
};

/** Sticky label column beside a reading column; the site's main long-form layout. */
export function EditorialSection({
  id,
  eyebrow,
  heading,
  tone,
  large,
  reveal = "up",
  children,
  media,
  after,
  backdrop,
}: Props) {
  return (
    <Section tone={backdrop ? "dark" : tone} labelledBy={id} className={cn(backdrop && styles.withBackdrop)}>
      {backdrop && (
        <div className={styles.backdrop} aria-hidden="true">
          <Image
            src={backdrop.src}
            alt=""
            fill
            sizes="100vw"
            className={styles.backdropImage}
            style={{ objectPosition: backdrop.objectPosition }}
          />
        </div>
      )}
      <div className={`split ${styles.align}`}>
        <div className={`split__aside ${styles.aside}`}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <div className={styles.headingBlock}>
            <h2 id={id} className={styles.heading}>
              {heading}
            </h2>
            {media}
          </div>
        </div>
        <Reveal variant={reveal} className={large ? `${styles.body} ${styles.large}` : styles.body}>
          {children}
        </Reveal>
      </div>
      {after && <div className={styles.after}>{after}</div>}
    </Section>
  );
}
