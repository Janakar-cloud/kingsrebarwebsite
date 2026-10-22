import type { ReactNode } from "react";

import { site } from "@/content/site";
import { isApproved, isPending } from "@/content/types";
import { PendingNote } from "./Pending";

const { contact } = site;

export function hasApprovedContactDetails() {
  return [contact.email, contact.phone, contact.address, contact.hours].some((value) => isApproved(value));
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Approved public contact channels. Pending channels are omitted (or flagged in preview builds). */
export function ContactDetails({ className }: { className?: string }) {
  const entries: { term: string; details: ReactNode[] }[] = [];

  if (isApproved(contact.email)) {
    entries.push({
      term: "Email",
      details: [<a key="email" href={`mailto:${contact.email}`}>{contact.email}</a>],
    });
  }
  if (isApproved(contact.phone)) {
    entries.push({
      term: "Phone",
      details: [<a key="phone" href={telHref(contact.phone)}>{contact.phone}</a>],
    });
  }
  if (isApproved(contact.address)) {
    entries.push({
      term: "Address",
      details: [
        <address key="address">
          {contact.address.lines.map((line) => (
            <span key={line} style={{ display: "block" }}>
              {line}
            </span>
          ))}
        </address>,
      ],
    });
  }
  if (isApproved(contact.hours)) {
    entries.push({ term: "Business hours", details: contact.hours.map((line) => line) });
  }

  const pendingNotes = [contact.email, contact.phone, contact.address, contact.hours]
    .filter(isPending)
    .map((value) => value.pending);

  return (
    <div className={className}>
      {entries.length > 0 && (
        <dl>
          {entries.map((entry) => (
            <div key={entry.term}>
              <dt>{entry.term}</dt>
              {entry.details.map((detail, index) => (
                <dd key={index}>{detail}</dd>
              ))}
            </div>
          ))}
        </dl>
      )}
      {pendingNotes.map((note) => (
        <PendingNote key={note} as="div" note={note} />
      ))}
    </div>
  );
}
