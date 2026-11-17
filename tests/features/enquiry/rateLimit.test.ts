import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { clientIp, consumeRateLimit, resetRateLimit } from "@/features/enquiry/rateLimit";

const mutableEnv = process.env as Record<string, string | undefined>;

afterEach(() => {
  resetRateLimit();
  delete mutableEnv.ENQUIRY_RATE_LIMIT;
  delete mutableEnv.ENQUIRY_RATE_WINDOW_MS;
});

describe("consumeRateLimit", () => {
  it("allows traffic until the configured limit, then blocks", () => {
    mutableEnv.ENQUIRY_RATE_LIMIT = "2";
    mutableEnv.ENQUIRY_RATE_WINDOW_MS = "60000";

    assert.equal(consumeRateLimit("1.1.1.1").ok, true);
    assert.equal(consumeRateLimit("1.1.1.1").ok, true);

    const blocked = consumeRateLimit("1.1.1.1");
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.ok(blocked.retryAfterSec > 0);

    assert.equal(consumeRateLimit("2.2.2.2").ok, true);
  });
});

describe("clientIp", () => {
  it("prefers the first x-forwarded-for address", () => {
    const request = new Request("https://www.example.test/api/enquiry", {
      headers: {
        "x-forwarded-for": "203.0.113.10, 10.0.0.1",
        "x-real-ip": "198.51.100.20",
      },
    });
    assert.equal(clientIp(request), "203.0.113.10");
  });
});
