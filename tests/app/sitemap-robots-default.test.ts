import assert from "node:assert/strict";
import { describe, it } from "node:test";

// No SITE_URL and no indexing opt-in: a preview deployment must stay out of search.
delete (process.env as Record<string, string | undefined>).SITE_URL;
delete (process.env as Record<string, string | undefined>).ALLOW_INDEXING;

const { default: robots } = await import("@/app/robots");
const { default: sitemap } = await import("@/app/sitemap");

describe("preview deployment (no SITE_URL)", () => {
  it("robots.txt disallows everything and advertises no sitemap", () => {
    const result = robots();
    assert.deepEqual(result.rules, { userAgent: "*", disallow: "/" });
    assert.equal(result.sitemap, undefined);
  });

  it("the sitemap is empty because there are no absolute URLs to publish", () => {
    assert.deepEqual(sitemap(), []);
  });
});
