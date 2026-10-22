import { EnquiryCta } from "@/components/EnquiryCta";
import { ItemList } from "@/components/ItemList";
import { PageHeader } from "@/components/PageHeader";
import { Paragraphs, shouldRender, Text } from "@/components/Pending";
import { about } from "@/content/pages";
import { isApproved } from "@/content/types";
import { showPlaceholders } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(about.meta, "/about");

export default function AboutPage() {
  const { overview, history, values, locations } = about;
  const textSections = [
    { id: "overview", section: overview },
    { id: "history", section: history },
  ].filter(({ section }) => shouldRender(section.paragraphs));
  const showValues = shouldRender(values.items);
  const showLocations = shouldRender(locations.intro, locations.items);
  const hasAnyApproved =
    [overview.paragraphs, history.paragraphs, values.items, locations.items, locations.intro].some(
      (value) => isApproved(value),
    );

  return (
    <>
      <PageHeader title={about.meta.title} intro={about.intro} />

      {textSections.map(({ id, section }) => (
        <section key={id} className="section" aria-labelledby={`${id}-heading`}>
          <div className="container">
            <h2 id={`${id}-heading`}>{section.heading}</h2>
            <Paragraphs value={section.paragraphs} />
          </div>
        </section>
      ))}

      {showValues && (
        <section className="section" aria-labelledby="values-heading">
          <div className="container">
            <h2 id="values-heading">{values.heading}</h2>
            <ItemList items={values.items} />
          </div>
        </section>
      )}

      {showLocations && (
        <section className="section" aria-labelledby="locations-heading">
          <div className="container stack">
            <h2 id="locations-heading">{locations.heading}</h2>
            <Text value={locations.intro} />
            <ItemList items={locations.items} />
          </div>
        </section>
      )}

      {!hasAnyApproved && !showPlaceholders && (
        <section className="section">
          <div className="container">
            <p className="lead">{about.emptyFallback}</p>
          </div>
        </section>
      )}

      <EnquiryCta />
    </>
  );
}
