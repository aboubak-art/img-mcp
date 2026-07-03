import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { parseImageInput, generateImages } from "../providers/google.js";

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

  describe("generateImages", () => {
    let originalFetch: typeof global.fetch;
    let originalApiKey: string | undefined;

    before(() => {
      originalFetch = global.fetch;
      originalApiKey = process.env.GOOGLE_API_KEY;
      process.env.GOOGLE_API_KEY = "test-api-key";
    });

    after(() => {
      global.fetch = originalFetch;
      process.env.GOOGLE_API_KEY = originalApiKey;
    });

    it("suggests checking image_size when the API returns 404", async () => {
      global.fetch = async () =>
        new Response(JSON.stringify({ error: { message: "Requested entity was not found.", status: "404" } }), {
          status: 404,
          statusText: "Not Found",
        });

      await assert.rejects(
        () =>
          generateImages({
            prompt: "a red cube",
            model: "gemini-3.1-flash-image",
            n: 1,
            aspectRatio: "1:1",
            imageSize: "2K",
          }),
        (err: Error) => {
          assert.ok(err.message.includes("Google API error (404): Requested entity was not found."));
          assert.ok(err.message.includes("does not support image_size '2K'"));
          assert.ok(err.message.includes("Try '1K'"));
          assert.ok(err.message.includes("gemini-3-pro-image"));
          return true;
        }
      );
    });

    it("does not add image_size hint for non-404 errors", async () => {
      global.fetch = async () =>
        new Response(JSON.stringify({ error: { message: "Invalid API key.", status: "400" } }), {
          status: 400,
          statusText: "Bad Request",
        });

      await assert.rejects(
        () =>
          generateImages({
            prompt: "a red cube",
            model: "gemini-3.1-flash-image",
            n: 1,
            aspectRatio: "1:1",
            imageSize: "2K",
          }),
        (err: Error) => {
          assert.ok(err.message.includes("Google API error (400): Invalid API key."));
          assert.ok(!err.message.includes("does not support image_size"));
          return true;
        }
      );
    });
  });
});
