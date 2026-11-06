import assert from "node:assert/strict";
import { describe, it } from "node:test";

// A production URL alone is not enough: indexing needs an explicit opt-in.
const env = process.env as Record<string, string | undefined>;
env.SITE_URL = "https://www.example.com";
delete env.ALLOW_INDEXING;

const { default: robots } = await import("@/app/robots");

describe("production URL without ALLOW_INDEXING", () => {
  it("still blocks crawlers", () => {
    assert.deepEqual(robots().rules, { userAgent: "*", disallow: "/" });
  });
});
