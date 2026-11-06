import { Paragraphs, shouldRender } from "@/components/content/Pending";
import { routeMotifs } from "@/components/graphics/Motif";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { PageHero } from "@/components/sections/PageHero";
import { careers } from "@/content/pages/careers";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(careers.meta, routes.careers, { absoluteTitle: true });

export default function CareersPage() {
  return (
    <>
      <PageHero
        route={routes.careers}
        title={careers.title}
        intro={careers.intro}
        summary={careers.summary}
        motif={routeMotifs[routes.careers]}
        image={careers.heroImage}
      />

      {shouldRender(careers.learn.paragraphs) && (
        <EditorialSection
          id="learn-heading"
          eyebrow="Development"
          heading={careers.learn.heading}
          backdrop={careers.learn.backdrop}
        >
          <Paragraphs value={careers.learn.paragraphs} />
          <p>
            <strong>{careers.learn.closing}</strong>
          </p>
        </EditorialSection>
      )}

      {shouldRender(careers.team.paragraphs) && (
        <EditorialSection
          id="team-heading"
          eyebrow="Team"
          heading={careers.team.heading}
          backdrop={careers.team.backdrop}
        >
          <Paragraphs value={careers.team.paragraphs} />
        </EditorialSection>
      )}

      <EnquiryCta
        heading={careers.openings.heading}
        body={careers.openings.paragraphs[0]}
        label={careers.cta.label}
        href={careers.cta.href}
      />
    </>
  );
}
