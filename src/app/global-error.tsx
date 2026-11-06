"use client";

import { site } from "@/content/site";
import { serverError } from "@/content/pages/shared";

/**
 * Last-resort boundary for failures in the root layout. It replaces the whole
 * document, so it cannot rely on global styles or fonts and styles itself inline.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang={site.language}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#0b0f12",
          color: "#f6f4ef",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main style={{ maxWidth: "34rem" }}>
          <title>{`${serverError.title} | ${site.siteTitle}`}</title>
          <h1 style={{ margin: "0 0 1rem", fontSize: "2rem" }}>{serverError.title}</h1>
          <p role="alert" style={{ margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            {serverError.body}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              padding: "0.75rem 1.5rem",
              border: 0,
              borderRadius: "999px",
              background: "#e0672f",
              color: "#0b0f12",
              font: "inherit",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {serverError.retryLabel}
          </button>
        </main>
      </body>
    </html>
  );
}
