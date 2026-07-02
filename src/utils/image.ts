import { writeFile } from "node:fs/promises";
import { dirname, extname, basename, join } from "node:path";
import type { GeneratedImage } from "../types.js";

export async function saveImageToDisk(
  image: GeneratedImage,
  outputPath: string
): Promise<void> {
  const buffer = Buffer.from(image.data, "base64");
  await writeFile(outputPath, buffer);
}

export async function saveImagesToDisk(
  images: GeneratedImage[],
  outputPath: string
): Promise<string[]> {
  if (images.length === 0) return [];

  const extension = extname(outputPath);
  const dir = dirname(outputPath);
  const baseName = basename(outputPath, extension);

  const paths: string[] = [];
  for (let i = 0; i < images.length; i++) {
    const filePath =
      images.length === 1
        ? outputPath
        : join(dir, `${baseName}_${i + 1}${extension}`);
    await saveImageToDisk(images[i], filePath);
    paths.push(filePath);
  }
  return paths;
}
