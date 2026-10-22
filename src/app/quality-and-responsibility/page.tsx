import { EnquiryCta } from "@/components/EnquiryCta";
import { PageHeader } from "@/components/PageHeader";
import { Paragraphs, PendingNote, shouldRender } from "@/components/Pending";
import { quality } from "@/content/pages";
import { isApproved } from "@/content/types";
import { showPlaceholders } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(quality.meta, "/quality-and-responsibility");

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function QualityPage() {
  const sections = quality.sections.filter((section) => shouldRender(section.paragraphs));
  const certifications = quality.certifications.items;
  const showCertifications = certifications.length > 0 || showPlaceholders;
  const hasAnyApproved =
    certifications.length > 0 || quality.sections.some((section) => isApproved(section.paragraphs));

  return (
    <>
      <PageHeader title={quality.meta.title} intro={quality.intro} />

      {sections.map((section) => {
        const id = `${slug(section.heading)}-heading`;
        return (
          <section key={section.heading} className="section" aria-labelledby={id}>
            <div className="container">
              <h2 id={id}>{section.heading}</h2>
              <Paragraphs value={section.paragraphs} />
            </div>
          </section>
        );
      })}

      {showCertifications && (
        <section className="section" aria-labelledby="certifications-heading">
          <div className="container stack">
            <h2 id="certifications-heading">{quality.certifications.heading}</h2>
            {certifications.length > 0 ? (
              <ul className="card-grid">
                {certifications.map((certification) => (
                  <li key={certification.name} className="card">
                    <h3>{certification.name}</h3>
                    <p>Issued by {certification.issuer}</p>
                    {certification.scope && <p>{certification.scope}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <PendingNote note={quality.certifications.pendingNote} />
            )}
          </div>
        </section>
      )}

      {!hasAnyApproved && !showPlaceholders && (
        <section className="section">
          <div className="container">
            <p className="lead">{quality.emptyFallback}</p>
          </div>
        </section>
      )}

      <EnquiryCta />
    </>
  );
}
