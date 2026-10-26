import { Paragraphs } from "@/components/content/Pending";
import { routeMotifs } from "@/components/graphics/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/pages/services";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";
import styles from "./services.module.css";

export const metadata = pageMetadata(services.meta, routes.services, { absoluteTitle: true });

export default function ServicesPage() {
  const offers = [services.detailing, services.estimation];

  return (
    <>
      <PageHero
        route={routes.services}
        title={services.title}
        intro={services.intro}
        summary={services.summary}
        motif={routeMotifs[routes.services]}
        image={services.heroImage}
      />

      <Section labelledBy="detailing-heading">
        <ul className={styles.grid}>
          {offers.map((offer, index) => (
            <Reveal as="li" key={offer.heading} index={index} className={styles.card}>
              <span className={styles.index} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 id={index === 0 ? "detailing-heading" : undefined} className={styles.name}>
                {offer.heading}
              </h2>
              {offer.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.summary}>
                  {paragraph}
                </p>
              ))}
            </Reveal>
          ))}
        </ul>
      </Section>

      <EditorialSection id="coordination-heading" eyebrow="Coordination" heading={services.coordination.heading} tone="sunken">
        <Paragraphs value={services.coordination.paragraphs} />
      </EditorialSection>

      <EditorialSection id="software-heading" eyebrow="Tools" heading={services.software.heading}>
        <Paragraphs value={services.software.paragraphs} />
      </EditorialSection>

      <EnquiryCta
        heading={services.cta.heading}
        body={services.cta.body}
        label={services.cta.label}
        href={services.cta.href}
      />
    </>
  );
}
