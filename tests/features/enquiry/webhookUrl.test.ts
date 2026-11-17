import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sanitizeWebhookUrl } from "@/features/enquiry/webhookUrl";

describe("sanitizeWebhookUrl", () => {
  it("accepts public HTTPS URLs", () => {
    assert.equal(sanitizeWebhookUrl(" https://hooks.example.com/abc "), "https://hooks.example.com/abc");
  });

  it("rejects missing, cleartext, credentialed, and private targets", () => {
    assert.equal(sanitizeWebhookUrl(undefined), null);
    assert.equal(sanitizeWebhookUrl(""), null);
    assert.equal(sanitizeWebhookUrl("http://hooks.example.com/abc"), null);
    assert.equal(sanitizeWebhookUrl("https://user:pass@hooks.example.com/abc"), null);
    assert.equal(sanitizeWebhookUrl("https://localhost/hooks"), null);
    assert.equal(sanitizeWebhookUrl("https://127.0.0.1/hooks"), null);
    assert.equal(sanitizeWebhookUrl("https://10.0.0.8/hooks"), null);
    assert.equal(sanitizeWebhookUrl("https://192.168.1.10/hooks"), null);
    assert.equal(sanitizeWebhookUrl("https://169.254.169.254/latest"), null);
    assert.equal(sanitizeWebhookUrl("https://meta.local/hooks"), null);
  });
});
