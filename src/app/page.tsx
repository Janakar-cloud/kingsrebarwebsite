import Link from "next/link";

import { EnquiryCta } from "@/components/EnquiryCta";
import { ImageSlot } from "@/components/ImageSlot";
import { OrganizationJsonLd } from "@/components/OrganizationJsonLd";
import { Paragraphs, shouldRender, Text } from "@/components/Pending";
import { home } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata(home.meta, "/", { absoluteTitle: true });

export default function HomePage() {
  const { hero, overview, explore } = home;

  return (
    <>
      <OrganizationJsonLd />

      <section className={styles.hero} aria-labelledby="home-title">
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <Text value={hero.eyebrow} className="eyebrow" />
            <h1 id="home-title" className={styles.heroTitle}>
              {site.companyName}
            </h1>
            <Text value={hero.intro} className="lead" />
            <div className="button-row">
              <Link href={hero.primaryCta.href} className="button">
                {hero.primaryCta.label}
              </Link>
              <Link href={hero.secondaryCta.href} className="button button--secondary">
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
          <ImageSlot image={hero.image} sizes="(min-width: 56rem) 45vw, 100vw" priority />
        </div>
      </section>

      {shouldRender(overview.paragraphs) && (
        <section className="section" aria-labelledby="overview-heading">
          <div className="container">
            <h2 id="overview-heading">{overview.heading}</h2>
            <Paragraphs value={overview.paragraphs} />
          </div>
        </section>
      )}

      <section className="section section--sunken" aria-labelledby="explore-heading">
        <div className="container">
          <h2 id="explore-heading">{explore.heading}</h2>
          <ul className={`card-grid ${styles.explore}`}>
            {explore.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`card ${styles.exploreLink}`}>
                  <h3>{link.title}</h3>
                  <p>{link.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EnquiryCta />
    </>
  );
}
