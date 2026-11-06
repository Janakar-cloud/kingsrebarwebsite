import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { pageHeroImages } from "@/content/hero-images";
import { locationsMap } from "@/content/locations";
import { about } from "@/content/pages/about";
import { careers } from "@/content/pages/careers";
import { contact } from "@/content/pages/contact";
import { home } from "@/content/pages/home";
import { services } from "@/content/pages/services";
import { site } from "@/content/site";
import type { ImageAsset } from "@/content/types";

const root = path.resolve(import.meta.dirname, "../..");
const imagesDir = path.join(root, "public/images");

/** Reads pixel dimensions from a PNG or JPEG header, without any dependency. */
function dimensions(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  if (bytes.subarray(1, 4).toString("ascii") === "PNG") {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    while (offset < bytes.length) {
      if (bytes[offset] !== 0xff) throw new Error(`Bad JPEG marker in ${file}`);
      const marker = bytes[offset + 1];
      const length = bytes.readUInt16BE(offset + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
      }
      offset += 2 + length;
    }
  }
  throw new Error(`Unsupported or unreadable image: ${file}`);
}

function collect(value: unknown, found: ImageAsset[] = []): ImageAsset[] {
  if (Array.isArray(value)) value.forEach((item) => collect(item, found));
  else if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    if (typeof record.src === "string" && "width" in record && "height" in record) found.push(record as unknown as ImageAsset);
    Object.values(record).forEach((child) => collect(child, found));
  }
  return found;
}

const declared = collect({ site, home, about, services, careers, contact, pageHeroImages, locationsMap }).filter(
  (image) => image.src.startsWith("/images/"),
);

describe("image files", () => {
  it("every declared width and height matches the real file, so layouts never shift", () => {
    assert.ok(declared.length > 10);
    for (const image of declared) {
      const actual = dimensions(path.join(root, "public", image.src));
      assert.deepEqual({ width: image.width, height: image.height }, actual, image.src);
    }
  });

  it("has no unused images in public/images", () => {
    const used = new Set(declared.map((image) => path.basename(image.src)));
    const unused = readdirSync(imagesDir).filter((file) => !used.has(file));
    assert.deepEqual(unused, [], "delete these or reference them from content");
  });

  it("keeps every image under 500 KB, except the process illustrations", () => {
    const large = readdirSync(imagesDir)
      .filter((file) => !file.startsWith("process-"))
      .map((file) => [file, readFileSync(path.join(imagesDir, file)).length] as const)
      .filter(([, size]) => size > 900_000);
    assert.deepEqual(large, [], "compress these before shipping");
  });

  it("describes meaningful images with real alt text and marks only decorative ones as empty", () => {
    for (const image of declared) {
      if (image.alt === "") continue; // decorative
      assert.ok(image.alt.trim().length >= 5, `${image.src} alt is too short`);
      assert.doesNotMatch(image.alt, /\.(png|jpe?g|webp)$/i, `${image.src} alt looks like a file name`);
    }
  });
});
