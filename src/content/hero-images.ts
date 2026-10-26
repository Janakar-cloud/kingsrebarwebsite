import { applications } from "./pages/applications";
import { about } from "./pages/about";
import { careers } from "./pages/careers";
import { services } from "./pages/services";
import { routes, type Route } from "./routes";
import type { ImageAsset } from "./types";

/** Hero photographs/textures keyed by route. Contact has none, so it keeps the motif. */
export const pageHeroImages: Partial<Record<Route, ImageAsset>> = {
  [routes.about]: about.heroImage,
  [routes.services]: services.heroImage,
  [routes.applications]: applications.heroImage,
  [routes.careers]: careers.heroImage,
};
