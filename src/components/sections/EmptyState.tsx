import { Motif, type MotifVariant } from "@/components/graphics/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { routes } from "@/content/routes";
import styles from "./EmptyState.module.css";

type Props = {
  id: string;
  heading: string;
  body: string;
  motif: MotifVariant;
  actionLabel?: string;
};

/**
 * Shown in production where a section has no approved content yet. Invites
 * an enquiry instead of displaying unfinished copy.
 */
export function EmptyState({ id, heading, body, motif, actionLabel = "Make an enquiry" }: Props) {
  return (
    <Reveal className={styles.panel}>
      <div className={styles.visual} data-tone="dark">
        <Motif variant={motif} className={styles.motif} />
      </div>
      <div className={styles.text}>
        <h2 id={id} className={styles.heading}>
          {heading}
        </h2>
        <p className="lead">{body}</p>
        <ButtonLink href={routes.contact} arrow>
          {actionLabel}
        </ButtonLink>
      </div>
    </Reveal>
  );
}
