import { RebarLayer } from "@/components/graphics/RebarField";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { enquiryCta } from "@/content/pages/shared";
import styles from "./EnquiryCta.module.css";

type Props = {
  heading?: string;
  body?: string;
  label?: string;
  href?: string;
};

/** Closing call to action shared by content pages. */
export function EnquiryCta({
  heading = enquiryCta.heading,
  body = enquiryCta.body,
  label = enquiryCta.label,
  href = enquiryCta.href,
}: Props) {
  return (
    <section className={styles.cta} data-tone="dark" aria-labelledby="enquiry-cta-heading">
      <RebarLayer layer="mid" className={styles.graphic} />
      <div className={`container ${styles.inner}`}>
        <Reveal variant="fade" className={styles.panel}>
          <p className="eyebrow">{enquiryCta.eyebrow}</p>
          <h2 id="enquiry-cta-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.body}>{body}</p>
          <ButtonLink href={href} size="lg" arrow>
            {label}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
