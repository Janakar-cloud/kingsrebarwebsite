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
    src: "/images/founder-vigneshwaran.jpg",
    alt: "K. Vigneshwaran, founder of Kings Rebar",
    width: 768,
    height: 1344,
    objectPosition: "50% 12%",
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
  people: {
    heading: "The team",
    members: [
      {
        name: "K. Mukunthan",
        role: "Estimation Head",
        experience: "12 years 8 months",
        image: {
          src: "/images/team/mukunthan.jpg",
          alt: "Portrait of K. Mukunthan, estimation head at Kings Rebar",
          width: 1064,
          height: 1280,
        } satisfies ImageAsset,
      },
      {
        name: "M. Sarathkumar",
        role: "Project Coordinator",
        group: "Panel Team",
        experience: "11 years 5 months",
        image: {
          src: "/images/team/sarathkumar.jpg",
          alt: "Portrait of M. Sarathkumar, project coordinator for the panel team at Kings Rebar",
          width: 637,
          height: 982,
        } satisfies ImageAsset,
      },
      {
        name: "Thangaraj K",
        role: "Project Coordinator",
        group: "CMU Team",
        experience: "10 years 6 months",
        image: {
          src: "/images/team/thangaraj.jpg",
          alt: "Portrait of Thangaraj K, project coordinator for the CMU team at Kings Rebar",
          width: 942,
          height: 1280,
        } satisfies ImageAsset,
      },
      {
        name: "Suriyakumar D.",
        role: "Project Coordinator",
        group: "Concrete Team",
        experience: "10 years 6 months",
        image: {
          src: "/images/team/suriyakumar.jpg",
          alt: "Portrait of Suriyakumar D., project coordinator for the concrete team at Kings Rebar",
          width: 1040,
          height: 1280,
        } satisfies ImageAsset,
      },
      {
        name: "M. Santhosh",
        role: "Project Coordinator",
        group: "Foundation Team",
        experience: "12 years 5 months",
        image: {
          src: "/images/team/santhosh.jpg",
          alt: "Portrait of M. Santhosh, project coordinator for the foundation team at Kings Rebar",
          width: 1006,
          height: 1280,
        } satisfies ImageAsset,
      },
    ],
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
