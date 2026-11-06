import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

type EnvModule = {
  siteUrl: URL | null;
  allowIndexing: boolean;
  showPlaceholders: boolean;
  isProduction: boolean;
};

const variables = ["SITE_URL", "VERCEL_URL", "ALLOW_INDEXING", "SHOW_CONTENT_PLACEHOLDERS", "NODE_ENV"] as const;
const mutableEnv = process.env as Record<string, string | undefined>;
const original = Object.fromEntries(variables.map((name) => [name, mutableEnv[name]]));
let counter = 0;

/** Loads a fresh copy of the module so each case sees its own environment. */
async function loadEnv(settings: Partial<Record<(typeof variables)[number], string>>): Promise<EnvModule> {
  for (const name of variables) delete mutableEnv[name];
  Object.assign(mutableEnv, settings);
  const specifier = `../../src/config/env.ts?case=${counter++}`;
  return (await import(specifier)) as EnvModule;
}

afterEach(() => {
  for (const name of variables) {
    if (original[name] === undefined) delete mutableEnv[name];
    else mutableEnv[name] = original[name];
  }
});

describe("siteUrl", () => {
  it("is null when SITE_URL is not set", async () => {
    assert.equal((await loadEnv({})).siteUrl, null);
  });

  it("parses an absolute URL", async () => {
    const { siteUrl } = await loadEnv({ SITE_URL: " https://www.example.com " });
    assert.equal(siteUrl?.origin, "https://www.example.com");
  });

  it("falls back to the Vercel deployment URL when SITE_URL is unset", async () => {
    const { siteUrl } = await loadEnv({ VERCEL_URL: "kings-rebar-uat.vercel.app" });
    assert.equal(siteUrl?.href, "https://kings-rebar-uat.vercel.app/");
  });

  it("throws a descriptive error for an invalid URL", async () => {
    await assert.rejects(loadEnv({ SITE_URL: "not a url" }), /SITE_URL must be an absolute URL/);
  });
});

describe("allowIndexing", () => {
  it("needs both a site URL and an explicit opt-in", async () => {
    assert.equal((await loadEnv({})).allowIndexing, false);
    assert.equal((await loadEnv({ ALLOW_INDEXING: "true" })).allowIndexing, false);
    assert.equal((await loadEnv({ SITE_URL: "https://www.example.com" })).allowIndexing, false);
    assert.equal(
      (await loadEnv({ SITE_URL: "https://www.example.com", ALLOW_INDEXING: "true" })).allowIndexing,
      true,
    );
  });
});

describe("showPlaceholders", () => {
  it("defaults to on outside production and off in production", async () => {
    assert.equal((await loadEnv({ NODE_ENV: "development" })).showPlaceholders, true);
    assert.equal((await loadEnv({ NODE_ENV: "production" })).showPlaceholders, false);
  });

  it("can be forced either way with SHOW_CONTENT_PLACEHOLDERS", async () => {
    assert.equal(
      (await loadEnv({ NODE_ENV: "production", SHOW_CONTENT_PLACEHOLDERS: "true" })).showPlaceholders,
      true,
    );
    assert.equal(
      (await loadEnv({ NODE_ENV: "development", SHOW_CONTENT_PLACEHOLDERS: "false" })).showPlaceholders,
      false,
    );
  });
});
