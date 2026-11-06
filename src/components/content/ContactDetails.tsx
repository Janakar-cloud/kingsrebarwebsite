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
export function ContactDetails({ className, columns = false }: { className?: string; columns?: boolean }) {
  const email = visible(contact.email);
  const phone = visible(contact.phone);
  const address = visible(contact.address);
  const hours = visible(contact.hours);
  const website = visible(contact.website);

  const entry = (term: string, details: ReactNode[]) => (
    <div key={term} className={styles.entry}>
      <dt className={styles.term}>{term}</dt>
      {details.map((detail, index) => (
        <dd key={index}>{detail}</dd>
      ))}
    </div>
  );

  const reach = [
    email
      ? entry("Email", [
          <a key="email" href={`mailto:${email}`}>
            {email}
          </a>,
        ])
      : null,
    phone
      ? entry("Phone", [
          <a key="phone" href={telHref(phone)}>
            {phone}
          </a>,
        ])
      : null,
  ].filter(Boolean);

  const location = address
    ? [
        entry("Address", [
          <address key="address">
            {address.lines.map((line) => (
              <span key={line} className={styles.line}>
                {line}
              </span>
            ))}
          </address>,
        ]),
      ]
    : [];

  const host = website?.replace(/^https?:\/\//, "");
  const extra = [
    hours ? entry("Business hours", hours.map((line) => line)) : null,
    website
      ? entry("Website", [
          <a key="website" href={website} rel="noopener noreferrer">
            {host}
          </a>,
        ])
      : null,
  ].filter(Boolean);

  const groups = columns ? [reach, location, extra].filter((group) => group.length > 0) : [[...reach, ...location, ...extra]];

  return (
    <div className={cn(styles.details, className)}>
      {/* A <dl> may only contain <dt>/<dd> or <div> wrappers around them, so each column is its own list. */}
      {groups.some((group) => group.length > 0) && (
        <div className={columns ? cn(styles.list, styles.columns) : undefined}>
          {groups.map((group, index) => (
            <dl key={index} className={columns ? styles.column : styles.list}>
              {group}
            </dl>
          ))}
        </div>
      )}
      {[contact.email, contact.phone, contact.address, contact.hours, contact.website].map(fieldNote)}
    </div>
  );
}
