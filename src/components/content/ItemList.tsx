import type { CSSProperties } from "react";

import { Flag } from "@/components/graphics/Flag";
import { Reveal } from "@/components/motion/Reveal";
import { showPlaceholders } from "@/config/env";
import { isApproved, isPending, isProposed, type Approved, type ListItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { PendingNote } from "./Pending";
import styles from "./ItemList.module.css";

type Props = {
  items: Approved<readonly ListItem[]>;
  headingLevel?: 2 | 3 | 4;
  /** Show a two-digit index beside each item. */
  numbered?: boolean;
  /**
   * items — each card reveals (default, existing pages).
   * group — the whole grid reveals once.
   * pair — two-step stagger, used for mission and vision.
   */
  motion?: "items" | "group" | "pair";
  /** row keeps every item on one line. Used for the five offices. line is the same for longer card copy. */
  layout?: "grid" | "row" | "line";
  className?: string;
};

/** Grid of short titled items such as values, locations or applications. */
export function ItemList({
  items,
  headingLevel = 3,
  numbered = false,
  motion = "items",
  layout = "grid",
  className,
}: Props) {
  if (!isApproved(items)) {
    if (isProposed<readonly ListItem[]>(items) && showPlaceholders) {
      return (
        <div>
          <PendingNote note={items.pending} as="div" label="Needs approval" />
          <ItemList
            items={items.proposed}
            headingLevel={headingLevel}
            numbered={numbered}
            motion={motion}
            layout={layout}
            className={className}
          />
        </div>
      );
    }
    return isPending(items) ? <PendingNote note={items.pending} /> : null;
  }
  const Heading = `h${headingLevel}` as const;
  const listClass = cn(styles.list, layout === "row" && styles.row, layout === "line" && styles.line, className);
  const listStyle = layout === "row" || layout === "line" ? ({ "--columns": items.length } as CSSProperties) : undefined;
  const cards = items.map((item, index) => {
    const inner = (
      <>
        {numbered && (
          <span className={styles.index} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        {item.flag ? (
          <div className={styles.headingRow}>
            <Flag code={item.flag} />
            <Heading className={styles.title}>{item.title}</Heading>
          </div>
        ) : (
          <Heading className={styles.title}>{item.title}</Heading>
        )}
        {item.description && <p className={styles.description}>{item.description}</p>}
      </>
    );
    if (motion === "group") {
      return (
        <li key={item.title} className={styles.item}>
          {inner}
        </li>
      );
    }
    return (
      <Reveal as="li" key={item.title} index={motion === "pair" ? Math.min(index, 1) : index} className={styles.item}>
        {inner}
      </Reveal>
    );
  });

  if (motion === "group") {
    return (
      <Reveal as="ul" variant="fade" className={listClass} style={listStyle}>
        {cards}
      </Reveal>
    );
  }

  return (
    <ul className={listClass} style={listStyle}>
      {cards}
    </ul>
  );
}
