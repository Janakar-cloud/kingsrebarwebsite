import { routes } from "../routes";
import type { ImageAsset, ListItem, PageMeta } from "../types";

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
  heroImage: {
    src: "/images/kr-services.jpg",
    alt: "A person pointing at a construction dashboard on a monitor at a job site",
    width: 1024,
    height: 445,
    // A banner with its headline baked into the picture, so the frame must not crop it.
    showWhole: true,
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
    heading: "Software that supports our detailing work",
    intro: [
      "Kings Rebar’s team uses AutoCAD and RebarCAD as part of its rebar detailing workflow. These tools support the preparation of project detailing information based on the drawings, specifications and requirements provided for each project.",
    ],
    tools: [
      {
        title: "AutoCAD",
        description:
          "AutoCAD is part of our drafting workflow for working with project drawings and preparing detailing information.",
      },
      {
        title: "RebarCAD",
        description:
          "RebarCAD is used as part of our rebar detailing work to prepare reinforcement details around project requirements.",
      },
    ] satisfies ListItem[],
    closing: [
      "Our team uses these tools in support of its detailing and estimation services. The software used for a project depends on its scope and requirements.",
    ],
  },
  cta: {
    heading: "Have a project to discuss?",
    body: "Send Kings Rebar an enquiry with a brief description of your project and the support you are looking for.",
    label: "Make an enquiry",
    href: routes.contact,
  },
} as const;
