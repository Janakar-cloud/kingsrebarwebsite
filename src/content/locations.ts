/**
 * Shared operating locations. Used on About, Careers and Contact so a later
 * address or branch change only needs to happen here.
 */
import type { ImageAsset, PostalAddress } from "./types";

export const headquarters = {
  title: "Aruppukottai",
  description: "Head office",
  address: {
    lines: [
      "Kings Rebar Private Limited",
      "5-27-27/2, Theerthakarai Nagar",
      "Aruppukottai, Tamil Nadu 626101",
      "India",
    ],
    streetAddress: "5-27-27/2, Theerthakarai Nagar",
    addressLocality: "Aruppukottai",
    addressRegion: "Tamil Nadu",
    postalCode: "626101",
    addressCountry: "IN",
  } satisfies PostalAddress,
} as const;

export const salemBranch = {
  title: "Salem",
  description: "Branch office",
  address: {
    lines: [
      "Kings Rebar Private Limited",
      "Kurangusavadi, near MSS Parcel Service",
      "Suramangalam, Salem 636004",
      "India",
    ],
    streetAddress: "Kurangusavadi, near MSS Parcel Service, Suramangalam",
    addressLocality: "Salem",
    addressRegion: "Tamil Nadu",
    postalCode: "636004",
    addressCountry: "IN",
  } satisfies PostalAddress,
} as const;

export const branches = [
  headquarters,
  salemBranch,
  { title: "Karur", description: "Branch office" },
  { title: "Cheyyar", description: "Branch office" },
  { title: "Coimbatore", description: "Branch office" },
] as const;

/**
 * Client-supplied map of the Tamil Nadu offices, shared by Home and About.
 * The source file (KR_location.png) had a checkerboard baked into its pixels;
 * this copy has the grid removed so it sits on a transparent background.
 */
export const locationsMap = {
  src: "/images/tamil-nadu-offices-map.png",
  alt: "Map of Tamil Nadu showing Kings Rebar offices in Aruppukottai, Salem, Karur, Cheyyar, and Coimbatore",
  width: 875,
  height: 710,
} satisfies ImageAsset;

export const markets = {
  heading: "Project markets",
  intro: "Kings Rebar works with clients in the United States and the United Kingdom.",
  items: [
    {
      title: "United States",
      description:
        "Kings Rebar provides rebar detailing and estimation for construction projects in the United States. Contact the team to discuss project drawings, specifications, and required deliverables.",
      flag: "US" as const,
    },
    {
      title: "United Kingdom",
      description:
        "Kings Rebar provides rebar detailing and estimation for construction projects in the United Kingdom. Contact the team to discuss project drawings, specifications, and required deliverables.",
      flag: "GB" as const,
    },
  ],
} as const;
