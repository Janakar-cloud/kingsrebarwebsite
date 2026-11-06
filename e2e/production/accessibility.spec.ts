import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import { pages, scrollThrough, viewports } from "../helpers";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

async function scan(page: Page) {
  await scrollThrough(page);
  await page.waitForTimeout(1800); // let reveal and flow animations settle before measuring contrast
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
  return results.violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 4).map((node) => node.target.join(" ")),
  }));
}

test.describe("automated accessibility scan (axe, WCAG 2.2 AA)", () => {
  for (const { path, label } of pages) {
    test(`${label} has no violations on desktop`, async ({ page }) => {
      await page.setViewportSize(viewports.laptop);
      await page.goto(path);
      expect(await scan(page)).toEqual([]);
    });

    test(`${label} has no violations on mobile`, async ({ page }) => {
      await page.setViewportSize(viewports.mobile);
      await page.goto(path);
      expect(await scan(page)).toEqual([]);
    });
  }

  test("the open mobile menu has no violations", async ({ page }) => {
    await page.setViewportSize(viewports.mobile);
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.waitForTimeout(1800); // staggered menu items finish animating in
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    expect(
      results.violations.map((violation) => ({
        rule: violation.id,
        nodes: violation.nodes.slice(0, 4).map((node) => `${node.target.join(" ")} :: ${node.any[0]?.message ?? ""}`),
      })),
    ).toEqual([]);
  });

  test("the 404 page has no violations", async ({ page }) => {
    await page.goto("/missing");
    expect(await scan(page)).toEqual([]);
  });
});

test.describe("keyboard and focus", () => {
  test("every interactive element can be reached by keyboard with a visible focus indicator", async ({ page }) => {
    await page.setViewportSize(viewports.laptop);
    await page.goto("/contact");

    const seen = new Set<string>();
    const hidden: string[] = [];
    for (let index = 0; index < 40; index += 1) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const element = document.activeElement as HTMLElement | null;
        if (!element || element === document.body) return null;
        const style = getComputedStyle(element);
        const outlined = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
        const shadowed = style.boxShadow !== "none";
        return {
          id: `${element.tagName.toLowerCase()}:${element.textContent?.trim().slice(0, 30) ?? ""}:${element.getAttribute("href") ?? ""}`,
          indicated: outlined || shadowed,
        };
      });
      if (!info) continue;
      seen.add(info.id);
      if (!info.indicated) hidden.push(info.id);
    }
    expect(seen.size).toBeGreaterThan(10);
    expect(hidden, "elements with no visible focus style").toEqual([]);
  });

  test("the page is usable at 200% zoom (reflowed 640px width)", async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await expect(page.getByRole("button", { name: "Menu" })).toBeVisible();
  });
});

test.describe("motion preferences and resilience", () => {
  test("with reduced motion every animated block is visible immediately", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    for (const { path } of pages) {
      await page.goto(path);
      const hiddenReveals = await page.$$eval("[data-reveal]", (nodes) =>
        nodes.filter((node) => getComputedStyle(node).opacity === "0").length,
      );
      expect(hiddenReveals, path).toBe(0);
    }
    await context.close();
  });

  test("scrolling reveals every animated block", async ({ page }) => {
    await page.setViewportSize(viewports.laptop);
    for (const { path } of pages) {
      await page.goto(path);
      await scrollThrough(page);
      await page.waitForTimeout(500);
      const pending = await page.$$eval('[data-reveal][data-reveal-state="pending"]', (nodes) => nodes.length);
      expect(pending, `${path} blocks still hidden after scrolling`).toBe(0);
    }
  });

  test("content is readable with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    for (const { path } of pages) {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      const hiddenReveals = await page.$$eval("[data-reveal]", (nodes) =>
        nodes.filter((node) => getComputedStyle(node).opacity === "0").length,
      );
      expect(hiddenReveals, `${path} content hidden without JavaScript`).toBe(0);
    }
    await context.close();
  });

  test("the home process flow completes its animation", async ({ page }) => {
    await page.setViewportSize(viewports.laptop);
    await page.goto("/");
    const board = page.locator("[data-flow]").first();
    await board.scrollIntoViewIfNeeded();
    await expect(board).toHaveAttribute("data-flow", "done", { timeout: 20_000 });
  });
});
