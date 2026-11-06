import assert from "node:assert/strict";
import { describe, it } from "node:test";

const mutableEnv = process.env as Record<string, string | undefined>;
mutableEnv.NODE_ENV = "production";

const { default: config } = await import("../../next.config.ts");

const rules = (await config.headers?.()) ?? [];
const headers = new Map((rules[0]?.headers ?? []).map(({ key, value }) => [key, value]));

describe("next.config", () => {
  it("applies one header rule to every path", () => {
    assert.equal(rules.length, 1);
    assert.equal(rules[0]?.source, "/:path*");
  });

  it("sends the standard hardening headers", () => {
    assert.equal(headers.get("X-Content-Type-Options"), "nosniff");
    assert.equal(headers.get("X-Frame-Options"), "DENY");
    assert.equal(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin");
    assert.match(headers.get("Strict-Transport-Security") ?? "", /^max-age=\d+/);
    assert.match(headers.get("Permissions-Policy") ?? "", /camera=\(\)/);
  });

  it("locks the Content Security Policy to this origin", () => {
    const csp = headers.get("Content-Security-Policy") ?? "";
    assert.match(csp, /default-src 'self'/);
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /object-src 'none'/);
    assert.match(csp, /form-action 'self'/);
    assert.doesNotMatch(csp, /unsafe-eval/);
    assert.doesNotMatch(csp, /https?:\/\//, "no third-party origin is allowed until analytics is configured");
  });

  it("does not advertise the framework", () => {
    assert.equal(config.poweredByHeader, false);
  });

  it("keeps the legacy redirects permanent", async () => {
    const redirects = (await config.redirects?.()) ?? [];
    assert.ok(redirects.length > 0);
    for (const redirect of redirects) assert.equal(redirect.permanent, true);
  });
});
