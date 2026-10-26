import type { Metadata } from "next";

import { LinkIndex } from "@/components/sections/LinkIndex";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { notFound } from "@/content/pages/shared";
import { navigation, routes } from "@/content/routes";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: notFound.title,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <section className={`${styles.hero} grain`} data-tone="dark" aria-labelledby="not-found-heading">
        <div className="container">
          <p className="eyebrow">Error 404</p>
          <h1 id="not-found-heading">{notFound.title}</h1>
          <p className="lead">{notFound.body}</p>
          <div className={styles.actions}>
            <ButtonLink href={routes.home} arrow>
              Go to the home page
            </ButtonLink>
            <ButtonLink href={routes.contact} variant="secondary">
              Contact Kings Rebar
            </ButtonLink>
          </div>
        </div>
      </section>
      <Section tone="sunken" labelledBy="not-found-pages">
        <h2 id="not-found-pages" className={styles.pagesHeading}>
          Site pages
        </h2>
        <LinkIndex items={navigation} labelledBy="not-found-pages" />
      </Section>
    </>
  );
}
