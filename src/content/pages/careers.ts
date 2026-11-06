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
  heroImage: {
    src: "/images/kr-careers.jpg",
    alt: "A person annotating a reinforcement drawing beside a tablet showing a structural model",
    width: 999,
    height: 768,
    objectPosition: "48% 58%",
  } satisfies ImageAsset,
  learn: {
    heading: "Learn through practical experience",
    paragraphs: [
      "Build your technical knowledge through training, guidance and practical project experience. Early-career professionals can develop their understanding of rebar detailing and estimation by engaging with project information, drawings, specifications and requirements.",
      "Learning grows through practice: applying technical knowledge, asking questions and becoming familiar with the work involved in supporting a project. The experience will vary by role and project, with guidance available as you develop.",
    ],
    closing: "Build your knowledge. Learn through the work. Keep growing.",
    backdrop: {
      src: "/images/careers-development.jpg",
      alt: "",
      width: 1408,
      height: 768,
      objectPosition: "50% 50%",
    } satisfies ImageAsset,
  },
  team: {
    heading: "Grow with experienced colleagues",
    paragraphs: [
      "Good work depends on people sharing knowledge and working together. At Kings Rebar, collaboration and ongoing guidance are part of how the team develops its people.",
      "Working alongside experienced colleagues can help you understand project requirements, learn from different perspectives and contribute to shared work. Bring your questions, build your skills and grow through the experience of working as part of a team.",
    ],
    backdrop: {
      src: "/images/careers-team.jpg",
      alt: "",
      width: 1408,
      height: 768,
      objectPosition: "50% 50%",
    } satisfies ImageAsset,
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
