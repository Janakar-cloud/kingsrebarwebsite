import Link from "next/link";

import styles from "./EnquiryCta.module.css";

type Props = {
  heading?: string;
  body?: string;
  linkLabel?: string;
};

export function EnquiryCta({
  heading = "Have a question?",
  body = "Send an enquiry to Kings Rebar using the contact form.",
  linkLabel = "Make an enquiry",
}: Props) {
  return (
    <section className={styles.band} aria-labelledby="enquiry-cta-heading">
      <div className={`container ${styles.inner}`}>
        <div>
          <h2 id="enquiry-cta-heading" className={styles.heading}>
            {heading}
          </h2>
          <p className={styles.body}>{body}</p>
        </div>
        <Link href="/contact" className={`button ${styles.button}`}>
          {linkLabel}
        </Link>
      </div>
    </section>
  );
}
