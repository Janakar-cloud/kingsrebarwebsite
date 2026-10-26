import { isProduction } from "@/config/env";
import { site } from "@/content/site";
import { isApproved } from "@/content/types";
import { deliverEnquiry, getDeliveryDestination } from "@/features/enquiry/deliver";
import {
  honeypotField,
  normaliseEnquiry,
  validateEnquiry,
  type EnquiryResponse,
} from "@/features/enquiry/validation";

const maxBodyBytes = 20_000;

function reply(body: EnquiryResponse, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return reply({ status: "failed" }, 403);

  const raw = await request.text();
  if (raw.length > maxBodyBytes) return reply({ status: "failed" }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return reply({ status: "failed" }, 400);
  }

  const honeypot = (payload as Record<string, unknown> | null)?.[honeypotField];
  if (typeof honeypot === "string" && honeypot.length > 0) {
    return reply({ status: "failed" }, 400);
  }

  const enquiry = normaliseEnquiry(payload);
  const errors = validateEnquiry(enquiry, site.enquiry.topics);
  if (Object.keys(errors).length > 0) return reply({ status: "invalid", errors }, 422);

  if (!isProduction) {
    const simulate = process.env.ENQUIRY_DEV_SIMULATE;
    if (simulate === "success") return reply({ status: "sent", simulated: true }, 200);
    if (simulate === "failure") return reply({ status: "failed" }, 502);
  }

  const destination = getDeliveryDestination();
  const privacyApproved = isApproved(site.enquiry.privacyNotice);

  if (!destination || (isProduction && !privacyApproved)) {
    if (!isProduction) return reply({ status: "not-sent-development" }, 200);
    console.error("Enquiry rejected: delivery destination or privacy notice not configured.");
    return reply({ status: "unavailable" }, 503);
  }

  const result = await deliverEnquiry(enquiry, destination);
  if (result === "sent") return reply({ status: "sent" }, 200);

  console.error("Enquiry delivery failed: destination did not confirm receipt.");
  return reply({ status: "failed" }, 502);
}
