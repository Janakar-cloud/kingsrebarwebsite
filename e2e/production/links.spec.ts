import { expect, test } from "@playwright/test";

import { site } from "@/content/site";

import { pages } from "../helpers";

type LinkInfo = { href: string; text: string; target: string | null; rel: string | null };

async function collectLinks(page: import("@playwright/test").Page): Promise<LinkInfo[]> {
  return page.$$eval("a[href]", (anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute("href") ?? "",
      text: (anchor.textContent ?? "").trim() || (anchor.getAttribute("aria-label") ?? ""),
      target: anchor.getAttribute("target"),
      rel: anchor.getAttribute("rel"),
    })),
  );
}

test.describe("links", () => {
  test("every internal link on every page resolves", async ({ page, request }) => {
    const checked = new Map<string, number>();
    for (const { path } of pages) {
      await page.goto(path);
      for (const link of await collectLinks(page)) {
        if (!link.href.startsWith("/") || link.href.startsWith("//")) continue;
        const target = link.href.split("#")[0] || path;
        if (!checked.has(target)) checked.set(target, (await request.get(target)).status());
      }
    }
    const broken = [...checked].filter(([, status]) => status !== 200);
    expect(broken, "internal links that do not return 200").toEqual([]);
    expect(checked.size).toBeGreaterThanOrEqual(pages.length);
  });

  test("every in-page anchor points at an element that exists", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      const missing = await page.$$eval('a[href^="#"]', (anchors) =>
        anchors
          .map((anchor) => anchor.getAttribute("href") ?? "")
          .filter((href) => href.length > 1 && !document.getElementById(href.slice(1))),
      );
      expect(missing, path).toEqual([]);
    }
  });

  test("external links are safe, and third-party sites open in a new tab", async ({ page }) => {
    const ownSite = new URL(site.contact.website).origin;
    for (const { path } of pages) {
      await page.goto(path);
      const external = (await collectLinks(page)).filter((link) => /^https?:\/\//.test(link.href));
      for (const link of external) {
        expect(link.rel ?? "", link.href).toContain("noopener");
        if (new URL(link.href).origin !== ownSite) expect(link.target, link.href).toBe("_blank");
      }
    }
  });

  test("the social link points at the approved LinkedIn profile only", async ({ page }) => {
    await page.goto("/");
    const external = (await collectLinks(page)).filter((link) => /^https?:\/\//.test(link.href));
    const approved = new Set<string>([...site.social.map((profile) => profile.url), site.contact.website]);
    for (const link of external) expect(approved.has(link.href), link.href).toBe(true);
  });

  test("mailto and tel links are well formed", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      for (const link of await collectLinks(page)) {
        if (link.href.startsWith("mailto:")) expect(link.href).toMatch(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (link.href.startsWith("tel:")) expect(link.href).toMatch(/^tel:\+?[0-9]{7,15}$/);
      }
    }
  });

  test("every link has an accessible name", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      const nameless = await page.$$eval("a[href], button", (nodes) =>
        nodes
          .filter((node) => !(node.textContent ?? "").trim() && !node.getAttribute("aria-label") && !node.querySelector("img[alt]:not([alt=''])"))
          .map((node) => node.outerHTML.slice(0, 120)),
      );
      expect(nameless, path).toEqual([]);
    }
  });

  test("no page links to a dead placeholder such as # or javascript:", async ({ page }) => {
    for (const { path } of pages) {
      await page.goto(path);
      const bad = (await collectLinks(page)).filter((link) => link.href === "#" || link.href.startsWith("javascript:"));
      expect(bad, path).toEqual([]);
    }
  });
});
