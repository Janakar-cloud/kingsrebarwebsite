/**
 * In-memory sliding-window limiter for enquiry submissions.
 * Works per server instance (fine for a single Node process; on multi-instance
 * hosts each instance has its own window, which still caps abuse per replica).
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

const DEFAULT_LIMIT = 8;
const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

function configuredLimit(): number {
  const raw = Number(process.env.ENQUIRY_RATE_LIMIT);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_LIMIT;
}

function configuredWindowMs(): number {
  const raw = Number(process.env.ENQUIRY_RATE_WINDOW_MS);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_WINDOW_MS;
}

/** Client IP from proxy headers, or a shared bucket when none is present. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 128);
  return "unknown";
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

/**
 * Records one attempt for `key` and reports whether it is still within the window.
 */
export function consumeRateLimit(key: string, now = Date.now()): RateLimitResult {
  const limit = configuredLimit();
  const windowMs = configuredWindowMs();
  const cutoff = now - windowMs;
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((time) => time > cutoff);

  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    const retryAfterMs = Math.max(1_000, (bucket.hits[0] ?? now) + windowMs - now);
    return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
  }

  bucket.hits.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

/** Clears all buckets. Used by tests. */
export function resetRateLimit() {
  buckets.clear();
}
