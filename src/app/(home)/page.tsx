import Image from "next/image";

import { ItemList } from "@/components/content/ItemList";
import { Paragraphs, shouldRender } from "@/components/content/Pending";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { ProcessFlow } from "@/components/sections/ProcessFlow";
import { LinkIndex } from "@/components/sections/LinkIndex";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { home } from "@/content/pages/home";
import { navigation, routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";
import { HomeHero } from "./HomeHero";
import styles from "./page.module.css";

export const metadata = pageMetadata(home.meta, routes.home, { absoluteTitle: true });

const explorePages = navigation.filter((item) => item.href !== routes.home);

export default function HomePage() {
  const { services, process, locations, explore, cta } = home;

  return (
    <>
      <OrganizationJsonLd />
      <HomeHero />

      <Section labelledBy="services-heading">
        <div className="stack-lg">
          <SectionHeading id="services-heading" eyebrow="Services" title={services.heading} wide>
            <p className="lead">{services.intro}</p>
          </SectionHeading>
          <ItemList items={services.items} numbered motion="group" />
          <ButtonLink href={services.cta.href} arrow>
            {services.cta.label}
          </ButtonLink>
        </div>
      </Section>

      {shouldRender(process.paragraphs) && (
        <EditorialSection
          id="process-heading"
          eyebrow="How we work"
          heading={process.heading}
          reveal="up"
          after={<ProcessFlow steps={process.steps} loopNote={process.loopNote} />}
        >
          <Paragraphs value={process.paragraphs} />
        </EditorialSection>
      )}

      {shouldRender(locations.paragraphs) && (
        <EditorialSection
          id="locations-heading"
          eyebrow="Locations"
          heading={locations.heading}
          tone="sunken"
          media={
            <Image
              src={locations.map.src}
              alt={locations.map.alt}
              width={locations.map.width}
              height={locations.map.height}
              sizes="(min-width: 56rem) 22vw, 92vw"
              className={styles.map}
            />
          }
        >
          <Paragraphs value={locations.paragraphs} />
          <div className={styles.places}>
            <div>
              <h3 className={styles.placeLabel}>{locations.offices.heading}</h3>
              <p className={styles.placeList}>{locations.offices.items.join(" · ")}</p>
            </div>
            <div>
              <h3 className={styles.placeLabel}>{locations.markets.heading}</h3>
              <p className={styles.placeList}>{locations.markets.items.join(" · ")}</p>
            </div>
          </div>
        </EditorialSection>
      )}

      <Section tone="sunken" labelledBy="explore-heading">
        <SectionHeading id="explore-heading" eyebrow={explore.eyebrow} title={explore.heading} />
        <LinkIndex items={explorePages} labelledBy="explore-heading" />
      </Section>

      <EnquiryCta heading={cta.heading} body={cta.body} label={cta.label} href={cta.href} />
    </>
  );
}
