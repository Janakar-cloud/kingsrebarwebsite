import { headquarters } from "./locations";
import { pending, type ImageAsset } from "./types";

/**
 * Site-wide configuration and company details.
 *
 * Values wrapped in `pending(...)` are missing and stay hidden in production.
 * See docs/CONTENT_CHECKLIST.md. Page copy lives in ./pages/.
 */
export const site = {
  /** Confirmed trading name, used in the wordmark and page titles. */
  companyName: "Kings Rebar",

  /** Legal entity name, used in body copy and addresses. */
  legalName: "Kings Rebar Private Limited",

  /** Used as the default <title> and as the suffix on every page title. */
  siteTitle: "Kings Rebar",

  /** Default meta description. */
  siteDescription:
    "Kings Rebar provides rebar detailing and estimation support for construction projects, including reinforcement shop drawings and quantity take-offs.",

  language: "en-IN",

  /**
   * Image set approved 22 Oct 2026: client logo, lion mark, founder portrait,
   * and original SVG steel graphics. Do not add generated people, offices,
   * projects, products, or certificates. Optional extra photos belong here
   * only after the client supplies them.
   */
  assets: {
    /**
     * Approved logo. While pending, the header shows a typographic wordmark.
     * Recommended: SVG, or PNG at least 480px wide with a transparent background.
     */
    logo: {
      src: "/images/logo.png",
      alt: "Kings Rebar",
      width: 578,
      height: 342,
    } satisfies ImageAsset,
    /** Crowned lion, used as a decorative seal on the home hero. */
    mark: {
      src: "/images/mark.png",
      alt: "",
      width: 390,
      height: 390,
    } satisfies ImageAsset,
    /**
     * Social sharing (Open Graph) image, 1200×630. Generated from the approved
     * logo by src/app/opengraph-image.tsx.
     */
    socialImage: {
      src: "/opengraph-image",
      alt: "Kings Rebar, rebar detailing and estimation",
      width: 1200,
      height: 630,
    } as ImageAsset,
  },

  /** Public contact channels. Leave pending to hide them from the site. */
  contact: {
    email: "info@kingsrebar.com",
    phone: "+91 4562690053",
    address: headquarters.address,
    hours: ["Monday to Friday, 10:00 AM to 9:00 PM", "Saturday and Sunday, closed"],
    website: "https://www.kingsrebar.com",
    map: pending("Do not embed or link a map until the location pin and destination are verified."),
  },

  /** Only add profiles that the client has supplied and approved. */
  social: [
    {
      label: "LinkedIn Profile",
      url: "https://www.linkedin.com/company/kings-rebar-private-limited/posts/?feedView=all",
    },
  ] as { label: string; url: string }[],

  /**
   * Analytics loader. Leave null until the client approves an analytics
   * provider and any required consent or privacy wording.
   * Example (Plausible): { scriptSrc: "https://plausible.io/js/script.js", attributes: { "data-domain": "example.com" } }
   */
  analytics: null as null | { scriptSrc: string; attributes?: Record<string, string> },

  enquiry: {
    topics: ["Project enquiry", "Careers", "Other"],
    /**
     * Privacy notice shown above the submit button. The form is not shown in
     * production builds, and the server refuses submissions, until this is set.
     * This is the operational UAT wording (who receives the data and why). A
     * lawyer-reviewed policy can replace it before public launch.
     */
    privacyNotice:
      "Your enquiry is sent by email to info@kingsrebar.com so the Kings Rebar team can reply. We use the details you submit only to respond to this enquiry. To ask for your information to be deleted, email info@kingsrebar.com.",
    successHeading: "Thank you, your enquiry has been received",
    successMessage: "The team will review your enquiry and follow up if it can assist.",
    failureMessage: "Something went wrong. Your details are still in the form, so you can try again.",
  },
} as const;
