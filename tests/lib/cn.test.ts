import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins class names with single spaces", () => {
    assert.equal(cn("a", "b", "c"), "a b c");
  });

  it("drops falsy values", () => {
    assert.equal(cn("a", false, null, undefined, "", "b"), "a b");
  });

  it("returns an empty string when nothing is left", () => {
    assert.equal(cn(false, null, undefined), "");
  });
});
