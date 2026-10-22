import { ContactDetails, hasApprovedContactDetails } from "@/components/ContactDetails";
import { EnquiryForm } from "@/components/EnquiryForm";
import { PageHeader } from "@/components/PageHeader";
import { PendingNote } from "@/components/Pending";
import { contact } from "@/content/pages";
import { site } from "@/content/site";
import { isApproved, isPending } from "@/content/types";
import { showPlaceholders } from "@/lib/env";
import { pageMetadata } from "@/lib/seo";
import styles from "./contact.module.css";

export const metadata = pageMetadata(contact.meta, "/contact");

export default function ContactPage() {
  const { enquiry, contact: channels } = site;
  const privacyApproved = isApproved(enquiry.privacyNotice);
  const formAvailable = privacyApproved || showPlaceholders;
  const showDetails = showPlaceholders || hasApprovedContactDetails();
  const map = isApproved(channels.map) ? channels.map : null;

  return (
    <>
      <PageHeader title={contact.meta.title} intro={formAvailable ? contact.intro : undefined} />

      <div className={`container section ${styles.layout}`}>
        <section aria-labelledby="enquiry-heading" className={styles.formColumn}>
          <h2 id="enquiry-heading">{contact.formHeading}</h2>
          {formAvailable ? (
            <EnquiryForm
              topics={enquiry.topics}
              privacyNotice={privacyApproved ? (enquiry.privacyNotice as string) : null}
              privacyPendingNote={isPending(enquiry.privacyNotice) ? enquiry.privacyNotice.pending : null}
              successHeading={enquiry.successHeading}
              successMessage={enquiry.successMessage}
              failureMessage={enquiry.failureMessage}
              fallbackContact={{
                email: isApproved(channels.email) ? channels.email : undefined,
                phone: isApproved(channels.phone) ? channels.phone : undefined,
              }}
            />
          ) : (
            <p>{contact.formUnavailable}</p>
          )}
        </section>

        {(showDetails || map) && (
          <aside aria-labelledby="details-heading" className={styles.detailsColumn}>
            <h2 id="details-heading">{contact.detailsHeading}</h2>
            <ContactDetails className={styles.details} />
            {map ? (
              <iframe
                className={styles.map}
                src={map.embedUrl}
                title={map.title}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              isPending(channels.map) && <PendingNote note={channels.map.pending} />
            )}
          </aside>
        )}
      </div>
    </>
  );
}
