import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isActiveRoute, navigation, routes } from "@/content/routes";

describe("routes", () => {
  it("uses unique, root-relative paths", () => {
    const paths = Object.values(routes);
    assert.equal(new Set(paths).size, paths.length);
    for (const path of paths) assert.match(path, /^\/[a-z-]*$/);
  });
});

describe("navigation", () => {
  it("lists every route exactly once, with the home page first", () => {
    const hrefs = navigation.map((item) => item.href);
    assert.deepEqual([...hrefs].sort(), Object.values(routes).sort());
    assert.equal(hrefs[0], routes.home);
  });

  it("gives each item a label and a description", () => {
    for (const item of navigation) {
      assert.ok(item.label.trim().length > 0, `${item.href} needs a label`);
      assert.ok(item.description.trim().length > 0, `${item.href} needs a description`);
    }
  });
});

describe("isActiveRoute", () => {
  it("matches the home page only on the exact root", () => {
    assert.equal(isActiveRoute("/", "/"), true);
    assert.equal(isActiveRoute("/about", "/"), false);
  });

  it("matches a section and its children, but not look-alike prefixes", () => {
    assert.equal(isActiveRoute("/services", "/services"), true);
    assert.equal(isActiveRoute("/services/detailing", "/services"), true);
    assert.equal(isActiveRoute("/services-extra", "/services"), false);
    assert.equal(isActiveRoute("/about", "/services"), false);
  });
});
