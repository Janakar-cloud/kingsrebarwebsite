import "server-only";

import { site } from "@/content/site";
import {
  defaultSmtpHost,
  defaultSmtpPort,
  sendOutlookGraphMail,
  sendOutlookSmtpMail,
  type OutlookGraphConfig,
  type OutlookSmtpConfig,
} from "./outlook";
import type { EnquiryValues } from "./validation";

export type DeliveryResult = "sent" | "failed";

/**
 * Where an enquiry is sent.
 * Outlook (Microsoft 365 mailbox) is the UAT/production path; Resend and a
 * webhook remain as fallbacks.
 */
export type DeliveryDestination =
  | { kind: "outlook-graph"; config: OutlookGraphConfig }
  | { kind: "outlook-smtp"; config: OutlookSmtpConfig }
  | { kind: "email"; apiKey: string; from: string; to: string }
  | { kind: "webhook"; url: string; token?: string };

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 10_000;

const defaultMailbox = site.contact.email;

/** Plain-text body for the notification email. Visitor input is never rendered as HTML. */
export function formatEnquiryEmail(enquiry: EnquiryValues): string {
  return [
    "A new enquiry was submitted on the Kings Rebar website.",
    "",
    `Enquiry type: ${enquiry.topic}`,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Company: ${enquiry.company || "Not provided"}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    "",
    "Message:",
    enquiry.message,
    "",
    `Reply to this email to respond to ${enquiry.name}.`,
  ].join("\n");
}

function enquiryMessage(enquiry: EnquiryValues) {
  return {
    subject: `Website enquiry: ${enquiry.topic}`,
    text: formatEnquiryEmail(enquiry),
    replyTo: enquiry.email,
  };
}

async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<DeliveryResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

/**
 * Delivers an enquiry. Only a success (2xx, or SMTP 250) from the destination
 * counts as sent, so a visitor is never told their enquiry arrived when it did not.
 */
export async function deliverEnquiry(
  enquiry: EnquiryValues,
  destination: DeliveryDestination,
): Promise<DeliveryResult> {
  const message = enquiryMessage(enquiry);

  if (destination.kind === "outlook-graph") {
    return sendOutlookGraphMail(destination.config, message);
  }

  if (destination.kind === "outlook-smtp") {
    return sendOutlookSmtpMail(destination.config, message);
  }

  if (destination.kind === "email") {
    return postJson(
      RESEND_ENDPOINT,
      { Authorization: `Bearer ${destination.apiKey}` },
      {
        from: destination.from,
        to: [destination.to],
        reply_to: enquiry.email,
        subject: message.subject,
        text: message.text,
      },
    );
  }

  return postJson(
    destination.url,
    destination.token ? { Authorization: `Bearer ${destination.token}` } : {},
    {
      source: `${site.companyName} website`,
      ...enquiry,
      _to: site.contact.email,
      _subject: message.subject,
      _replyto: enquiry.email,
    },
  );
}

function mailboxAddress() {
  return process.env.OUTLOOK_MAILBOX?.trim() || process.env.ENQUIRY_FROM_EMAIL?.trim() || defaultMailbox;
}

function recipientAddress() {
  return process.env.ENQUIRY_TO_EMAIL?.trim() || defaultMailbox;
}

/**
 * Reads the delivery destination from server-side environment variables.
 * Outlook Graph wins, then Outlook SMTP, then Resend, then a webhook.
 * null means nothing is set up.
 */
export function getDeliveryDestination(): DeliveryDestination | null {
  const tenantId = process.env.OUTLOOK_TENANT_ID?.trim();
  const clientId = process.env.OUTLOOK_CLIENT_ID?.trim();
  const clientSecret = process.env.OUTLOOK_CLIENT_SECRET?.trim();
  if (tenantId && clientId && clientSecret) {
    const mailbox = mailboxAddress();
    return {
      kind: "outlook-graph",
      config: { tenantId, clientId, clientSecret, mailbox, to: recipientAddress() },
    };
  }

  const password = process.env.OUTLOOK_SMTP_PASSWORD?.trim();
  if (password) {
    const mailbox = mailboxAddress();
    return {
      kind: "outlook-smtp",
      config: {
        host: process.env.OUTLOOK_SMTP_HOST?.trim() || defaultSmtpHost(),
        port: Number(process.env.OUTLOOK_SMTP_PORT) || defaultSmtpPort(),
        user: process.env.OUTLOOK_SMTP_USER?.trim() || mailbox,
        password,
        from: mailbox,
        to: recipientAddress(),
      },
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim();
  if (apiKey && from) {
    return { kind: "email", apiKey, from, to: recipientAddress() };
  }

  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!url) return null;
  const token = process.env.ENQUIRY_WEBHOOK_TOKEN?.trim() || undefined;
  return { kind: "webhook", url, token };
}
