import { ItemList } from "@/components/content/ItemList";
import { shouldRender } from "@/components/content/Pending";
import { routeMotifs } from "@/components/graphics/Motif";
import { EnquiryCta } from "@/components/sections/EnquiryCta";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { applications } from "@/content/pages/applications";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(applications.meta, routes.applications, { absoluteTitle: true });

export default function ApplicationsPage() {
  return (
    <>
      <PageHero
        route={routes.applications}
        title={applications.title}
        intro={applications.intro}
        summary={applications.summary}
        motif={routeMotifs[routes.applications]}
        image={applications.heroImage}
      />

      {shouldRender(applications.items) && (
        <Section tone="sunken">
          <ItemList items={applications.items} headingLevel={2} />
        </Section>
      )}

      <EnquiryCta
        heading={applications.cta.heading}
        body={applications.cta.body}
        label={applications.cta.label}
        href={applications.cta.href}
      />
    </>
  );
}
