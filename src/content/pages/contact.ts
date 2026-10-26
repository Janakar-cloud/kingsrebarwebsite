import { headquarters, salemBranch } from "../locations";
import type { PageMeta } from "../types";

export const contact = {
  meta: {
    title: "Contact Kings Rebar | Project and Career Enquiries",
    description:
      "Contact Kings Rebar about rebar detailing, estimation, or career enquiries. Use the form or the company’s contact details.",
  } satisfies PageMeta,
  title: "Contact Kings Rebar",
  intro:
    "Send Kings Rebar a project or career enquiry. Include enough detail for the team to understand what you need and how to follow up.",
  summary:
    "Send Kings Rebar a project or career enquiry. Include enough detail for the team to understand what you need and how to follow up.",
  formHeading: "Send an enquiry",
  detailsHeading: "Contact details",
  officesHeading: "Offices",
  offices: [
    { title: "Head office", lines: headquarters.address.lines },
    { title: "Salem branch", lines: salemBranch.address.lines },
  ],
  closing: {
    heading: "We look forward to hearing from you",
    body: "Share your enquiry using the form above or contact Kings Rebar through one of the channels on this page.",
  },
  formUnavailable: "Online enquiries are not available yet.",
} as const;
