import assert from "node:assert/strict";
import { describe, it } from "node:test";

process.env.SITE_URL = "https://www.example.com";

const { pageMetadata } = await import("@/lib/seo");
const { routes } = await import("@/content/routes");

describe("pageMetadata with SITE_URL set", () => {
  it("emits a canonical path and Open Graph URL", () => {
    const result = pageMetadata({ title: "Services", description: "Services." }, routes.services);
    assert.deepEqual(result.alternates, { canonical: routes.services });
    assert.equal(result.openGraph?.url, routes.services);
  });
});
