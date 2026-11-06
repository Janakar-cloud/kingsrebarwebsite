import assert from "node:assert/strict";
import { describe, it } from "node:test";

// Environment is read when the module graph loads, so set it up first.
delete process.env.SITE_URL;

const { pageMetadata } = await import("@/lib/seo");
const { site } = await import("@/content/site");
const { routes } = await import("@/content/routes");

const meta = { title: "About", description: "About Kings Rebar." };

describe("pageMetadata", () => {
  it("suffixes the site title by default", () => {
    const result = pageMetadata(meta, routes.about);
    assert.equal(result.title, "About");
    assert.equal(result.openGraph?.title, `About | ${site.siteTitle}`);
    assert.equal(result.twitter?.title, `About | ${site.siteTitle}`);
  });

  it("uses the title verbatim when asked for an absolute title", () => {
    const result = pageMetadata({ ...meta, title: site.siteTitle }, routes.home, { absoluteTitle: true });
    assert.deepEqual(result.title, { absolute: site.siteTitle });
    assert.equal(result.openGraph?.title, site.siteTitle);
  });

  it("restates the description and shared social image", () => {
    const result = pageMetadata(meta, routes.about);
    assert.equal(result.description, meta.description);
    assert.equal(result.openGraph?.description, meta.description);
    assert.deepEqual(result.twitter?.images, [site.assets.socialImage.src]);
  });

  it("omits canonical and Open Graph URLs while SITE_URL is unset", () => {
    const result = pageMetadata(meta, routes.about);
    assert.equal(result.alternates, undefined);
    assert.equal(result.openGraph?.url, undefined);
  });
});
