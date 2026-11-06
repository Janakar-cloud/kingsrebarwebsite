import { expect, test } from "@playwright/test";

import { e2eSite } from "../../playwright.config";
import { pages } from "../helpers";

test.describe("robots and sitemap", () => {
  test("robots.txt allows crawling, blocks the API and points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Disallow: /api/");
    expect(body).toContain(`Sitemap: ${e2eSite}/sitemap.xml`);
  });

  test("sitemap.xml lists exactly the public pages with absolute URLs", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    const body = await response.text();
    const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(urls.sort()).toEqual(pages.map(({ path }) => new URL(path, e2eSite).href).sort());
  });

  test("every sitemap URL path is served by this site", async ({ request }) => {
    const body = await (await request.get("/sitemap.xml")).text();
    const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
    for (const path of urls) expect((await request.get(path)).status(), path).toBe(200);
  });
});

test.describe("structured data", () => {
  test("home page publishes valid Organization JSON-LD with only confirmed facts", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((node) => node.textContent ?? ""),
    );
    const parsed = blocks.map((text) => JSON.parse(text));
    const organization = parsed.find((entry) => entry["@type"] === "Organization");
    expect(organization).toBeTruthy();
    expect(organization["@context"]).toBe("https://schema.org");
    expect(organization.name).toBe("Kings Rebar");
    expect(organization.url).toBe(`${e2eSite}/`);
    expect(organization.email).toBe("info@kingsrebar.com");
    expect(organization.logo).toBe(`${e2eSite}/images/logo.png`);
    expect(JSON.stringify(organization)).not.toMatch(/pending|undefined|null/i);
  });

  test("sub pages publish a BreadcrumbList that matches the visible trail", async ({ page }) => {
    for (const { path, label } of pages.filter((entry) => entry.path !== "/")) {
      await page.goto(path);
      const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
        nodes.map((node) => JSON.parse(node.textContent ?? "{}")),
      );
      const crumbs = blocks.find((entry) => entry["@type"] === "BreadcrumbList");
      expect(crumbs, path).toBeTruthy();
      expect(crumbs.itemListElement.map((item: { name: string }) => item.name)).toEqual(["Home", label]);
      expect(crumbs.itemListElement[1].item).toBe(new URL(path, e2eSite).href);
    }
  });
});

test.describe("images and icons", () => {
  test("serves the Open Graph image as a PNG", async ({ request }) => {
    const response = await request.get("/opengraph-image");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });

  test("serves the favicon and Apple touch icon", async ({ request, page }) => {
    await page.goto("/");
    const hrefs = await page.$$eval('link[rel~="icon"], link[rel="apple-touch-icon"]', (nodes) =>
      nodes.map((node) => (node as HTMLLinkElement).href),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(2);
    for (const href of hrefs) {
      const response = await request.get(new URL(href).pathname + new URL(href).search);
      expect(response.status(), href).toBe(200);
      expect(response.headers()["content-type"]).toContain("image/");
    }
  });
});

test.describe("security headers", () => {
  for (const path of ["/", "/contact", "/does-not-exist"]) {
    test(`${path} sends the hardening headers`, async ({ request }) => {
      const headers = (await request.get(path)).headers();
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["cross-origin-opener-policy"]).toBe("same-origin");
      expect(headers["strict-transport-security"]).toContain("max-age=");
      expect(headers["permissions-policy"]).toContain("camera=()");
      expect(headers["x-powered-by"]).toBeUndefined();
    });
  }

  test("the Content Security Policy locks everything to this origin", async ({ request }) => {
    const csp = (await request.get("/")).headers()["content-security-policy"];
    expect(csp).toBeTruthy();
    for (const directive of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "connect-src 'self'",
      "img-src 'self' data: blob:",
    ]) {
      expect(csp).toContain(directive);
    }
    expect(csp).not.toMatch(/script-src[^;]*\*/);
    expect(csp).not.toContain("'unsafe-eval'");
  });

  test("the site actually runs under its CSP (no violations in the browser)", async ({ page }) => {
    const violations: string[] = [];
    page.on("console", (message) => {
      if (/content security policy|refused to/i.test(message.text())) violations.push(message.text());
    });
    for (const { path } of pages) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(violations).toEqual([]);
  });

  test("the page cannot be framed", async ({ page }) => {
    await page.goto("/");
    const blocked = await page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const frame = document.createElement("iframe");
          frame.src = "/about";
          frame.onload = () => {
            try {
              resolve(!frame.contentDocument?.body?.innerText);
            } catch {
              resolve(true);
            }
          };
          document.body.appendChild(frame);
          setTimeout(() => resolve(true), 3000);
        }),
    );
    expect(blocked).toBe(true);
  });
});
