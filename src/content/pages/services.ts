import { routes } from "../routes";
import type { ImageAsset, PageMeta } from "../types";

export const services = {
  meta: {
    title: "Rebar Detailing and Estimation Services | Kings Rebar",
    description:
      "Explore Kings Rebar’s rebar detailing and estimation work, including reinforcement shop drawings and quantity take-offs.",
  } satisfies PageMeta,
  title: "Rebar detailing and estimation services",
  intro:
    "Kings Rebar provides rebar detailing and estimation support for construction projects. The work is prepared from project drawings, specifications, and requirements supplied by the client.",
  summary:
    "Kings Rebar provides rebar detailing and estimation support for construction projects. The work is prepared from project drawings, specifications, and requirements supplied by the client.",
  /** Illustrative steel texture, not a Kings Rebar product photograph. */
  heroImage: {
    src: "/images/hero-services.jpg",
    alt: "Illustrative close-up of steel reinforcing bars",
    width: 1152,
    height: 864,
  } satisfies ImageAsset,
  detailing: {
    heading: "Rebar detailing",
    paragraphs: [
      "Rebar detailing communicates reinforcement requirements through shop drawings prepared for a project. Kings Rebar prepares reinforcement shop drawings based on the drawings and requirements supplied for the project.",
    ],
  },
  estimation: {
    heading: "Rebar estimation and quantity take-offs",
    paragraphs: [
      "Quantity take-offs help project teams understand the reinforcement quantities shown in project information. Kings Rebar prepares rebar estimates based on the drawings and scope provided for the project.",
    ],
  },
  coordination: {
    heading: "Project coordination",
    paragraphs: [
      "Clear communication helps the project team understand requirements and deliverables. Kings Rebar can discuss the project scope, required information, and expected outputs with prospective clients before work begins.",
    ],
  },
  software: {
    heading: "Software",
    paragraphs: ["The team uses AutoCAD and RebarCAD as part of its rebar detailing work."],
  },
  cta: {
    heading: "Have a project to discuss?",
    body: "Send Kings Rebar an enquiry with a brief description of your project and the support you are looking for.",
    label: "Make an enquiry",
    href: routes.contact,
  },
} as const;
