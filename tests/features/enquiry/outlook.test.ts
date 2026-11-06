import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildSmtpData } from "@/features/enquiry/outlook";

describe("buildSmtpData", () => {
  it("builds a plain-text message with Reply-To and no HTML", () => {
    const data = buildSmtpData("info@kingsrebar.com", "info@kingsrebar.com", {
      subject: "Website enquiry: Project enquiry",
      text: "A new enquiry was submitted.\nName: Test Person",
      replyTo: "test@example.com",
    });

    assert.match(data, /^From: Kings Rebar Website <info@kingsrebar.com>/m);
    assert.match(data, /^To: info@kingsrebar.com/m);
    assert.match(data, /^Reply-To: test@example.com/m);
    assert.match(data, /^Content-Type: text\/plain; charset=UTF-8/m);
    assert.doesNotMatch(data, /<html|text\/html/i);

    const encoded = data.split("\r\n\r\n")[1] ?? "";
    const body = Buffer.from(encoded.replace(/\s/g, ""), "base64").toString("utf8");
    assert.match(body, /Name: Test Person/);
  });
});
