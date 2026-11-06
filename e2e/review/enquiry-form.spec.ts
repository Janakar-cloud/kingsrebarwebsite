import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page, type Route } from "@playwright/test";

import { site } from "@/content/site";

import { scrollThrough, viewports } from "../helpers";

const valid = {
  name: "Asha Rao",
  email: "asha@example.com",
  company: "Rao Constructions",
  phone: "+91 98765 43210",
  topic: "Project enquiry",
  message: "We would like a quantity take-off for a four storey residential block.",
};

async function fill(page: Page, values: Partial<typeof valid> = {}) {
  const data = { ...valid, ...values };
  await page.getByLabel(/^Name/).fill(data.name);
  await page.getByLabel(/^Business email/).fill(data.email);
  await page.getByLabel(/^Company/).fill(data.company);
  // Choose the type before typing a possibly invalid phone: the inline error that appears on blur
  // moves the chips down, which can swallow a mouse click that is already in progress.
  if (data.topic) await page.getByRole("radio", { name: data.topic }).check({ force: true });
  await page.getByLabel(/^Phone/).fill(data.phone);
  await page.getByLabel(/^Message/).fill(data.message);
}

const submit = (page: Page) => page.getByRole("button", { name: /send enquiry|sending/i });

function mockApi(page: Page, status: number, body: unknown, options: { delayMs?: number } = {}) {
  const requests: Array<Record<string, string>> = [];
  const handler = async (route: Route) => {
    requests.push(route.request().postDataJSON());
    if (options.delayMs) await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  };
  return page.route("**/api/enquiry", handler).then(() => requests);
}

/** True once React has attached to the form, so clicks and typing are not overwritten by hydration. */
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const form = document.querySelector("form");
    return Boolean(form && Object.keys(form).some((key) => key.startsWith("__reactProps")));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("heading", { name: "Send an enquiry" })).toBeVisible();
  await waitForHydration(page);
});

test.describe("form structure", () => {
  test("shows the preview banner and the UAT privacy notice in the review build", async ({ page }) => {
    await expect(page.getByText("Preview build.")).toBeVisible();
    await expect(page.getByText("Your enquiry is sent by email to info@kingsrebar.com")).toBeVisible();
  });

  test("renders every field with a label and a required or optional marker", async ({ page }) => {
    await expect(page.getByLabel("Name (required)")).toBeVisible();
    await expect(page.getByLabel("Business email (required)")).toBeVisible();
    await expect(page.getByLabel("Company (optional)")).toBeVisible();
    await expect(page.getByLabel("Phone (optional)")).toBeVisible();
    await expect(page.getByLabel("Message (required)")).toBeVisible();
    await expect(page.getByRole("group", { name: /Enquiry type/ })).toBeVisible();
    for (const topic of site.enquiry.topics) await expect(page.getByRole("radio", { name: topic })).toBeAttached();
  });

  test("uses the right input types and autocomplete hints for mobile keyboards", async ({ page }) => {
    await expect(page.getByLabel(/^Business email/)).toHaveAttribute("type", "email");
    await expect(page.getByLabel(/^Business email/)).toHaveAttribute("autocomplete", "email");
    await expect(page.getByLabel(/^Phone/)).toHaveAttribute("type", "tel");
    await expect(page.getByLabel(/^Name/)).toHaveAttribute("autocomplete", "name");
  });

  test("the anti-spam field is invisible and cannot be tabbed to", async ({ page }) => {
    const trap = page.locator('input[name="kr_contact_preference"]');
    // It is parked far off-screen rather than display:none, because some bots skip display:none fields.
    const box = await trap.boundingBox();
    expect((box?.x ?? 0) + (box?.width ?? 0), "honeypot should sit off-screen").toBeLessThan(0);
    await expect(trap).toHaveAttribute("tabindex", "-1");
    await expect(page.locator("[aria-hidden='true']").filter({ has: trap })).toHaveCount(1);
    await page.getByLabel(/^Message/).focus();
    for (let index = 0; index < 6; index += 1) {
      await page.keyboard.press("Tab");
      await expect(trap).not.toBeFocused();
    }
  });
});

test.describe("validation", () => {
  test("submitting an empty form shows a focused error summary and sends nothing", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" });
    await submit(page).click();

    const summary = page.getByRole("alert").filter({ hasText: "There is a problem with your enquiry" });
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary.getByRole("link")).toHaveCount(4);
    await expect(page.getByLabel(/^Name/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/^Business email/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/^Message/)).toHaveAttribute("aria-invalid", "true");
    expect(requests).toHaveLength(0);
  });

  test("clicking an error in the summary moves focus to that field", async ({ page }) => {
    await submit(page).click();
    await page.getByRole("link", { name: "Enter your name." }).click();
    await expect(page.getByLabel(/^Name/)).toBeFocused();
    await page.getByRole("link", { name: "Enter your message." }).click();
    await expect(page.getByLabel(/^Message/)).toBeFocused();
  });

  test("each field error is announced through aria-describedby", async ({ page }) => {
    await submit(page).click();
    const describedBy = await page.getByLabel(/^Name/).getAttribute("aria-describedby");
    expect(describedBy).toBe("enquiry-name-error");
    await expect(page.locator("#enquiry-name-error")).toContainText("Enter your name.");
  });

  test("an invalid email is flagged when leaving the field, and clears once fixed", async ({ page }) => {
    const email = page.getByLabel(/^Business email/);
    await email.fill("not-an-email");
    await email.blur();
    await expect(page.getByText("Enter an email address in the format name@example.com.")).toBeVisible();
    await email.fill("fixed@example.com");
    await expect(page.getByText("Enter an email address in the format name@example.com.")).toBeHidden();
  });

  test("an untouched field is not flagged just by tabbing through it", async ({ page }) => {
    await page.getByLabel(/^Name/).focus();
    await page.keyboard.press("Tab");
    await expect(page.locator("[id$='-error']")).toHaveCount(0);
  });

  test("a message under 10 characters is rejected with a specific message", async ({ page }) => {
    await fill(page, { message: "too short" });
    await submit(page).click();
    await expect(page.getByRole("link", { name: "Your message must be at least 10 characters." })).toBeVisible();
  });

  test("a malformed phone number is rejected but an empty one is accepted", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" });
    await fill(page, { phone: "abc" });
    await submit(page).click();
    await expect(page.getByRole("link", { name: /phone number using digits/ })).toBeVisible();
    expect(requests).toHaveLength(0);

    await page.getByLabel(/^Phone/).fill("");
    await submit(page).click();
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test("whitespace-only values count as empty", async ({ page }) => {
    await fill(page, { name: "     ", message: "          " });
    await submit(page).click();
    await expect(page.getByRole("link", { name: "Enter your name." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Enter your message." })).toBeVisible();
  });

  test("the character counter tracks the message and the field enforces its maximum", async ({ page }) => {
    const message = page.getByLabel(/^Message/);
    await message.fill("hello there");
    await expect(page.getByText("11 / 5000")).toBeAttached();
    await expect(message).toHaveAttribute("maxlength", "5000");
    await expect(page.getByLabel(/^Name/)).toHaveAttribute("maxlength", "100");
  });
});

test.describe("enquiry type", () => {
  test("is empty by default", async ({ page }) => {
    for (const topic of site.enquiry.topics) await expect(page.getByRole("radio", { name: topic })).not.toBeChecked();
  });

  test("is pre-selected from the ?topic= link on the Careers page", async ({ page }) => {
    await page.goto("/contact?topic=Careers");
    await expect(page.getByRole("radio", { name: "Careers" })).toBeChecked();
  });

  test("an unknown ?topic= value is ignored", async ({ page }) => {
    await page.goto("/contact?topic=Hacked");
    for (const topic of site.enquiry.topics) await expect(page.getByRole("radio", { name: topic })).not.toBeChecked();
  });

  test("works with the keyboard: arrow keys move between options", async ({ page }) => {
    await page.getByRole("radio", { name: "Project enquiry" }).focus();
    await page.keyboard.press("Space");
    await expect(page.getByRole("radio", { name: "Project enquiry" })).toBeChecked();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: "Careers" })).toBeChecked();
  });

  test("clicking the visible label selects the option", async ({ page }) => {
    // The real radio sits invisibly over its label, so a real click lands on it; force skips Playwright's overlap guard.
    await page.getByText("Other", { exact: true }).click({ force: true });
    await expect(page.getByRole("radio", { name: "Other" })).toBeChecked();
  });
});

test.describe("submitting", () => {
  test("a valid enquiry is sent as JSON with an empty honeypot, then shows the success state", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" });
    await fill(page);
    await submit(page).click();

    const heading = page.getByRole("heading", { name: site.enquiry.successHeading });
    await expect(heading).toBeVisible();
    await expect(heading).toBeFocused();
    await expect(page.getByText(site.enquiry.successMessage)).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);

    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject(valid);
    expect(requests[0].kr_contact_preference).toBe("");
  });

  test("'Send another enquiry' returns an empty form with focus on the first field", async ({ page }) => {
    await mockApi(page, 200, { status: "sent" });
    await fill(page);
    await submit(page).click();
    await page.getByRole("button", { name: "Send another enquiry" }).click();
    await expect(page.getByLabel(/^Name/)).toBeFocused();
    await expect(page.getByLabel(/^Name/)).toHaveValue("");
    await expect(page.getByLabel(/^Message/)).toHaveValue("");
    await expect(page.getByRole("radio", { name: "Project enquiry" })).not.toBeChecked();
  });

  test("the form can be submitted from the keyboard with Enter", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" });
    await fill(page);
    await page.getByLabel(/^Name/).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test("a slow request shows progress and blocks a second submission", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" }, { delayMs: 1200 });
    await fill(page);
    await submit(page).click();
    await expect(page.getByRole("button", { name: /sending/i })).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByText("Sending your enquiry, please wait.")).toBeAttached();
    await page.getByRole("button", { name: /sending/i }).click({ force: true });
    await page.getByRole("button", { name: /sending/i }).click({ force: true });
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test("server-side validation errors are shown against the right fields", async ({ page }) => {
    await mockApi(page, 422, { status: "invalid", errors: { email: "Enter an email address in the format name@example.com." } });
    await fill(page);
    await submit(page).click();
    await expect(page.getByRole("alert").filter({ hasText: "There is a problem" })).toBeFocused();
    await expect(page.getByLabel(/^Business email/)).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel(/^Name/)).not.toHaveAttribute("aria-invalid", "true");
  });

  test("a delivery failure keeps the visitor's text and offers email and phone instead", async ({ page }) => {
    await mockApi(page, 502, { status: "failed" });
    await fill(page);
    await submit(page).click();

    const alert = page.getByRole("alert").filter({ hasText: "Your enquiry was not sent" });
    await expect(alert).toBeVisible();
    await expect(alert).toBeFocused();
    await expect(alert.getByRole("link", { name: site.contact.email })).toHaveAttribute("href", `mailto:${site.contact.email}`);
    await expect(alert).toContainText(site.contact.phone);
    await expect(page.getByLabel(/^Message/)).toHaveValue(valid.message);
    await expect(page.getByLabel(/^Name/)).toHaveValue(valid.name);
  });

  test("after a failure the visitor can retry and succeed", async ({ page }) => {
    let attempts = 0;
    await page.route("**/api/enquiry", async (route) => {
      attempts += 1;
      await route.fulfill(
        attempts === 1
          ? { status: 502, contentType: "application/json", body: JSON.stringify({ status: "failed" }) }
          : { status: 200, contentType: "application/json", body: JSON.stringify({ status: "sent" }) },
      );
    });
    await fill(page);
    await submit(page).click();
    await expect(page.getByText("Your enquiry was not sent")).toBeVisible();
    await submit(page).click();
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(attempts).toBe(2);
  });

  test("a dropped network connection is handled like any other failure", async ({ page }) => {
    await page.route("**/api/enquiry", (route) => route.abort("connectionfailed"));
    await fill(page);
    await submit(page).click();
    await expect(page.getByText("Your enquiry was not sent")).toBeVisible();
    await expect(page.getByLabel(/^Message/)).toHaveValue(valid.message);
  });

  test("an unexpected non-JSON reply is handled as a failure, not a crash", async ({ page }) => {
    await page.route("**/api/enquiry", (route) => route.fulfill({ status: 500, contentType: "text/html", body: "<h1>Oops</h1>" }));
    await fill(page);
    await submit(page).click();
    await expect(page.getByText("Your enquiry was not sent")).toBeVisible();
  });

  test("text that looks like markup is submitted as text and never executed", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" });
    let dialogs = 0;
    page.on("dialog", async (dialog) => {
      dialogs += 1;
      await dialog.dismiss();
    });
    await fill(page, { name: '<img src=x onerror="alert(1)">', message: "<script>alert(1)</script> and more text" });
    await submit(page).click();
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(requests[0].name).toBe('<img src=x onerror="alert(1)">');
    expect(dialogs).toBe(0);
  });
});

test.describe("against the real server (production rules)", () => {
  test("a valid enquiry is refused honestly while no destination or privacy notice exists", async ({ page }) => {
    await fill(page);
    await submit(page).click();
    const alert = page.getByRole("alert").filter({ hasText: "Your enquiry was not sent" });
    await expect(alert).toBeVisible();
    await expect(alert.getByRole("link", { name: site.contact.email })).toBeVisible();
    await expect(page.getByText(site.enquiry.successHeading)).toHaveCount(0);
  });

  test("a bot that fills the hidden field is refused and shown no success", async ({ page }) => {
    await fill(page);
    await page.locator('input[name="kr_contact_preference"]').evaluate((input: HTMLInputElement) => {
      input.value = "spam";
    });
    await submit(page).click();
    await expect(page.getByText("Your enquiry was not sent")).toBeVisible();
    await expect(page.getByText(site.enquiry.successHeading)).toHaveCount(0);
  });

  test("real server validation catches what the browser let through", async ({ page }) => {
    const response = await page.evaluate(async () => {
      const result = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "A", email: "bad", topic: "Careers", message: "long enough message" }),
      });
      return { status: result.status, body: await result.json() };
    });
    expect(response.status).toBe(422);
    expect(Object.keys(response.body.errors)).toEqual(["email"]);
  });
});

test.describe("accessibility of every form state", () => {
  const wcag = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];
  // The preview banner exists only in the review build and sits outside any landmark, so it is excluded.
  const scan = async (page: Page) => {
    await scrollThrough(page); // let reveal animations finish so contrast is measured on settled text
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page }).withTags(wcag).exclude(".preview-banner").analyze();
    return results.violations.map((violation) => ({
      rule: violation.id,
      nodes: violation.nodes.slice(0, 3).map((node) => node.target.join(" ")),
    }));
  };

  test("empty form", async ({ page }) => {
    expect(await scan(page)).toEqual([]);
  });

  test("form showing validation errors", async ({ page }) => {
    await submit(page).click();
    await page.waitForTimeout(600);
    expect(await scan(page)).toEqual([]);
  });

  test("failure notice", async ({ page }) => {
    await mockApi(page, 502, { status: "failed" });
    await fill(page);
    await submit(page).click();
    await expect(page.getByText("Your enquiry was not sent")).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });

  test("success message", async ({ page }) => {
    await mockApi(page, 200, { status: "sent" });
    await fill(page);
    await submit(page).click();
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(await scan(page)).toEqual([]);
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: viewports.mobile });

  test("the form fits the screen and can be completed and sent", async ({ page }) => {
    const requests = await mockApi(page, 200, { status: "sent" });
    await page.goto("/contact");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    await fill(page);
    await submit(page).scrollIntoViewIfNeeded();
    await submit(page).click();
    await expect(page.getByRole("heading", { name: site.enquiry.successHeading })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test("tap targets for the enquiry type and submit are at least 44px tall", async ({ page }) => {
    await page.goto("/contact");
    for (const locator of [submit(page), page.locator("label").filter({ hasText: "Careers" }).first()]) {
      const box = await locator.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
  });
});
