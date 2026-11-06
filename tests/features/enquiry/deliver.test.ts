import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import {
  deliverEnquiry,
  formatEnquiryEmail,
  getDeliveryDestination,
  type DeliveryDestination,
} from "@/features/enquiry/deliver";
import { resetGraphTokenCache } from "@/features/enquiry/outlook";
import { emptyEnquiry } from "@/features/enquiry/validation";

const enquiry = {
  ...emptyEnquiry,
  name: "Test Person",
  email: "test@example.com",
  topic: "Project enquiry",
  message: "A message that is long enough.",
};

const webhook: DeliveryDestination = { kind: "webhook", url: "https://hooks.example.com/abc" };
const email: DeliveryDestination = {
  kind: "email",
  apiKey: "re_test_key",
  from: "Kings Rebar Website <enquiries@kingsrebar.com>",
  to: "info@kingsrebar.com",
};

const realFetch = globalThis.fetch;
const mutableEnv = process.env as Record<string, string | undefined>;
const envNames = [
  "OUTLOOK_TENANT_ID",
  "OUTLOOK_CLIENT_ID",
  "OUTLOOK_CLIENT_SECRET",
  "OUTLOOK_MAILBOX",
  "OUTLOOK_SMTP_PASSWORD",
  "OUTLOOK_SMTP_USER",
  "OUTLOOK_SMTP_HOST",
  "OUTLOOK_SMTP_PORT",
  "RESEND_API_KEY",
  "ENQUIRY_FROM_EMAIL",
  "ENQUIRY_TO_EMAIL",
  "ENQUIRY_WEBHOOK_URL",
  "ENQUIRY_WEBHOOK_TOKEN",
] as const;

type Call = { url: string; init: RequestInit };

function stubFetch(respond: () => Response | Promise<Response>): Call[] {
  const calls: Call[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(input), init: init ?? {} });
    return respond();
  }) as typeof fetch;
  return calls;
}

afterEach(() => {
  globalThis.fetch = realFetch;
  resetGraphTokenCache();
  for (const name of envNames) delete mutableEnv[name];
});

describe("deliverEnquiry (webhook)", () => {
  it("reports sent on a 2xx response and posts the enquiry as JSON", async () => {
    const calls = stubFetch(() => new Response(null, { status: 200 }));
    const result = await deliverEnquiry(enquiry, webhook);

    assert.equal(result, "sent");
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.url, "https://hooks.example.com/abc");
    assert.equal(calls[0]?.init.method, "POST");

    const body = JSON.parse(String(calls[0]?.init.body));
    assert.equal(body.name, enquiry.name);
    assert.equal(body.email, enquiry.email);
    assert.equal(body._to, "info@kingsrebar.com");
    assert.equal(body._replyto, enquiry.email);
    assert.equal(body._subject, `Website enquiry: ${enquiry.topic}`);
    assert.equal(body.source, "Kings Rebar website");
  });

  it("sends a bearer token only when one is configured", async () => {
    const calls = stubFetch(() => new Response(null, { status: 204 }));
    await deliverEnquiry(enquiry, { ...webhook, token: "secret" } as DeliveryDestination);
    await deliverEnquiry(enquiry, webhook);

    const withToken = calls[0]?.init.headers as Record<string, string>;
    const withoutToken = calls[1]?.init.headers as Record<string, string>;
    assert.equal(withToken.Authorization, "Bearer secret");
    assert.equal("Authorization" in withoutToken, false);
  });

  it("reports failed for non-2xx responses", async () => {
    stubFetch(() => new Response(null, { status: 500 }));
    assert.equal(await deliverEnquiry(enquiry, webhook), "failed");
  });

  it("reports failed when the request throws", async () => {
    stubFetch(() => Promise.reject(new Error("network down")));
    assert.equal(await deliverEnquiry(enquiry, webhook), "failed");
  });
});

describe("deliverEnquiry (email)", () => {
  it("emails the company inbox with the visitor as Reply-To", async () => {
    const calls = stubFetch(() => Response.json({ id: "abc" }, { status: 200 }));
    const result = await deliverEnquiry({ ...enquiry, company: "Acme Builders", phone: "+1 555 010 0000" }, email);

    assert.equal(result, "sent");
    assert.equal(calls[0]?.url, "https://api.resend.com/emails");
    assert.equal(calls[0]?.init.method, "POST");
    assert.equal((calls[0]?.init.headers as Record<string, string>).Authorization, "Bearer re_test_key");

    const body = JSON.parse(String(calls[0]?.init.body));
    assert.deepEqual(body.to, ["info@kingsrebar.com"]);
    assert.equal(body.from, email.kind === "email" ? email.from : "");
    assert.equal(body.reply_to, enquiry.email);
    assert.equal(body.subject, `Website enquiry: ${enquiry.topic}`);
    assert.match(body.text, /Name: Test Person/);
    assert.match(body.text, /Company: Acme Builders/);
    assert.match(body.text, /A message that is long enough\./);
    assert.equal("html" in body, false, "visitor input must never be sent as HTML");
  });

  it("reports failed when the email API rejects the request", async () => {
    stubFetch(() => Response.json({ message: "domain not verified" }, { status: 403 }));
    assert.equal(await deliverEnquiry(enquiry, email), "failed");
  });

  it("reports failed when the email API is unreachable", async () => {
    stubFetch(() => Promise.reject(new Error("network down")));
    assert.equal(await deliverEnquiry(enquiry, email), "failed");
  });
});

describe("deliverEnquiry (Outlook Graph)", () => {
  const graph: DeliveryDestination = {
    kind: "outlook-graph",
    config: {
      tenantId: "tenant-id",
      clientId: "client-id",
      clientSecret: "client-secret",
      mailbox: "info@kingsrebar.com",
      to: "info@kingsrebar.com",
    },
  };

  it("requests a Graph token then sends mail as the Outlook mailbox", async () => {
    const calls = stubFetch(() => {
      const url = calls.at(-1)?.url ?? "";
      if (url.includes("oauth2")) {
        return Response.json({ access_token: "token-1", expires_in: 3600 }, { status: 200 });
      }
      return new Response(null, { status: 202 });
    });

    const result = await deliverEnquiry(enquiry, graph);
    assert.equal(result, "sent");
    assert.equal(calls.length, 2);
    assert.match(calls[0]?.url ?? "", /login\.microsoftonline\.com\/tenant-id\/oauth2/);
    assert.equal(calls[1]?.url, "https://graph.microsoft.com/v1.0/users/info%40kingsrebar.com/sendMail");
    assert.equal((calls[1]?.init.headers as Record<string, string>).Authorization, "Bearer token-1");

    const body = JSON.parse(String(calls[1]?.init.body));
    assert.equal(body.message.toRecipients[0].emailAddress.address, "info@kingsrebar.com");
    assert.equal(body.message.replyTo[0].emailAddress.address, enquiry.email);
    assert.equal(body.message.body.contentType, "Text");
    assert.match(body.message.body.content, /Name: Test Person/);
    assert.equal(body.saveToSentItems, true);
  });

  it("reports failed when Microsoft rejects the token request", async () => {
    stubFetch(() => Response.json({ error: "invalid_client" }, { status: 401 }));
    assert.equal(await deliverEnquiry(enquiry, graph), "failed");
  });
});

describe("formatEnquiryEmail", () => {
  it("marks optional fields that were left blank", () => {
    const text = formatEnquiryEmail(enquiry);
    assert.match(text, /Company: Not provided/);
    assert.match(text, /Phone: Not provided/);
  });
});

describe("getDeliveryDestination", () => {
  it("returns null when nothing is configured", () => {
    assert.equal(getDeliveryDestination(), null);
    mutableEnv.ENQUIRY_WEBHOOK_URL = "   ";
    assert.equal(getDeliveryDestination(), null);
  });

  it("reads and trims the webhook URL and optional token", () => {
    mutableEnv.ENQUIRY_WEBHOOK_URL = " https://hooks.example.com/abc ";
    assert.deepEqual(getDeliveryDestination(), {
      kind: "webhook",
      url: "https://hooks.example.com/abc",
      token: undefined,
    });

    mutableEnv.ENQUIRY_WEBHOOK_TOKEN = " token ";
    assert.deepEqual(getDeliveryDestination(), {
      kind: "webhook",
      url: "https://hooks.example.com/abc",
      token: "token",
    });
  });

  it("prefers Outlook Graph when the Azure app is configured", () => {
    mutableEnv.OUTLOOK_TENANT_ID = " tenant ";
    mutableEnv.OUTLOOK_CLIENT_ID = " client ";
    mutableEnv.OUTLOOK_CLIENT_SECRET = " secret ";
    const destination = getDeliveryDestination();
    assert.equal(destination?.kind, "outlook-graph");
    if (destination?.kind === "outlook-graph") {
      assert.equal(destination.config.mailbox, "info@kingsrebar.com");
      assert.equal(destination.config.to, "info@kingsrebar.com");
      assert.equal(destination.config.tenantId, "tenant");
    }
  });

  it("uses Outlook SMTP when only a mailbox password is set", () => {
    mutableEnv.OUTLOOK_SMTP_PASSWORD = " app-password ";
    const destination = getDeliveryDestination();
    assert.equal(destination?.kind, "outlook-smtp");
    if (destination?.kind === "outlook-smtp") {
      assert.equal(destination.config.user, "info@kingsrebar.com");
      assert.equal(destination.config.from, "info@kingsrebar.com");
      assert.equal(destination.config.to, "info@kingsrebar.com");
      assert.equal(destination.config.host, "smtp.office365.com");
      assert.equal(destination.config.port, 587);
      assert.equal(destination.config.password, "app-password");
    }
  });

  it("prefers Graph over SMTP when both Outlook options are set", () => {
    mutableEnv.OUTLOOK_TENANT_ID = "tenant";
    mutableEnv.OUTLOOK_CLIENT_ID = "client";
    mutableEnv.OUTLOOK_CLIENT_SECRET = "secret";
    mutableEnv.OUTLOOK_SMTP_PASSWORD = "app-password";
    assert.equal(getDeliveryDestination()?.kind, "outlook-graph");
  });

  it("sends email to info@kingsrebar.com by default", () => {
    mutableEnv.RESEND_API_KEY = " re_key ";
    mutableEnv.ENQUIRY_FROM_EMAIL = " Kings Rebar Website <enquiries@kingsrebar.com> ";
    assert.deepEqual(getDeliveryDestination(), {
      kind: "email",
      apiKey: "re_key",
      from: "Kings Rebar Website <enquiries@kingsrebar.com>",
      to: "info@kingsrebar.com",
    });
  });

  it("allows the recipient to be overridden", () => {
    mutableEnv.RESEND_API_KEY = "re_key";
    mutableEnv.ENQUIRY_FROM_EMAIL = "enquiries@kingsrebar.com";
    mutableEnv.ENQUIRY_TO_EMAIL = "projects@kingsrebar.com";
    const destination = getDeliveryDestination();
    assert.equal(destination?.kind === "email" && destination.to, "projects@kingsrebar.com");
  });

  it("prefers Outlook over Resend when both are set", () => {
    mutableEnv.OUTLOOK_SMTP_PASSWORD = "app-password";
    mutableEnv.RESEND_API_KEY = "re_key";
    mutableEnv.ENQUIRY_FROM_EMAIL = "enquiries@kingsrebar.com";
    assert.equal(getDeliveryDestination()?.kind, "outlook-smtp");
  });

  it("prefers email over a webhook when both are set", () => {
    mutableEnv.RESEND_API_KEY = "re_key";
    mutableEnv.ENQUIRY_FROM_EMAIL = "enquiries@kingsrebar.com";
    mutableEnv.ENQUIRY_WEBHOOK_URL = "https://hooks.example.com/abc";
    assert.equal(getDeliveryDestination()?.kind, "email");
  });

  it("ignores a half-configured email setup and falls back to the webhook", () => {
    mutableEnv.RESEND_API_KEY = "re_key";
    assert.equal(getDeliveryDestination(), null);
    mutableEnv.ENQUIRY_WEBHOOK_URL = "https://hooks.example.com/abc";
    assert.equal(getDeliveryDestination()?.kind, "webhook");
  });
});
