import { describe, it } from "node:test";
import assert from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { loadImageInput, resizeImage, saveImageToDisk } from "../utils/image.js";

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

async function createTestImageFile(dir: string, width: number, height: number): Promise<string> {
  const filePath = join(dir, "source.png");
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
  await writeFile(filePath, buffer);
  return filePath;
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

describe("loadImageInput", () => {
  it("loads an image from a file path", async () => {
    await withTempDir(async (dir) => {
      const filePath = await createTestImageFile(dir, 20, 10);
      const parsed = await loadImageInput(filePath);
      assert.strictEqual(parsed.mimeType, "image/png");
      const buffer = Buffer.from(parsed.data, "base64");
      const metadata = await sharp(buffer).metadata();
      assert.strictEqual(metadata.width, 20);
      assert.strictEqual(metadata.height, 10);
    });
  });

  it("loads an image from a data URI", async () => {
    const image = await createTestImage(10, 10);
    const dataUri = `data:image/png;base64,${image}`;
    const parsed = await loadImageInput(dataUri);
    assert.strictEqual(parsed.mimeType, "image/png");
    assert.strictEqual(parsed.data, image);
  });

  it("falls back to raw base64 when input is not a file or URL", async () => {
    const image = await createTestImage(10, 10);
    const parsed = await loadImageInput(image);
    assert.strictEqual(parsed.mimeType, "image/png");
    assert.strictEqual(parsed.data, image);
  });
});

describe("resizeImage from file path", () => {
  it("resizes an image loaded from a file path", async () => {
    await withTempDir(async (dir) => {
      const filePath = await createTestImageFile(dir, 200, 100);
      const resized = await resizeImage({ image: filePath, width: 100 });
      const dimensions = await getDimensions(resized.data);
      assert.strictEqual(dimensions.width, 100);
      assert.strictEqual(dimensions.height, 50);
      assert.strictEqual(resized.mimeType, "image/png");
    });
  });
});
