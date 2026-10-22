import { ImageResponse } from "next/og";

import { site } from "@/content/site";

// Typographic sharing image used until an approved 1200×630 image is supplied.
// Pages reference it through site.assets.socialImage; see that entry to replace it.

export const alt = site.companyName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          background: "#1f2a36",
          color: "#e8ecf0",
        }}
      >
        <div style={{ width: 160, height: 12, background: "#a14a24", marginBottom: 40 }} />
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {site.companyName}
        </div>
      </div>
    ),
    size,
  );
}
