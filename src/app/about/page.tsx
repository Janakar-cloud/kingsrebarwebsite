import Image from "next/image";

import { ItemList } from "@/components/content/ItemList";
import { Paragraphs, Text } from "@/components/content/Pending";
import { routeMotifs } from "@/components/graphics/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { about } from "@/content/pages/about";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";
import styles from "./about.module.css";

export const metadata = pageMetadata(about.meta, routes.about, { absoluteTitle: true });

export default function AboutPage() {
  const { history, founder, approach, people, locations, cta } = about;

  return (
    <>
      <PageHero
        route={routes.about}
        title={about.title}
        intro={about.intro}
        summary={about.summary}
        motif={routeMotifs[routes.about]}
        image={about.heroImage}
        storytelling
      />

      <Section labelledBy="history-heading">
        <div className={styles.story}>
          <div className={styles.intro}>
            <p className="eyebrow">Story</p>
            <h2 id="history-heading" className={styles.draw}>
              {history.heading}
            </h2>
          </div>
          <figure className={styles.portrait}>
            <Image
              src={founder.image.src}
              alt={founder.image.alt}
              width={founder.image.width}
              height={founder.image.height}
              sizes="(min-width: 56rem) 28rem, 92vw"
              className={styles.photo}
            />
            <figcaption className={styles.caption}>
              <span className={styles.name}>{founder.name}</span>
              <span className={styles.role}>{founder.role}</span>
            </figcaption>
          </figure>
          <Reveal variant="clip" className={styles.copy}>
            <Paragraphs value={history.paragraphs} />
          </Reveal>
        </div>
      </Section>

      <EditorialSection id="approach-heading" eyebrow="Approach" heading={approach.heading} tone="sunken">
        <Paragraphs value={approach.paragraphs} />
      </EditorialSection>

      <EditorialSection id="people-heading" eyebrow="People" heading={people.heading}>
        <Paragraphs value={people.paragraphs} />
        <ButtonLink href={people.cta.href} arrow>
          {people.cta.label}
        </ButtonLink>
      </EditorialSection>

      <EditorialSection id="locations-heading" eyebrow="Locations" heading={locations.heading} reveal="clip">
        <Text value={locations.intro} className="lead" />
        <ItemList items={locations.items} motion="group" layout="row" />
      </EditorialSection>

      <EnquiryCta heading={cta.heading} body={cta.body} label={cta.label} href={cta.href} />
    </>
  );
}
