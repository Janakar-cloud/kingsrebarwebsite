import { expect, test } from "@playwright/test";

import { pages, viewports } from "../helpers";

test.describe("desktop navigation", () => {
  test.use({ viewport: viewports.laptop });

  test("header links reach every page and mark the current one", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Main" });

    for (const { path, label } of pages) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path === "/" ? "/$" : `${path}$`}`));
      // Next.js keeps previously visited routes mounted but hidden, so only count the visible heading.
      await expect(page.locator("h1:visible")).toHaveCount(1);
      await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
      await expect(nav.locator('[aria-current="page"]')).toContainText(label);
    }
  });

  test("the logo returns to the home page", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("banner").getByRole("link", { name: /home page/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("footer links reach every page", async ({ page }) => {
    for (const { path, label } of pages) {
      await page.goto("/");
      await page.getByRole("navigation", { name: "Footer" }).getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(path === "/" ? "/$" : `${path}$`));
    }
  });

  test("footer enquiry call to action opens the contact page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("contentinfo").getByRole("link", { name: /make an enquiry/i }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("sub pages show a breadcrumb trail back to Home", async ({ page }) => {
    for (const { path } of pages.filter((entry) => entry.path !== "/")) {
      await page.goto(path);
      const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(crumbs.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(crumbs.locator('[aria-current="page"]')).toBeVisible();
    }
  });

  test("Back to top link moves focus to the main content", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /back to top/i }).click();
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("the skip link is the first tab stop and jumps to main content", async ({ page }) => {
    await page.goto("/services");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: /skip to main content/i });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("browser back and forward work between pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/\/services$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/services$/);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: viewports.mobile });

  test("starts closed and toggles with the Menu button", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Services", exact: true })).toBeHidden();

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    for (const { label } of pages) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(nav.getByRole("link", { name: "Services", exact: true })).toBeHidden();
  });

  test("choosing a link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Industries", exact: true }).click();
    await expect(page).toHaveURL(/\/applications$/);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the menu and returns focus to the button", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("tapping outside the menu closes it", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Menu" });
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await page.mouse.click(5, viewports.mobile.height - 5);
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("every page is reachable from the mobile menu", async ({ page }) => {
    for (const { path, label } of pages) {
      await page.goto("/");
      await page.getByRole("button", { name: "Menu" }).click();
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(path === "/" ? "/$" : `${path}$`));
    }
  });
});

test.describe("redirects and errors", () => {
  const redirects = [
    ["/products", "/services"],
    ["/quality-responsibility", "/careers"],
    ["/quality-and-responsibility", "/careers"],
  ] as const;

  for (const [from, to] of redirects) {
    test(`${from} redirects permanently to ${to}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(response.headers()["location"]).toBe(to);
    });
  }

  test("an unknown URL shows the 404 page with a real 404 status", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toBeVisible();
    // Next.js adds its own noindex for not-found responses on top of ours; every copy must say noindex.
    const robots = await page.locator('meta[name="robots"]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute("content")));
    expect(robots.length).toBeGreaterThan(0);
    for (const content of robots) expect(content).toMatch(/noindex/);
    await expect(page.getByRole("link", { name: /go to the home page/i })).toBeVisible();
    await page.getByRole("link", { name: /go to the home page/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("the 404 page lists every site page", async ({ page }) => {
    await page.goto("/nope");
    const index = page.getByRole("region", { name: "Site pages" });
    for (const { label } of pages) {
      await expect(index.getByRole("link", { name: new RegExp(label) }).first()).toBeVisible();
    }
  });

  test("a deep unknown path is also a 404", async ({ request }) => {
    expect((await request.get("/services/unknown/deep/path")).status()).toBe(404);
  });
});
