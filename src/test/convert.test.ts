import { describe, it } from "node:test";
import assert from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { convertImage, saveImageToDisk } from "../utils/image.js";

async function createTestImage(width: number, height: number): Promise<string> {
  const buffer = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 255, g: 0, b: 0 },
    },
  })
    .png()
    .toBuffer();
  return buffer.toString("base64");
}

async function withTempDir<T>(callback: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "img-mcp-test-"));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("convertImage", () => {
  it("converts PNG to JPEG", async () => {
    const image = await createTestImage(10, 10);
    const converted = await convertImage({ image, format: "jpeg" });
    assert.strictEqual(converted.mimeType, "image/jpeg");
    const buffer = Buffer.from(converted.data, "base64");
    const metadata = await sharp(buffer).metadata();
    assert.strictEqual(metadata.format, "jpeg");
  });

  it("converts PNG to WebP", async () => {
    const image = await createTestImage(10, 10);
    const converted = await convertImage({ image, format: "webp" });
    assert.strictEqual(converted.mimeType, "image/webp");
  });

  it("converts an image loaded from a file path", async () => {
    await withTempDir(async (dir) => {
      const filePath = join(dir, "source.png");
      const buffer = await sharp({
        create: {
          width: 20,
          height: 10,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer();
      await writeFile(filePath, buffer);

      const converted = await convertImage({ image: filePath, format: "webp" });
      assert.strictEqual(converted.mimeType, "image/webp");
    });
  });

  it("saves converted output to disk", async () => {
    await withTempDir(async (dir) => {
      const image = await createTestImage(20, 10);
      const outputPath = join(dir, "converted.webp");
      const converted = await convertImage({ image, format: "webp" });
      await saveImageToDisk(converted, outputPath);
      const contents = await readFile(outputPath);
      assert.ok(contents.length > 0);
    });
  });
});
