import { expect, test } from "@playwright/test";

const validEnquiry = {
  name: "Asha Rao",
  email: "asha@example.com",
  company: "Rao Constructions",
  phone: "+91 98765 43210",
  topic: "Project enquiry",
  message: "We would like a quantity take-off for a four storey residential block.",
};

test.describe("POST /api/enquiry (production behaviour)", () => {
  test("rejects non-POST methods", async ({ request }) => {
    for (const method of ["get", "put", "delete"] as const) {
      const response = await request[method]("/api/enquiry");
      expect(response.status(), method).toBe(405);
    }
  });

  test("rejects malformed JSON", async ({ request }) => {
    const response = await request.post("/api/enquiry", {
      headers: { "Content-Type": "application/json" },
      data: Buffer.from("{not json"),
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ status: "failed" });
  });

  test("returns field errors for an empty submission", async ({ request }) => {
    const response = await request.post("/api/enquiry", { data: {} });
    expect(response.status()).toBe(422);
    const body = await response.json();
    expect(body.status).toBe("invalid");
    expect(Object.keys(body.errors).sort()).toEqual(["email", "message", "name", "topic"]);
  });

  test("validates each field independently", async ({ request }) => {
    const cases: Array<[string, Record<string, string>, string]> = [
      ["bad email", { ...validEnquiry, email: "not-an-email" }, "email"],
      ["short message", { ...validEnquiry, message: "too short" }, "message"],
      ["unknown topic", { ...validEnquiry, topic: "Free money" }, "topic"],
      ["bad phone", { ...validEnquiry, phone: "abc" }, "phone"],
      ["long name", { ...validEnquiry, name: "x".repeat(101) }, "name"],
      ["whitespace name", { ...validEnquiry, name: "     " }, "name"],
    ];
    for (const [label, data, field] of cases) {
      const response = await request.post("/api/enquiry", { data });
      expect(response.status(), label).toBe(422);
      expect(Object.keys((await response.json()).errors), label).toEqual([field]);
    }
  });

  test("silently refuses submissions that fill the hidden honeypot field", async ({ request }) => {
    const response = await request.post("/api/enquiry", {
      data: { ...validEnquiry, kr_contact_preference: "buy cheap watches" },
    });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ status: "failed" });
  });

  test("refuses oversized bodies", async ({ request }) => {
    const response = await request.post("/api/enquiry", {
      data: { ...validEnquiry, message: "a".repeat(30_000) },
    });
    expect(response.status()).toBe(413);
  });

  test("refuses cross-site requests", async ({ request }) => {
    const response = await request.post("/api/enquiry", {
      headers: { Origin: "https://evil.example" },
      data: validEnquiry,
    });
    expect(response.status()).toBe(403);
  });

  test("accepts same-origin requests that carry an Origin header", async ({ request, baseURL }) => {
    const response = await request.post("/api/enquiry", { headers: { Origin: baseURL! }, data: {} });
    expect(response.status()).toBe(422);
  });

  test("refuses to accept a valid enquiry until a destination and privacy notice exist", async ({ request }) => {
    const response = await request.post("/api/enquiry", { data: validEnquiry });
    expect(response.status()).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
  });

  test("never caches responses and never echoes input back", async ({ request }) => {
    const payload = { ...validEnquiry, name: "<script>alert(1)</script>", email: "bad" };
    const response = await request.post("/api/enquiry", { data: payload });
    expect(response.headers()["cache-control"]).toBe("no-store");
    expect(await response.text()).not.toContain("<script>");
  });

  test("ignores unknown properties instead of failing or leaking them", async ({ request }) => {
    const response = await request.post("/api/enquiry", { data: { ...validEnquiry, __proto__: { admin: true }, extra: "x" } });
    expect(response.status()).toBe(503);
  });
});
