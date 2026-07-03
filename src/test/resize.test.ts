import { describe, it } from "node:test";
import assert from "node:assert";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { resizeImage, saveImageToDisk } from "../utils/image.js";

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

async function getDimensions(base64: string): Promise<{ width: number; height: number }> {
  const buffer = Buffer.from(base64, "base64");
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}

describe("resizeImage", () => {
  it("resizes by width while maintaining aspect ratio", async () => {
    const image = await createTestImage(200, 100);
    const resized = await resizeImage({ image, width: 100 });
    const dimensions = await getDimensions(resized.data);
    assert.strictEqual(dimensions.width, 100);
    assert.strictEqual(dimensions.height, 50);
    assert.strictEqual(resized.mimeType, "image/png");
  });

  it("resizes by height while maintaining aspect ratio", async () => {
    const image = await createTestImage(200, 100);
    const resized = await resizeImage({ image, height: 50 });
    const dimensions = await getDimensions(resized.data);
    assert.strictEqual(dimensions.width, 100);
    assert.strictEqual(dimensions.height, 50);
  });

  it("resizes by scale factor", async () => {
    const image = await createTestImage(200, 100);
    const resized = await resizeImage({ image, scale: 0.5 });
    const dimensions = await getDimensions(resized.data);
    assert.strictEqual(dimensions.width, 100);
    assert.strictEqual(dimensions.height, 50);
  });

  it("crops to exact dimensions with cover fit", async () => {
    const image = await createTestImage(200, 100);
    const resized = await resizeImage({
      image,
      width: 100,
      height: 100,
      fit: "cover",
    });
    const dimensions = await getDimensions(resized.data);
    assert.strictEqual(dimensions.width, 100);
    assert.strictEqual(dimensions.height, 100);
  });

  it("converts to the requested format", async () => {
    const image = await createTestImage(10, 10);
    const resized = await resizeImage({ image, width: 5, format: "jpeg" });
    assert.strictEqual(resized.mimeType, "image/jpeg");
  });

  it("saves resized output to disk using saveImageToDisk", async () => {
    await withTempDir(async (dir) => {
      const image = await createTestImage(20, 10);
      const outputPath = join(dir, "resized.png");
      const resized = await resizeImage({ image, width: 10 });
      await saveImageToDisk(resized, outputPath);
      const contents = await readFile(outputPath);
      assert.ok(contents.length > 0);
    });
  });
});
