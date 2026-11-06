import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

const mutableEnv = process.env as Record<string, string | undefined>;
mutableEnv.NODE_ENV = "development";

const { POST } = await import("@/app/api/enquiry/route");
const { site } = await import("@/content/site");
const { emptyEnquiry, honeypotField } = await import("@/features/enquiry/validation");

const host = "www.example.test";

const valid = {
  ...emptyEnquiry,
  name: "Test Person",
  email: "test@example.com",
  topic: site.enquiry.topics[0],
  message: "A message that is long enough to pass validation.",
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new Request(`https://${host}/api/enquiry`, {
      method: "POST",
      headers: { "x-forwarded-host": host, origin: `https://${host}`, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

const realFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = realFetch;
  delete mutableEnv.ENQUIRY_WEBHOOK_URL;
  delete mutableEnv.ENQUIRY_DEV_SIMULATE;
  delete mutableEnv.OUTLOOK_SMTP_PASSWORD;
  delete mutableEnv.OUTLOOK_TENANT_ID;
  delete mutableEnv.OUTLOOK_CLIENT_ID;
  delete mutableEnv.OUTLOOK_CLIENT_SECRET;
});

describe("POST /api/enquiry (development)", () => {
  it("rejects cross-origin requests", async () => {
    const response = await post(valid, { origin: "https://evil.example" });
    assert.equal(response.status, 403);
  });

  it("accepts requests that carry no Origin header", async () => {
    const response = await post(valid, { origin: "" });
    assert.equal(response.status, 200);
  });

  it("rejects oversized bodies", async () => {
    const response = await post({ ...valid, message: "x".repeat(25_000) });
    assert.equal(response.status, 413);
  });

  it("rejects malformed JSON", async () => {
    const response = await post("{not json");
    assert.equal(response.status, 400);
  });

  it("rejects submissions that fill the honeypot field", async () => {
    const response = await post({ ...valid, [honeypotField]: "https://spam.example" });
    assert.equal(response.status, 400);
  });

  it("returns field errors for invalid input", async () => {
    const response = await post({ ...valid, email: "nope", message: "short" });
    assert.equal(response.status, 422);
    const body = await response.json();
    assert.equal(body.status, "invalid");
    assert.deepEqual(Object.keys(body.errors).sort(), ["email", "message"]);
  });

  it("never caches responses", async () => {
    const response = await post(valid);
    assert.equal(response.headers.get("cache-control"), "no-store");
  });

  it("reports not-sent-development when no destination is configured", async () => {
    const response = await post(valid);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "not-sent-development" });
  });

  it("simulates success and failure on request", async () => {
    mutableEnv.ENQUIRY_DEV_SIMULATE = "success";
    const success = await post(valid);
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { status: "sent", simulated: true });

    mutableEnv.ENQUIRY_DEV_SIMULATE = "failure";
    const failure = await post(valid);
    assert.equal(failure.status, 502);
    assert.deepEqual(await failure.json(), { status: "failed" });
  });

  it("delivers to the configured webhook and reports the outcome", async () => {
    mutableEnv.ENQUIRY_WEBHOOK_URL = "https://hooks.example.com/abc";
    const originalError = console.error;
    console.error = () => {};

    try {
      globalThis.fetch = (async () => new Response(null, { status: 200 })) as typeof fetch;
      const sent = await post(valid);
      assert.equal(sent.status, 200);
      assert.deepEqual(await sent.json(), { status: "sent" });

      globalThis.fetch = (async () => new Response(null, { status: 500 })) as typeof fetch;
      const failed = await post(valid);
      assert.equal(failed.status, 502);
      assert.deepEqual(await failed.json(), { status: "failed" });
    } finally {
      console.error = originalError;
    }
  });
});
