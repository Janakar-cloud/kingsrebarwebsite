import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

// ImageResponse renders through Satori, which only understands plain <img>
// elements, so next/image is not an option in this file.
/* eslint-disable @next/next/no-img-element */

export const alt = "Kings Rebar, rebar detailing and estimation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Sharing card built from the approved logo and lion mark on the site steel. */
export default async function OpenGraphImage() {
  const [logoFile, markFile] = await Promise.all([
    readFile(join(process.cwd(), "public/images/logo.png")),
    readFile(join(process.cwd(), "public/images/mark.png")),
  ]);
  const logo = `data:image/png;base64,${logoFile.toString("base64")}`;
  const mark = `data:image/png;base64,${markFile.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0b0f12 0%, #161d23 64%, #1c1612 100%)",
          color: "#eef1f3",
        }}
      >
        <img
          src={mark}
          alt=""
          width={540}
          height={540}
          style={{
            position: "absolute",
            right: -48,
            top: 28,
            opacity: 0.2,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
            padding: "72px 80px",
          }}
        >
          <img src={logo} alt="Kings Rebar" width={460} height={272} />
          <div
            style={{
              display: "flex",
              width: 120,
              height: 6,
              marginTop: 36,
              borderRadius: 4,
              background: "#e0672f",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 26,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#a3aeb8",
            }}
          >
            Detailing and estimation
          </div>
        </div>
      </div>
    ),
    size,
  );
}
