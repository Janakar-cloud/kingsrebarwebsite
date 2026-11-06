import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { pageHeroImages } from "@/content/hero-images";
import { branches, headquarters, markets, salemBranch } from "@/content/locations";
import { about } from "@/content/pages/about";
import { applications } from "@/content/pages/applications";
import { careers } from "@/content/pages/careers";
import { contact } from "@/content/pages/contact";
import { home } from "@/content/pages/home";
import { services } from "@/content/pages/services";
import { routes } from "@/content/routes";
import { site } from "@/content/site";
import type { ImageAsset } from "@/content/types";

const publicDir = path.resolve(import.meta.dirname, "../../public");

/** Routes that are generated rather than served from /public. */
const generatedImages = new Set(["/opengraph-image"]);

/** Finds every image reference in a content tree, however deeply nested. */
function collectImages(value: unknown, trail = "content", found: [string, ImageAsset][] = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectImages(item, `${trail}[${index}]`, found));
  } else if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && "width" in record && "height" in record) {
      found.push([trail, record as unknown as ImageAsset]);
    }
    for (const [key, child] of Object.entries(record)) collectImages(child, `${trail}.${key}`, found);
  }
  return found;
}

const pages = { home, about, services, applications, careers, contact };
const images = collectImages({ site, ...pages });

describe("images", () => {
  it("are found in the content tree", () => {
    assert.ok(images.length >= 10, `expected a populated image set, found ${images.length}`);
  });

  for (const [trail, image] of images) {
    it(`${trail} (${image.src}) is a valid asset`, () => {
      assert.ok(image.src.startsWith("/"), "src must be root-relative");
      assert.ok(image.width > 0 && image.height > 0, "dimensions must be positive");
      assert.equal(typeof image.alt, "string");
      if (!generatedImages.has(image.src)) {
        assert.ok(existsSync(path.join(publicDir, image.src)), `missing file public${image.src}`);
      }
    });
  }
});

describe("page metadata", () => {
  for (const [name, page] of Object.entries(pages)) {
    it(`${name} has a usable title and description`, () => {
      const { title, description } = page.meta;
      assert.ok(title.trim().length > 0 && title.length <= 70, `title length ${title.length}`);
      assert.ok(description.length >= 50 && description.length <= 200, `description length ${description.length}`);
    });
  }

  it("uses a distinct title for every page", () => {
    const titles = Object.values(pages).map((page) => page.meta.title);
    assert.equal(new Set(titles).size, titles.length);
  });
});

describe("page hero images", () => {
  it("cover every inner page and no unknown route", () => {
    const keys = Object.keys(pageHeroImages).sort();
    const known = Object.values(routes);
    for (const key of keys) assert.ok((known as string[]).includes(key), `${key} is not a route`);
    for (const route of [routes.about, routes.services, routes.applications, routes.careers, routes.contact]) {
      assert.ok(pageHeroImages[route], `${route} needs a hero image`);
    }
  });

  it("describe each image with alt text", () => {
    for (const [route, image] of Object.entries(pageHeroImages)) {
      assert.ok(image.alt.trim().length > 0, `${route} hero needs alt text`);
    }
  });
});

describe("home page", () => {
  it("describes the process as six ordered steps with images", () => {
    const steps = home.process.steps;
    assert.equal(steps.length, 6);
    for (const step of steps) {
      assert.ok(step.title.trim() && step.detail.trim(), "step needs title and detail");
      assert.ok(step.image.src.startsWith("/images/"));
    }
  });
});

describe("locations", () => {
  it("names every branch uniquely", () => {
    const titles = branches.map((branch) => branch.title);
    assert.equal(new Set(titles).size, titles.length);
    for (const branch of branches) assert.ok(branch.title.trim() && branch.description.trim());
  });

  it("gives each full address displayable lines and structured fields", () => {
    for (const office of [headquarters, salemBranch]) {
      assert.ok(office.address.lines.length >= 3, `${office.title} address is too short`);
      assert.match(office.address.postalCode, /^\d{6}$/);
      assert.equal(office.address.addressCountry, "IN");
    }
  });

  it("lists each client market with a flag", () => {
    assert.ok(markets.items.length > 0);
    for (const market of markets.items) assert.ok(market.title && market.description && market.flag);
  });
});

describe("site configuration", () => {
  it("offers enquiry topics and form messages", () => {
    assert.ok(site.enquiry.topics.length > 0);
    assert.equal(new Set(site.enquiry.topics).size, site.enquiry.topics.length);
    assert.ok(site.enquiry.successHeading && site.enquiry.failureMessage);
  });

  it("publishes an absolute website URL", () => {
    assert.doesNotThrow(() => new URL(site.contact.website));
  });

  it("lists social profiles as absolute https URLs", () => {
    for (const profile of site.social) {
      assert.equal(new URL(profile.url).protocol, "https:");
      assert.ok(profile.label.trim().length > 0);
    }
  });
});
