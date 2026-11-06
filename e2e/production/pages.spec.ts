import { expect, test } from "@playwright/test";

import { e2eSite } from "../../playwright.config";
import { expectNoHorizontalOverflow, pages, placeholderPhrases, scrollThrough, viewports, watchPage } from "../helpers";

test.describe("every page", () => {
  for (const { path, label } of pages) {
    test.describe(`${label} (${path})`, () => {
      test("loads cleanly with no console errors or failed requests", async ({ page }) => {
        const problems = watchPage(page);
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);
        await scrollThrough(page);
        await page.waitForLoadState("networkidle");
        expect(problems).toEqual([]);
      });

      test("has the document basics: language, one h1, landmarks", async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator("header")).toHaveCount(1);
        await expect(page.locator("main#main-content")).toHaveCount(1);
        await expect(page.locator("footer")).toHaveCount(1);
        await expect(page.locator("nav[aria-label='Main']")).toBeVisible();
      });

      test("heading levels never skip", async ({ page }) => {
        await page.goto(path);
        const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) =>
          nodes.map((node) => Number(node.tagName.slice(1))),
        );
        for (let index = 1; index < levels.length; index += 1) {
          expect(levels[index] - levels[index - 1], `h${levels[index - 1]} to h${levels[index]}`).toBeLessThanOrEqual(1);
        }
      });

      test("has complete SEO and social metadata", async ({ page }) => {
        await page.goto(path);
        const title = await page.title();
        expect(title).toContain("Kings Rebar");
        expect(title.length).toBeLessThanOrEqual(70);

        const description = await page.locator('meta[name="description"]').getAttribute("content");
        expect(description?.length ?? 0).toBeGreaterThan(50);
        expect(description?.length ?? 0).toBeLessThanOrEqual(175);

        // The home page may be written with or without its trailing slash; both mean the same URL.
        const expectedUrl = new URL(path, e2eSite).href;
        const sameUrl = new RegExp(`^${expectedUrl.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&").replace(/\\\/$/, "\\/?")}$`);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", sameUrl);
        await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", sameUrl);
        await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
        await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
        await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /index, follow/);
      });

      test("shows no development placeholders", async ({ page }) => {
        await page.goto(path);
        await scrollThrough(page);
        const text = await page.locator("body").innerText();
        for (const phrase of placeholderPhrases) expect(text).not.toContain(phrase);
        await expect(page.locator(".pending")).toHaveCount(0);
        await expect(page.locator(".preview-banner")).toHaveCount(0);
      });

      test("loads every image", async ({ page }) => {
        await page.goto(path);
        await scrollThrough(page);
        await page.waitForLoadState("networkidle");
        const broken = await page.$$eval("img", (images) =>
          images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        );
        expect(broken).toEqual([]);
      });

      test("every image has an alt attribute", async ({ page }) => {
        await page.goto(path);
        const missing = await page.$$eval("img:not([alt])", (images) =>
          images.map((image) => (image as HTMLImageElement).src),
        );
        expect(missing).toEqual([]);
      });

      for (const [name, size] of Object.entries(viewports)) {
        test(`does not overflow horizontally at ${name} (${size.width}px)`, async ({ page }) => {
          await page.setViewportSize(size);
          await page.goto(path);
          await scrollThrough(page);
          await expectNoHorizontalOverflow(page);
        });
      }
    });
  }

  test("page titles and descriptions are unique", async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const { path } of pages) {
      await page.goto(path);
      titles.add(await page.title());
      descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
    }
    expect(titles.size, "each route needs its own <title>").toBe(pages.length);
    expect(descriptions.size, "each route needs its own meta description").toBe(pages.length);
  });
});
