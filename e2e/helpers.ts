import { expect, type Page } from "@playwright/test";

import { navigation } from "@/content/routes";

export const pages = navigation.map((item) => ({ path: item.href as string, label: item.label }));

export const viewports = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1366, height: 800 },
  wide: { width: 1920, height: 1080 },
} as const;

/** Text that must never appear in a production page. */
export const placeholderPhrases = ["Preview build", "Content needed", "Needs approval", "Development only"];

/** Scrolls top to bottom so lazy images load and reveal animations run. */
export async function scrollThrough(page: Page) {
  // Reveal blocks are only marked once the page has hydrated; scrolling earlier would skip them.
  await page.waitForFunction(() => !document.querySelector("[data-reveal]") || document.querySelector("[data-reveal-state]"));
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight * 0.7, 300);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 250));
    window.scrollTo(0, 0);
  });
}

/** Collects console errors, uncaught exceptions and failed or error responses. */
export function watchPage(page: Page) {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`exception: ${error.message}`));
  page.on("requestfailed", (request) => {
    // Aborted prefetches and cancelled image requests are normal during navigation.
    if (request.failure()?.errorText !== "net::ERR_ABORTED") {
      problems.push(`request failed: ${request.url()} (${request.failure()?.errorText})`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`);
  });
  return problems;
}

export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(1);
}
