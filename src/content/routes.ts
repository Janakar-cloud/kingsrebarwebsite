/** Every public route. Import from here instead of writing paths inline. */
export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  applications: "/applications",
  careers: "/careers",
  contact: "/contact",
} as const;

export type Route = (typeof routes)[keyof typeof routes];

export type NavItem = {
  href: Route;
  label: string;
  /** Neutral one-line description used on the Home page index. */
  description: string;
};

/** Primary navigation, in display order. Also drives the footer, sitemap and Home index. */
export const navigation: readonly NavItem[] = [
  { href: routes.home, label: "Home", description: "Rebar detailing and estimation for construction projects." },
  { href: routes.about, label: "About", description: "Company background, team, and office locations." },
  { href: routes.services, label: "Services", description: "Rebar detailing and estimation." },
  { href: routes.applications, label: "Industries", description: "Project markets currently listed by Kings Rebar." },
  { href: routes.careers, label: "Careers", description: "Ask about opportunities at Kings Rebar." },
  { href: routes.contact, label: "Contact", description: "Send a project or career enquiry." },
];

export function isActiveRoute(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
