import type { ReactNode } from "react";

import { showPlaceholders } from "@/config/env";
import { site } from "@/content/site";
import { isApproved, isPending, isProposed, publishedOrPreview, type Approved } from "@/content/types";
import { cn } from "@/lib/cn";
import { PendingNote } from "./Pending";
import styles from "./ContactDetails.module.css";

const { contact } = site;

export function hasApprovedContactDetails() {
  return [contact.email, contact.phone, contact.address, contact.hours, contact.website].some((value) =>
    isApproved(value),
  );
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function visible<T>(value: Approved<T> | undefined): T | undefined {
  return publishedOrPreview(value, showPlaceholders);
}

function fieldNote(value: unknown) {
  if (!isPending(value)) return null;
  return (
    <PendingNote
      key={value.pending}
      as="div"
      note={value.pending}
      label={isProposed(value) ? "Needs approval" : "Content needed"}
    />
  );
}

/** Approved public contact channels. Pending channels are omitted (or flagged in preview builds). */
export function ContactDetails({ className }: { className?: string }) {
  const email = visible(contact.email);
  const phone = visible(contact.phone);
  const address = visible(contact.address);
  const hours = visible(contact.hours);
  const website = visible(contact.website);

  const entries: { term: string; details: ReactNode[] }[] = [];

  if (email) {
    entries.push({
      term: "Email",
      details: [
        <a key="email" href={`mailto:${email}`}>
          {email}
        </a>,
      ],
    });
  }
  if (phone) {
    entries.push({
      term: "Phone",
      details: [
        <a key="phone" href={telHref(phone)}>
          {phone}
        </a>,
      ],
    });
  }
  if (address) {
    entries.push({
      term: "Address",
      details: [
        <address key="address">
          {address.lines.map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
        </address>,
      ],
    });
  }
  if (hours) {
    entries.push({ term: "Business hours", details: hours.map((line) => line) });
  }
  if (website) {
    const host = website.replace(/^https?:\/\//, "");
    entries.push({
      term: "Website",
      details: [
        <a key="website" href={website} rel="noopener noreferrer">
          {host}
        </a>,
      ],
    });
  }

  return (
    <div className={cn(styles.details, className)}>
      {entries.length > 0 && (
        <dl className={styles.list}>
          {entries.map((entry) => (
            <div key={entry.term} className={styles.entry}>
              <dt className={styles.term}>{entry.term}</dt>
              {entry.details.map((detail, index) => (
                <dd key={index}>{detail}</dd>
              ))}
            </div>
          ))}
        </dl>
      )}
      {[contact.email, contact.phone, contact.address, contact.hours, contact.website].map(fieldNote)}
    </div>
  );
}
