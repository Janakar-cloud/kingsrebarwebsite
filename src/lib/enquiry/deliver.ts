import "server-only";

import { site } from "@/content/site";
import type { EnquiryValues } from "./validation";

export type DeliveryResult = "sent" | "failed";

/**
 * Integration point for enquiry delivery.
 *
 * The enquiry is POSTed as JSON to ENQUIRY_WEBHOOK_URL. This works with
 * form/automation services that accept JSON webhooks (for example Formspree,
 * Zapier, Make or n8n) or with the client's own endpoint. To use an email API
 * instead, replace the body of this function; keep secrets in server-side
 * environment variables only.
 *
 * Only a success (2xx) response from the destination counts as sent.
 */
export async function deliverEnquiry(
  enquiry: EnquiryValues,
  destination: { url: string; token?: string },
): Promise<DeliveryResult> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (destination.token) headers.Authorization = `Bearer ${destination.token}`;

  try {
    const response = await fetch(destination.url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        source: `${site.companyName} website`,
        ...enquiry,
        _subject: `Website enquiry: ${enquiry.topic}`,
        _replyto: enquiry.email,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export function getDeliveryDestination(): { url: string; token?: string } | null {
  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!url) return null;
  const token = process.env.ENQUIRY_WEBHOOK_TOKEN?.trim() || undefined;
  return { url, token };
}
