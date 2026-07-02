import { describe, it } from "node:test";
import assert from "node:assert";
import { parseImageInput } from "../providers/google.js";

describe("google provider", () => {
  describe("parseImageInput", () => {
    it("parses a base64 data URI into data and mime type", () => {
      const parsed = parseImageInput("data:image/png;base64,abc123");
      assert.strictEqual(parsed.mimeType, "image/png");
      assert.strictEqual(parsed.data, "abc123");
    });

    it("defaults to image/png for plain base64 strings", () => {
      const parsed = parseImageInput("abc123");
      assert.strictEqual(parsed.mimeType, "image/png");
      assert.strictEqual(parsed.data, "abc123");
    });

    it("preserves the mime type from a JPEG data URI", () => {
      const parsed = parseImageInput("data:image/jpeg;base64,/9j/4AAQ");
      assert.strictEqual(parsed.mimeType, "image/jpeg");
      assert.strictEqual(parsed.data, "/9j/4AAQ");
    });
  });
});
