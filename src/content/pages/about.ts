import { branches, locationsMap } from "../locations";
import { routes } from "../routes";
import type { ImageAsset, ListItem, PageMeta } from "../types";

export const about = {
  meta: {
    title: "About Kings Rebar | Rebar Detailing Company",
    description:
      "Learn about Kings Rebar, its rebar detailing and estimation work, company background, team, and office locations.",
  } satisfies PageMeta,
  title: "About Kings Rebar",
  intro:
    "Kings Rebar is a rebar detailing and estimation company established in 2015. The company was founded by K. Vigneshwaran and Bala Vigneshwaran and is headquartered in Aruppukottai, Tamil Nadu.",
  summary:
    "Kings Rebar is a rebar detailing and estimation company established in 2015. The company was founded by K. Vigneshwaran and Bala Vigneshwaran and is headquartered in Aruppukottai, Tamil Nadu.",
  heroImage: {
    src: "/images/founder-ceo.jpg",
    alt: "K. Vigneshwaran, founder of Kings Rebar",
    width: 1086,
    height: 1448,
    objectPosition: "50% 10%",
  } satisfies ImageAsset,
  history: {
    heading: "Our story",
    paragraphs: [
      "Kings Rebar supports construction projects with reinforcement shop drawings and quantity take-offs. The team works from project drawings and specifications supplied by the client.",
      "The company’s work focuses on making project information clear and useful for the teams responsible for planning and coordinating reinforcement work.",
      "Kings Rebar began in Aruppukottai and has grown to include offices in Salem, Karur, Cheyyar, and Coimbatore. Its work includes rebar detailing and estimation for clients in the United States and the United Kingdom.",
    ],
  },
  founder: {
    name: "K. Vigneshwaran",
    role: "Founder",
    image: {
      src: "/images/founder-ceo.jpg",
      alt: "Portrait of K. Vigneshwaran, founder of Kings Rebar",
      width: 1086,
      height: 1448,
    } satisfies ImageAsset,
  },
  locations: {
    heading: "Where we work",
    map: locationsMap,
    intro:
      "Kings Rebar has its head office in Aruppukottai and branch offices in Salem, Karur, Cheyyar, and Coimbatore, Tamil Nadu.",
    items: [...branches] satisfies ListItem[],
  },
  cta: {
    heading: "Start a conversation",
    body: "Contact Kings Rebar to discuss a project enquiry or ask about career opportunities.",
    label: "Contact Kings Rebar",
    href: routes.contact,
  },
} as const;
