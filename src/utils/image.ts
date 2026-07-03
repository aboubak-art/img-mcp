import { writeFile } from "node:fs/promises";
import { dirname, extname, basename, join } from "node:path";
import type { GeneratedImage } from "../types.js";

export const TRANSPARENT_BACKGROUND_COLOR = "#00FF00";

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

export function appendTransparentBackgroundPrompt(prompt: string): string {
  return `${prompt} The subject should be placed against a solid, uniform bright green background (hex ${TRANSPARENT_BACKGROUND_COLOR}) with no shadows, gradients, reflections, or additional objects in the background.`;
}

export async function removeImageBackground(
  image: GeneratedImage
): Promise<GeneratedImage> {
  const { removeBackground } = await import("@imgly/background-removal-node");
  const inputBuffer = Buffer.from(image.data, "base64");
  const blob = await removeBackground(inputBuffer, {
    output: { format: "image/png" },
  });
  const arrayBuffer = await blob.arrayBuffer();
  const outputBuffer = Buffer.from(arrayBuffer);
  return { data: outputBuffer.toString("base64"), mimeType: "image/png" };
}

export function ensurePngExtension(outputPath: string): string {
  if (extname(outputPath).toLowerCase() === ".png") return outputPath;
  return outputPath.replace(/\.[^/.]+$/, "") + ".png";
}
