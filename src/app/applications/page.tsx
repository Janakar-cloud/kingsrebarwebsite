import { EnquiryCta } from "@/components/EnquiryCta";
import { ItemList } from "@/components/ItemList";
import { PageHeader } from "@/components/PageHeader";
import { PendingNote } from "@/components/Pending";
import { applications } from "@/content/pages";
import { showPlaceholders } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(applications.meta, "/applications");

export default function ApplicationsPage() {
  const items = applications.items.map((item) => ({ title: item.title, description: item.description }));
  const hasItems = items.length > 0;

  return (
    <>
      <PageHeader title={applications.meta.title} intro={applications.intro} />

      {(hasItems || showPlaceholders) && (
        <section className="section" aria-labelledby="applications-heading">
          <div className="container stack">
            <h2 id="applications-heading">Uses and industries</h2>
            {hasItems ? <ItemList items={items} /> : <PendingNote note={applications.itemsPendingNote} />}
          </div>
        </section>
      )}

      <EnquiryCta
        heading="Discuss your requirements"
        body={applications.emptyFallback}
        linkLabel="Contact Kings Rebar"
      />
    </>
  );
}
