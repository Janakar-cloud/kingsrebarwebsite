import { routes } from "../routes";
import type { ImageAsset, PageMeta } from "../types";

export const careers = {
  meta: {
    title: "Careers at Kings Rebar | Rebar Detailing Opportunities",
    description:
      "Learn about early-career development and work at Kings Rebar. Contact the company to ask about current opportunities.",
  } satisfies PageMeta,
  title: "Build your career at Kings Rebar",
  intro:
    "Kings Rebar helps early-career professionals develop technical skills and gain practical experience in rebar detailing.",
  summary:
    "Kings Rebar helps early-career professionals develop technical skills and gain practical experience in rebar detailing.",
  /** Illustrative still life, not a Kings Rebar workplace photograph. */
  heroImage: {
    src: "/images/hero-careers.jpg",
    alt: "Illustrative still life of a steel reinforcing bar",
    width: 1152,
    height: 864,
  } satisfies ImageAsset,
  learn: {
    heading: "Learn through practical experience",
    paragraphs: [
      "Early-career professionals can build technical knowledge through training, guidance, and practical project experience.",
    ],
  },
  team: {
    heading: "Grow with experienced colleagues",
    paragraphs: ["Collaboration and ongoing guidance are part of how Kings Rebar develops people."],
  },
  openings: {
    heading: "Ask about opportunities",
    paragraphs: [
      "For information about current roles, contact Kings Rebar directly. Open positions will be shown here only after the company has supplied and approved the role details.",
    ],
    cta: { label: "Ask about careers", href: `${routes.contact}?topic=Careers` },
  },
  cta: {
    heading: "Ask about opportunities",
    body: "For information about current roles, contact Kings Rebar directly.",
    label: "Ask about careers",
    href: `${routes.contact}?topic=Careers`,
  },
} as const;
