import type { NextConfig } from "next";

import { site } from "./src/content/site";

const isProduction = process.env.NODE_ENV === "production";

/** Origin of the approved analytics script, if one is configured. */
function analyticsOrigin(): string | null {
  if (!site.analytics) return null;
  try {
    return new URL(site.analytics.scriptSrc).origin;
  } catch {
    return null;
  }
}

/**
 * Content Security Policy for the prerendered pages.
 *
 * Pages are static, so a per-request nonce is not possible and inline scripts
 * (Next.js bootstrap, JSON-LD) need 'unsafe-inline'. Everything else is locked
 * to this origin. The analytics provider is allowed only when site.analytics is set.
 */
function contentSecurityPolicy(): string {
  const analytics = analyticsOrigin();
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${analytics ? ` ${analytics}` : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${analytics ? ` ${analytics}` : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];
  return directives.join("; ");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  // The development server needs eval and websockets, so the policy applies to production builds only.
  ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy() }] : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/products", destination: "/services", permanent: true },
      { source: "/quality-responsibility", destination: "/careers", permanent: true },
      { source: "/quality-and-responsibility", destination: "/careers", permanent: true },
    ];
  },
};

export default nextConfig;
