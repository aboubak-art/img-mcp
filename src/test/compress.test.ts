import { describe, it } from "node:test";
import assert from "node:assert";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import { compressImage, saveImageToDisk } from "../utils/image.js";

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

describe("compressImage", () => {
  it("compresses with a lower quality", async () => {
    const image = await createTestImage(200, 100);
    const highQuality = await compressImage({ image, quality: 90, format: "jpeg" });
    const lowQuality = await compressImage({ image, quality: 30, format: "jpeg" });
    assert.ok(
      Buffer.from(lowQuality.data, "base64").length <
        Buffer.from(highQuality.data, "base64").length,
      "Lower quality should produce a smaller file"
    );
    assert.strictEqual(lowQuality.mimeType, "image/jpeg");
  });

  it("converts format while compressing", async () => {
    const image = await createTestImage(20, 10);
    const compressed = await compressImage({ image, format: "webp", quality: 80 });
    assert.strictEqual(compressed.mimeType, "image/webp");
  });

  it("targets a specific file size", async () => {
    const image = await createTestImage(400, 200);
    const targetSize = 8 * 1024; // 8 KB
    const compressed = await compressImage({ image, format: "jpeg", target_size: targetSize });
    assert.strictEqual(compressed.mimeType, "image/jpeg");
    assert.ok(
      Buffer.from(compressed.data, "base64").length <= targetSize,
      `Compressed image should be at most ${targetSize} bytes`
    );
  });

  it("loads an image from a file path and compresses", async () => {
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

      const compressed = await compressImage({ image: filePath, format: "webp", quality: 80 });
      assert.strictEqual(compressed.mimeType, "image/webp");
    });
  });

  it("saves compressed output to disk", async () => {
    await withTempDir(async (dir) => {
      const image = await createTestImage(20, 10);
      const outputPath = join(dir, "compressed.webp");
      const compressed = await compressImage({ image, format: "webp", quality: 80 });
      await saveImageToDisk(compressed, outputPath);
      const contents = await readFile(outputPath);
      assert.ok(contents.length > 0);
    });
  });

  it("throws when target_size is used with a lossless format", async () => {
    const image = await createTestImage(20, 10);
    await assert.rejects(
      async () => compressImage({ image, format: "png", target_size: 1024 }),
      /target_size is only supported for lossy formats/
    );
  });
});
