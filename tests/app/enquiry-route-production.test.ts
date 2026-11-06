import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

const mutableEnv = process.env as Record<string, string | undefined>;
mutableEnv.NODE_ENV = "production";

const { POST } = await import("@/app/api/enquiry/route");
const { isApproved } = await import("@/content/types");
const { site } = await import("@/content/site");
const { emptyEnquiry } = await import("@/features/enquiry/validation");

const host = "www.example.test";

const valid = {
  ...emptyEnquiry,
  name: "Test Person",
  email: "test@example.com",
  topic: site.enquiry.topics[0],
  message: "A message that is long enough to pass validation.",
};

function post(body: unknown) {
  return POST(
    new Request(`https://${host}/api/enquiry`, {
      method: "POST",
      headers: { "x-forwarded-host": host, origin: `https://${host}` },
      body: JSON.stringify(body),
    }),
  );
}

const realFetch = globalThis.fetch;
const realError = console.error;

afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
  delete mutableEnv.ENQUIRY_WEBHOOK_URL;
  delete mutableEnv.ENQUIRY_DEV_SIMULATE;
  delete mutableEnv.OUTLOOK_SMTP_PASSWORD;
  delete mutableEnv.OUTLOOK_TENANT_ID;
  delete mutableEnv.OUTLOOK_CLIENT_ID;
  delete mutableEnv.OUTLOOK_CLIENT_SECRET;
});

describe("POST /api/enquiry (production)", () => {
  it("still validates input before anything else", async () => {
    const response = await post({ ...valid, name: "" });
    assert.equal(response.status, 422);
  });

  it("refuses submissions while no delivery destination is configured", async () => {
    console.error = () => {};
    const response = await post(valid);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { status: "unavailable" });
  });

  it("ignores the development simulator", async () => {
    console.error = () => {};
    mutableEnv.ENQUIRY_DEV_SIMULATE = "success";
    const response = await post(valid);
    assert.equal(response.status, 503);
  });

  it("does not deliver until the privacy notice is approved", async () => {
    console.error = () => {};
    mutableEnv.ENQUIRY_WEBHOOK_URL = "https://hooks.example.com/abc";
    let delivered = false;
    globalThis.fetch = (async () => {
      delivered = true;
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const response = await post(valid);

    if (isApproved(site.enquiry.privacyNotice)) {
      assert.equal(response.status, 200);
      assert.equal(delivered, true);
    } else {
      assert.equal(response.status, 503);
      assert.equal(delivered, false);
    }
  });
});
