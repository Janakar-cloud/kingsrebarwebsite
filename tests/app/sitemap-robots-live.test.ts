import assert from "node:assert/strict";
import { describe, it } from "node:test";

const env = process.env as Record<string, string | undefined>;
env.SITE_URL = "https://www.example.com";
env.ALLOW_INDEXING = "true";

const { default: robots } = await import("@/app/robots");
const { default: sitemap } = await import("@/app/sitemap");
const { navigation, routes } = await import("@/content/routes");

describe("live site (SITE_URL and ALLOW_INDEXING set)", () => {
  it("robots.txt allows crawling, keeps crawlers out of the API and links the sitemap", () => {
    const result = robots();
    assert.deepEqual(result.rules, { userAgent: "*", allow: "/", disallow: "/api/" });
    assert.equal(result.sitemap, "https://www.example.com/sitemap.xml");
    assert.equal(result.host, "https://www.example.com");
  });

  it("the sitemap lists every page once, as an absolute URL", () => {
    const entries = sitemap();
    assert.equal(entries.length, navigation.length);
    assert.deepEqual(
      entries.map((entry) => entry.url).sort(),
      navigation.map((item) => new URL(item.href, "https://www.example.com").href).sort(),
    );
    assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);
  });

  it("gives the home page the highest priority", () => {
    const entries = sitemap();
    const home = entries.find((entry) => entry.url === new URL(routes.home, "https://www.example.com").href);
    assert.equal(home?.priority, 1);
    for (const entry of entries.filter((item) => item !== home)) assert.ok((entry.priority ?? 0) < 1);
  });

  it("never lists API routes or error pages", () => {
    for (const entry of sitemap()) {
      assert.doesNotMatch(entry.url, /\/api\/|404|error/);
    }
  });
});
