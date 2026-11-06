import { applications } from "./pages/applications";
import { about } from "./pages/about";
import { careers } from "./pages/careers";
import { contact } from "./pages/contact";
import { services } from "./pages/services";
import { routes, type Route } from "./routes";
import type { ImageAsset } from "./types";

/** Hero photographs keyed by route. */
export const pageHeroImages: Partial<Record<Route, ImageAsset>> = {
  [routes.about]: about.heroImage,
  [routes.services]: services.heroImage,
  [routes.applications]: applications.heroImage,
  [routes.careers]: careers.heroImage,
  [routes.contact]: contact.heroImage,
};
