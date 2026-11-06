import { branches, locationsMap, markets } from "../locations";
import { routes } from "../routes";
import { pending, type Approved, type ImageAsset, type ListItem, type PageMeta } from "../types";

export const home = {
  meta: {
    title: "Kings Rebar | Rebar Detailing and Estimation",
    description:
      "Kings Rebar provides rebar detailing and estimation support for construction projects, including reinforcement shop drawings and quantity take-offs.",
  } satisfies PageMeta,
  title: "Kings Rebar",
  titleLines: ["Kings", "Rebar"],
  taglineLines: ["Rebar detailing and estimation", "for construction projects"],
  hero: {
    intro: "Kings Rebar prepares reinforcement shop drawings and quantity take-offs based on project drawings and requirements.",
    summary:
      "Kings Rebar prepares reinforcement shop drawings and quantity take-offs based on project drawings and requirements.",
    image: pending(
      "Optional approved hero photograph, 1600×1000. Until one is supplied, the original rebar graphic is the published hero.",
    ) as Approved<ImageAsset>,
    primaryCta: { label: "Discuss a project", href: routes.contact },
    secondaryCta: { label: "Explore our services", href: routes.services },
  },
  services: {
    heading: "What we do",
    intro:
      "We support construction projects with rebar detailing and estimation, based on the drawings, specifications, and requirements provided for each project.",
    items: [
      {
        title: "Rebar detailing",
        description:
          "We prepare reinforcement shop drawings to communicate rebar placement and project information clearly. Deliverables are developed around the drawings and requirements supplied for the project.",
      },
      {
        title: "Rebar estimation",
        description: "We prepare quantity take-offs to help project teams understand material requirements and plan their work.",
      },
    ] satisfies ListItem[],
    cta: { label: "View services", href: routes.services },
  },
  process: {
    heading: "Clear information for project teams",
    paragraphs: [
      "Every project has its own drawings, specifications, and delivery needs. Kings Rebar works from the information provided by the client and coordinates the detailing or estimation work around the agreed project requirements.",
    ],
    loopNote: "If clarification changes the scope",
    steps: [
      {
        title: "Share project information",
        detail: "Drawings, specifications, scope",
        image: {
          src: "/images/process-share.png",
          alt: "Architectural plans, a blueprint, and drafting tools arranged on a desk",
          width: 1200,
          height: 896,
        },
      },
      {
        title: "Review the scope",
        detail: "Confirm the requested work",
        image: {
          src: "/images/process-review.png",
          alt: "Rolled drawings arranged beside a blank review checklist",
          width: 1200,
          height: 896,
        },
      },
      {
        title: "Confirm requirements",
        detail: "Deliverables, formats, schedule",
        image: {
          src: "/images/process-confirm.png",
          alt: "Bound plan sheets, drawing rolls, and a project binder",
          width: 1200,
          height: 896,
        },
      },
      {
        title: "Prepare the work",
        detail: "Detailing or quantity take-off",
        image: {
          src: "/images/process-prepare.png",
          alt: "A monitor showing a technical model beside a bent reinforcing bar",
          width: 1200,
          height: 896,
        },
      },
      {
        title: "Coordinate questions",
        detail: "Clarify project information",
        image: {
          src: "/images/process-coordinate.png",
          alt: "A tablet with a wireframe drawing laid over engineering plans",
          width: 1200,
          height: 896,
        },
      },
      {
        title: "Issue deliverables",
        detail: "Send agreed files for review",
        image: {
          src: "/images/process-issue.png",
          alt: "A tablet showing a three-dimensional wireframe among drawing sheets",
          width: 1200,
          height: 896,
        },
      },
    ] satisfies readonly { title: string; detail: string; image: ImageAsset }[],
  },
  locations: {
    heading: "Where we work",
    map: locationsMap,
    paragraphs: [
      "Kings Rebar is based in Tamil Nadu, with offices in Aruppukottai, Salem, Karur, Cheyyar, and Coimbatore. These locations form the company’s presence across the state.",
      "Kings Rebar also works with clients in the United States and the United Kingdom. For each engagement, the team works from the project information and scope provided by the client, coordinating the requested rebar detailing and estimation work around those requirements.",
    ],
    offices: {
      heading: "Tamil Nadu offices",
      items: branches.map((branch) => branch.title),
    },
    markets: {
      heading: "Client markets",
      items: markets.items.map((market) => market.title),
    },
  },
  cta: {
    heading: "Tell us about your project",
    body: "Share your project requirements with Kings Rebar. The team can review your enquiry and confirm whether its detailing or estimation services are a fit.",
    label: "Make an enquiry",
    href: routes.contact,
  },
  explore: {
    eyebrow: "Explore",
    heading: "Explore Kings Rebar",
  },
} as const;
