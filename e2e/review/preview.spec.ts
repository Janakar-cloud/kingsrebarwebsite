import { expect, test } from "@playwright/test";

import { pages, watchPage } from "../helpers";

test.describe("client review build", () => {
  for (const { path, label } of pages) {
    test(`${label} shows the preview banner and loads without errors`, async ({ page }) => {
      const problems = watchPage(page);
      await page.goto(path);
      await expect(page.getByRole("note").filter({ hasText: "Preview build." })).toBeVisible();
      await page.waitForLoadState("networkidle");
      expect(problems).toEqual([]);
    });
  }

  test("pending content is marked with a visible label so the client can see what is missing", async ({ page }) => {
    await page.goto("/contact");
    const notes = page.locator(".pending");
    expect(await notes.count()).toBeGreaterThan(0);
    for (const note of await notes.all()) await expect(note.locator(".pending__label")).toBeVisible();
  });

  test("the review build keeps the production canonical URL", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /^https:\/\/www\.kingsrebar\.com\/?$/);
  });
});
