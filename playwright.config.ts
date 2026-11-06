import { defineConfig } from "@playwright/test";

/**
 * End-to-end tests run against a real production build served by `next start`.
 *
 * Two builds are exercised, because deployment settings are baked in at build time:
 *   production  What a visitor gets: no placeholders, indexing enabled, SITE_URL set.
 *   review      The client-review copy (SHOW_CONTENT_PLACEHOLDERS=true) where the
 *               enquiry form is visible, so the form can be tested end to end.
 *
 * Run both with `npm run test:e2e`. Both builds write to `.next`, so stop `npm run dev` first.
 * The browser defaults to the locally installed Chrome; set E2E_BROWSER_CHANNEL=msedge for
 * Edge, or E2E_BROWSER_CHANNEL= (empty) to use Playwright's own Chromium after
 * `npx playwright install chromium`.
 */
const mode = process.env.E2E_MODE === "review" ? "review" : "production";
const port = mode === "review" ? 3102 : 3101;
const channel = process.env.E2E_BROWSER_CHANNEL ?? "chrome";

export const e2eSite = "https://www.kingsrebar.com";

export default defineConfig({
  testDir: `./e2e/${mode}`,
  outputDir: `./test-results/${mode}`,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: `./playwright-report/${mode}` }]],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    ...(channel ? { channel } : {}),
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${port} -H 127.0.0.1`,
    url: `http://127.0.0.1:${port}`,
    timeout: 300_000,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      NODE_ENV: "production",
      SITE_URL: e2eSite,
      ALLOW_INDEXING: "true",
      SHOW_CONTENT_PLACEHOLDERS: mode === "review" ? "true" : "false",
      ENQUIRY_DEV_SIMULATE: "",
      RESEND_API_KEY: "",
      ENQUIRY_FROM_EMAIL: "",
      ENQUIRY_WEBHOOK_URL: "",
      OUTLOOK_TENANT_ID: "",
      OUTLOOK_CLIENT_ID: "",
      OUTLOOK_CLIENT_SECRET: "",
      OUTLOOK_SMTP_PASSWORD: "",
    },
  },
});
