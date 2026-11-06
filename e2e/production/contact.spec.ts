import { expect, test } from "@playwright/test";

import { site } from "@/content/site";

test.describe("contact page in production", () => {
  test("shows the enquiry form with the UAT privacy notice", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("form")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send enquiry" })).toBeVisible();
    await expect(page.getByText("Your enquiry is sent by email to info@kingsrebar.com")).toBeVisible();
  });

  test("shows working contact details", async ({ page }) => {
    await page.goto("/contact");
    const details = page.getByRole("complementary");
    await expect(details.getByRole("link", { name: site.contact.email })).toHaveAttribute(
      "href",
      `mailto:${site.contact.email}`,
    );
    const phoneHref = await details.getByRole("link", { name: site.contact.phone }).getAttribute("href");
    expect(phoneHref).toBe(`tel:${site.contact.phone.replace(/\s/g, "")}`);
    for (const line of site.contact.hours) await expect(details.getByText(line)).toBeVisible();
  });

  test("lists the offices with their addresses", async ({ page }) => {
    await page.goto("/contact");
    const offices = page.getByRole("region", { name: "Offices" });
    await expect(offices.getByRole("heading", { name: "Head office" })).toBeVisible();
    await expect(offices.getByRole("heading", { name: "Salem branch" })).toBeVisible();
    await expect(offices.locator("address")).toHaveCount(2);
  });

  test("does not embed an unverified map", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("iframe")).toHaveCount(0);
    await expect(page.locator('a[href*="maps.google"], a[href*="goo.gl/maps"]')).toHaveCount(0);
  });

  test("pre-selecting a topic via the URL does not break the page", async ({ page }) => {
    const response = await page.goto("/contact?topic=Careers");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("the careers call to action points at the contact page with a topic", async ({ page }) => {
    await page.goto("/careers");
    const cta = page.getByRole("link", { name: "Ask about careers" }).last();
    await expect(cta).toHaveAttribute("href", "/contact?topic=Careers");
  });
});

test.describe("content that the client approved", () => {
  test("home page states the headline offer", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Kings Rebar");
    await expect(page.getByRole("heading", { name: "Rebar detailing", level: 3 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Rebar estimation", level: 3 })).toBeVisible();
  });

  test("home page shows the Tamil Nadu offices map and the six process steps", async ({ page }) => {
    await page.goto("/");
    const map = page.getByRole("img", { name: /map of tamil nadu/i });
    await map.scrollIntoViewIfNeeded();
    await expect(map).toBeVisible();
    await expect
      .poll(() => map.evaluate((image: HTMLImageElement) => image.naturalWidth), { message: "map image should finish loading" })
      .toBeGreaterThan(0);
    const steps = page.getByRole("heading", { level: 3 }).filter({
      hasText: /^(Share project information|Review the scope|Confirm requirements|Prepare the work|Coordinate questions|Issue deliverables)$/,
    });
    await expect(steps).toHaveCount(6);
  });

  test("careers page shows the Development and Team sections with their photos", async ({ page }) => {
    await page.goto("/careers");
    await expect(page.getByRole("heading", { name: "Learn through practical experience" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Grow with experienced colleagues" })).toBeVisible();
    await expect(page.getByText("Build your knowledge. Learn through the work. Keep growing.")).toBeVisible();
  });

  test("about page no longer contains the removed Approach and People sections", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "Our story" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Where we work" })).toBeVisible();
    await expect(page.locator("#approach-heading, #people-heading")).toHaveCount(0);
  });

  for (const [name, size] of [
    ["desktop", { width: 1366, height: 800 }],
    ["mobile", { width: 375, height: 812 }],
  ] as const) {
    test(`services hero banner is shown whole, not cropped (${name})`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto("/services");
      const photo = page.getByRole("img", { name: /construction dashboard/i });
      await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      const frame = await photo.evaluate((image: HTMLImageElement) => {
        const box = image.parentElement!.parentElement!.getBoundingClientRect();
        return { width: box.width, height: box.height, fit: getComputedStyle(image).objectFit };
      });
      // The frame must have the image's own proportions (1024 x 445), so object-fit: cover crops nothing.
      expect(frame.width / frame.height).toBeCloseTo(1024 / 445, 1);
      expect(frame.height).toBeGreaterThan(100);
    });
  }

  test("services page describes the software tools in text", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByText("Software that supports our detailing work")).toBeVisible();
    await expect(page.getByText("AutoCAD").first()).toBeVisible();
    await expect(page.getByText("RebarCAD").first()).toBeVisible();
  });
});
