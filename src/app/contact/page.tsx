import { Suspense } from "react";

import { ContactDetails, hasApprovedContactDetails } from "@/components/content/ContactDetails";
import { PendingNote, Text } from "@/components/content/Pending";
import { routeMotifs } from "@/components/graphics/Motif";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialSection } from "@/components/sections/EditorialSection";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { showPlaceholders } from "@/config/env";
import { contact } from "@/content/pages/contact";
import { routes } from "@/content/routes";
import { site } from "@/content/site";
import { isApproved, isPending } from "@/content/types";
import { EnquiryFormLoader } from "@/features/enquiry/EnquiryFormLoader";
import { pageMetadata } from "@/lib/seo";
import styles from "./contact.module.css";

export const metadata = pageMetadata(contact.meta, routes.contact, { absoluteTitle: true });

export default function ContactPage() {
  const { enquiry, contact: channels } = site;
  const privacyApproved = isApproved(enquiry.privacyNotice);
  const formAvailable = privacyApproved || showPlaceholders;
  const showDetails = showPlaceholders || hasApprovedContactDetails();
  const topics = enquiry.topics as readonly string[];
  const approvedEmail = isApproved(channels.email) ? channels.email : undefined;

  return (
    <>
      <PageHero
        route={routes.contact}
        title={contact.title}
        intro={contact.intro}
        summary={contact.summary}
        motif={routeMotifs[routes.contact]}
        image={contact.heroImage}
      />

      <Section>
        <div className={showDetails ? styles.layout : undefined}>
          <Reveal className={styles.formCard}>
            <section aria-labelledby="enquiry-heading">
              <h2 id="enquiry-heading" className={styles.heading}>
                {contact.formHeading}
              </h2>
              {formAvailable ? (
                <Suspense fallback={<p>Loading the enquiry form…</p>}>
                  <EnquiryFormLoader
                    topics={topics}
                    privacyNotice={privacyApproved ? enquiry.privacyNotice : null}
                    privacyPendingNote={isPending(enquiry.privacyNotice) ? enquiry.privacyNotice.pending : null}
                    successHeading={enquiry.successHeading}
                    successMessage={enquiry.successMessage}
                    failureMessage={enquiry.failureMessage}
                    fallbackContact={{
                      email: approvedEmail,
                      phone: isApproved(channels.phone) ? channels.phone : undefined,
                    }}
                  />
                </Suspense>
              ) : (
                <p className="lead">
                  {contact.formUnavailable}
                  {approvedEmail && (
                    <>
                      {" "}
                      Please email us at <a href={`mailto:${approvedEmail}`}>{approvedEmail}</a>.
                    </>
                  )}
                </p>
              )}
            </section>
          </Reveal>

          {showDetails && (
            <aside aria-labelledby="details-heading" className={styles.aside}>
              <h2 id="details-heading" className={styles.heading}>
                {contact.detailsHeading}
              </h2>
              <ContactDetails columns />
              {isPending(channels.map) && <PendingNote note={channels.map.pending} as="div" />}
            </aside>
          )}
        </div>
      </Section>

      <Section tone="sunken" labelledBy="offices-heading">
        <div className="stack-lg">
          <h2 id="offices-heading" className={styles.heading}>
            {contact.officesHeading}
          </h2>
          <div className={styles.offices}>
            {contact.offices.map((office) => (
              <div key={office.title} className={styles.addressBlock}>
                <h3>{office.title}</h3>
                <address>
                  {office.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <EditorialSection id="closing-heading" heading={contact.closing.heading}>
        <Text value={contact.closing.body} />
      </EditorialSection>
    </>
  );
}
