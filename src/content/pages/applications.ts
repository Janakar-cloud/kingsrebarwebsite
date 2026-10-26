import { markets } from "../locations";
import { routes } from "../routes";
import type { ImageAsset, PageMeta } from "../types";

export const applications = {
  meta: {
    title: "Industries and Project Markets | Kings Rebar",
    description:
      "Learn about the project markets Kings Rebar currently serves and enquire about rebar detailing or estimation support.",
  } satisfies PageMeta,
  title: "Project markets",
  intro:
    "Kings Rebar works with clients in the United States and the United Kingdom. The company provides rebar detailing and estimation support for construction projects in those markets.",
  summary:
    "Kings Rebar works with clients in the United States and the United Kingdom. The company provides rebar detailing and estimation support for construction projects in those markets.",
  /** Illustrative steel mesh, not a Kings Rebar project photograph. */
  heroImage: {
    src: "/images/hero-industries.jpg",
    alt: "Illustrative steel reinforcement mesh",
    width: 1152,
    height: 864,
  } satisfies ImageAsset,
  listHeading: markets.heading,
  items: [...markets.items],
  cta: {
    heading: "Working on a project?",
    body: "Share the project location, scope, and the type of detailing or estimation support you need. Kings Rebar can review the enquiry and confirm whether it can assist.",
    label: "Make an enquiry",
    href: routes.contact,
  },
} as const;
