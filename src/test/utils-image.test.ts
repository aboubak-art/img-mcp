import { describe, it } from "node:test";
import assert from "node:assert";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { saveImagesToDisk } from "../utils/image.js";

async function withTempDir<T>(callback: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "img-mcp-test-"));
  try {
    return await callback(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("utils/image", () => {
  describe("saveImagesToDisk", () => {
    it("saves a single image to the exact output path", async () => {
      await withTempDir(async (dir) => {
        const outputPath = join(dir, "image.png");
        const paths = await saveImagesToDisk(
          [{ data: "aGVsbG8=", mimeType: "image/png" }],
          outputPath
        );
        assert.deepStrictEqual(paths, [outputPath]);
        const contents = await readFile(outputPath);
        assert.strictEqual(contents.toString(), "hello");
      });
    });

    it("saves multiple images with numbered suffixes", async () => {
      await withTempDir(async (dir) => {
        const outputPath = join(dir, "image.png");
        const paths = await saveImagesToDisk(
          [
            { data: "aGVsbG8=", mimeType: "image/png" },
            { data: "d29ybGQ=", mimeType: "image/png" },
          ],
          outputPath
        );
        assert.deepStrictEqual(paths, [
          join(dir, "image_1.png"),
          join(dir, "image_2.png"),
        ]);
        assert.strictEqual((await readFile(paths[0])).toString(), "hello");
        assert.strictEqual((await readFile(paths[1])).toString(), "world");
      });
    });

    it("returns an empty array when no images are provided", async () => {
      await withTempDir(async (dir) => {
        const paths = await saveImagesToDisk([], join(dir, "image.png"));
        assert.deepStrictEqual(paths, []);
      });
    });
  });
});
