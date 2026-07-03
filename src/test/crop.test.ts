import { describe, it } from "node:test";
import assert from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { cropImage, saveImageToDisk } from "../utils/image.js";

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

describe("cropImage", () => {
  it("crops by exact coordinates", async () => {
    const image = await createTestImage(200, 100);
    const cropped = await cropImage({ image, left: 50, top: 25, width: 100, height: 50 });
    const dimensions = await getDimensions(cropped.data);
    assert.strictEqual(dimensions.width, 100);
    assert.strictEqual(dimensions.height, 50);
    assert.strictEqual(cropped.mimeType, "image/png");
  });

  it("crops by gravity", async () => {
    const image = await createTestImage(200, 100);
    const cropped = await cropImage({ image, width: 100, height: 100, gravity: "center" });
    const dimensions = await getDimensions(cropped.data);
    assert.strictEqual(dimensions.width, 100);
    assert.strictEqual(dimensions.height, 100);
  });

  it("converts format while cropping", async () => {
    const image = await createTestImage(20, 10);
    const cropped = await cropImage({
      image,
      left: 0,
      top: 0,
      width: 10,
      height: 10,
      format: "jpeg",
    });
    assert.strictEqual(cropped.mimeType, "image/jpeg");
  });

  it("loads an image from a file path and crops", async () => {
    await withTempDir(async (dir) => {
      const filePath = join(dir, "source.png");
      const buffer = await sharp({
        create: {
          width: 200,
          height: 100,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer();
      await writeFile(filePath, buffer);

      const cropped = await cropImage({ image: filePath, width: 100, height: 100, gravity: "center" });
      const dimensions = await getDimensions(cropped.data);
      assert.strictEqual(dimensions.width, 100);
      assert.strictEqual(dimensions.height, 100);
    });
  });

  it("saves cropped output to disk", async () => {
    await withTempDir(async (dir) => {
      const image = await createTestImage(20, 10);
      const outputPath = join(dir, "cropped.png");
      const cropped = await cropImage({
        image,
        left: 0,
        top: 0,
        width: 10,
        height: 10,
      });
      await saveImageToDisk(cropped, outputPath);
      const contents = await readFile(outputPath);
      assert.ok(contents.length > 0);
    });
  });
});
