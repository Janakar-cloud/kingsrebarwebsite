import { routes } from "../routes";

/** Enquiry call to action repeated at the foot of content pages. */
export const enquiryCta = {
  eyebrow: "Enquiries",
  heading: "Tell us about your project",
  body: "Share your project requirements with Kings Rebar. The team can review your enquiry and confirm whether its detailing or estimation services are a fit.",
  label: "Make an enquiry",
  href: routes.contact,
} as const;

export const notFound = {
  title: "Page not found",
  body: "The page you are looking for does not exist or may have moved.",
} as const;
