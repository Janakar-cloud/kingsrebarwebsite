import {
  pending,
  type Approved,
  type ImageAsset,
  type ListSection,
  type TextSection,
} from "./types";

/**
 * Page copy for every route. Headings and links below are neutral structural
 * text; everything describing the company is pending until the client
 * supplies approved wording. See CONTENT_CHECKLIST.md.
 */

export type PageMeta = { title: string; description: string };

export type Product = {
  name: string;
  summary: string;
  /** Optional specification rows, e.g. { label: "Standard", value: "..." }. Only verified values. */
  details?: { label: string; value: string }[];
  /** 1200×900 (4:3) WebP or JPG of the actual product. */
  image?: ImageAsset;
};

export type Application = {
  title: string;
  description: string;
};

export type Certification = {
  name: string;
  issuer: string;
  scope?: string;
  /** Date the client's certificate was checked (YYYY-MM-DD). Not displayed; required as a launch safeguard. */
  verifiedOn: string;
};

export const home = {
  meta: {
    title: "Kings Rebar",
    description: "Kings Rebar company website. Find out about the company and send an enquiry.",
  } satisfies PageMeta,
  hero: {
    eyebrow: pending("Optional short line above the main heading") as Approved<string>,
    intro: pending("Add an approved introduction to Kings Rebar here.") as Approved<string>,
    /** 1600×1000 WebP or JPG. Must show real, approved Kings Rebar imagery. */
    image: pending("Optional approved hero image, 1600×1000") as Approved<ImageAsset>,
    primaryCta: { label: "Make an enquiry", href: "/contact" },
    secondaryCta: { label: "About Kings Rebar", href: "/about" },
  },
  overview: {
    heading: "Company overview",
    paragraphs: pending(
      "Add an approved overview of Kings Rebar: what the company does and who it works with.",
    ),
  } satisfies TextSection,
  explore: {
    heading: "Explore the site",
    links: [
      { href: "/about", title: "About", description: "Find out more about Kings Rebar." },
      { href: "/products", title: "Products", description: "See product information." },
      { href: "/applications", title: "Applications", description: "See uses and industries." },
      {
        href: "/quality-and-responsibility",
        title: "Quality & Responsibility",
        description: "Read about quality, safety and environmental practices.",
      },
    ],
  },
} as const;

export const about = {
  meta: {
    title: "About",
    description: "About Kings Rebar.",
  } satisfies PageMeta,
  intro: pending("Approved one or two sentence introduction for the About page") as Approved<string>,
  overview: {
    heading: "Company overview",
    paragraphs: pending("Approved company overview"),
  } satisfies TextSection,
  history: {
    heading: "History",
    paragraphs: pending("Approved company history, including any dates or milestones"),
  } satisfies TextSection,
  values: {
    heading: "Our values",
    items: pending("Approved company values, each with a short description"),
  } satisfies ListSection,
  locations: {
    heading: "Where we operate",
    intro: pending("Approved description of operating locations or service areas"),
    items: pending("Approved list of sites, offices or regions served"),
  } satisfies ListSection,
  /** Shown in production when none of the sections above has approved content. */
  emptyFallback: "For information about Kings Rebar, please get in touch.",
} as const;

export const products = {
  meta: {
    title: "Products",
    description: "Product information from Kings Rebar.",
  } satisfies PageMeta,
  intro: pending("Approved introduction to the product range") as Approved<string>,
  /**
   * Add confirmed products only. Do not add grades, sizes, standards or stock
   * information unless the client has verified them.
   */
  items: [] as Product[],
  itemsPendingNote:
    "Approved product list: names, short descriptions and any verified specifications",
  emptyFallback: "For product information, please contact Kings Rebar.",
  enquiryPrompt: "Ask about a product",
} as const;

export const applications = {
  meta: {
    title: "Applications",
    description: "Applications and industries for Kings Rebar.",
  } satisfies PageMeta,
  intro: pending("Approved introduction to the uses or industries served") as Approved<string>,
  /** General use cases or industries only. Do not name projects or clients unless approved. */
  items: [] as Application[],
  itemsPendingNote: "Approved list of use cases or industries, each with a short description",
  emptyFallback:
    "To discuss your application or project requirements, please contact Kings Rebar.",
} as const;

export const quality = {
  meta: {
    title: "Quality & Responsibility",
    description: "Quality, safety and environmental information from Kings Rebar.",
  } satisfies PageMeta,
  intro: pending("Approved introduction to the company's approach to quality") as Approved<string>,
  sections: [
    {
      heading: "Quality practices",
      paragraphs: pending("Approved description of quality control or inspection practices"),
    },
    {
      heading: "Health and safety",
      paragraphs: pending("Approved description of health and safety practices"),
    },
    {
      heading: "Environmental responsibility",
      paragraphs: pending("Approved description of environmental practices or commitments"),
    },
  ] satisfies TextSection[],
  certifications: {
    heading: "Standards and certifications",
    /** Only list certifications the client has documented evidence for. */
    items: [] as Certification[],
    pendingNote:
      "Verified standards and certifications. Check certificate copies and expiry dates before adding",
  },
  emptyFallback: "For information about quality or compliance, please contact Kings Rebar.",
} as const;

export const contact = {
  meta: {
    title: "Contact",
    description: "Contact Kings Rebar and send an enquiry.",
  } satisfies PageMeta,
  intro: "Use the form to send an enquiry to Kings Rebar.",
  formHeading: "Send an enquiry",
  detailsHeading: "Contact details",
  /** Shown in production builds until the enquiry privacy notice is approved. */
  formUnavailable: "Online enquiries are not available yet.",
} as const;
