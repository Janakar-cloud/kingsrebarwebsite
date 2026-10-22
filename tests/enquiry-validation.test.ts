import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  emptyEnquiry,
  normaliseEnquiry,
  validateEnquiry,
  validateField,
} from "../src/lib/enquiry/validation.ts";

const topics = ["General enquiry", "Other"];

const valid = {
  ...emptyEnquiry,
  name: "Test Person",
  email: "test@example.com",
  topic: "General enquiry",
  message: "This is a test enquiry message.",
};

describe("validateEnquiry", () => {
  it("accepts a complete enquiry with optional fields empty", () => {
    assert.deepEqual(validateEnquiry(valid, topics), {});
  });

  it("requires name, email, topic and message", () => {
    const errors = validateEnquiry(emptyEnquiry, topics);
    assert.deepEqual(Object.keys(errors).sort(), ["email", "message", "name", "topic"]);
  });

  it("rejects malformed email addresses", () => {
    assert.ok(validateField("email", "not-an-email", topics));
    assert.ok(validateField("email", "a@b", topics));
    assert.equal(validateField("email", "a@b.co", topics), undefined);
  });

  it("only accepts configured topics", () => {
    assert.ok(validateField("topic", "Something else", topics));
    assert.equal(validateField("topic", "Other", topics), undefined);
  });

  it("validates optional phone numbers only when provided", () => {
    assert.equal(validateField("phone", "", topics), undefined);
    assert.equal(validateField("phone", "+1 (555) 010-0000", topics), undefined);
    assert.ok(validateField("phone", "call me", topics));
  });

  it("enforces message length limits", () => {
    assert.ok(validateField("message", "short", topics));
    assert.ok(validateField("message", "x".repeat(5001), topics));
  });
});

describe("normaliseEnquiry", () => {
  it("trims strings and drops unknown or non-string values", () => {
    const result = normaliseEnquiry({ name: "  Test  ", email: 42, extra: "ignored" });
    assert.equal(result.name, "Test");
    assert.equal(result.email, "");
    assert.equal("extra" in result, false);
  });

  it("handles non-object input", () => {
    assert.deepEqual(normaliseEnquiry(null), emptyEnquiry);
  });
});
