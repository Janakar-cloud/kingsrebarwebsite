import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isApproved, isPending, isProposed, pending, proposed, publishedOrPreview } from "@/content/types";

describe("pending and proposed content", () => {
  it("builds pending markers that carry their note", () => {
    assert.deepEqual(pending("Need copy"), { pending: "Need copy" });
    assert.deepEqual(proposed("Draft", "Needs approval"), { pending: "Needs approval", proposed: "Draft" });
  });

  it("distinguishes pending from proposed", () => {
    assert.equal(isPending(pending("x")), true);
    assert.equal(isPending(proposed("a", "x")), true);
    assert.equal(isProposed(pending("x")), false);
    assert.equal(isProposed(proposed("a", "x")), true);
    assert.equal(isPending("text"), false);
    assert.equal(isPending(null), false);
  });
});

describe("isApproved", () => {
  it("accepts non-empty strings, non-empty arrays and other values", () => {
    assert.equal(isApproved("Hello"), true);
    assert.equal(isApproved(["a"]), true);
    assert.equal(isApproved({ title: "x" }), true);
  });

  it("rejects empty, whitespace-only, missing and pending values", () => {
    assert.equal(isApproved(""), false);
    assert.equal(isApproved("   "), false);
    assert.equal(isApproved([]), false);
    assert.equal(isApproved(undefined), false);
    assert.equal(isApproved(null), false);
    assert.equal(isApproved(pending("x")), false);
    assert.equal(isApproved(proposed("draft", "x")), false);
  });
});

describe("publishedOrPreview", () => {
  it("always returns approved values", () => {
    assert.equal(publishedOrPreview("Final", false), "Final");
    assert.equal(publishedOrPreview("Final", true), "Final");
  });

  it("returns draft values only when previews are allowed", () => {
    const draft = proposed("Draft", "needs sign-off");
    assert.equal(publishedOrPreview(draft, true), "Draft");
    assert.equal(publishedOrPreview(draft, false), undefined);
  });

  it("never returns a bare pending marker or missing value", () => {
    assert.equal(publishedOrPreview(pending("x"), true), undefined);
    assert.equal(publishedOrPreview(undefined, true), undefined);
    assert.equal(publishedOrPreview(null, true), undefined);
  });
});
