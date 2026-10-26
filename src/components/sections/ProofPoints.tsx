import { Reveal } from "@/components/motion/Reveal";
import type { ProofPoint } from "@/content/types";
import styles from "./ProofPoints.module.css";

type Props = {
  items: readonly ProofPoint[];
  labelledBy?: string;
  /** group reveals the whole row once. items (default) keeps per-tile reveals. */
  motion?: "items" | "group";
};

export function ProofPoints({ items, labelledBy, motion = "items" }: Props) {
  return (
    <ul className={styles.list} aria-labelledby={labelledBy}>
      {items.map((item, index) => {
        const inner = (
          <>
            <p className={styles.value}>{item.value}</p>
            <p className={styles.label}>{item.label}</p>
          </>
        );
        if (motion === "group") {
          return (
            <li key={item.label} className={styles.item}>
              {inner}
            </li>
          );
        }
        return (
          <Reveal as="li" key={item.label} index={index} className={styles.item}>
            {inner}
          </Reveal>
        );
      })}
    </ul>
  );
}
