import { writeFile } from "node:fs/promises";
import { dirname, extname, basename, join } from "node:path";
import sharp from "sharp";
import type { GeneratedImage } from "../types.js";

export const TRANSPARENT_BACKGROUND_COLOR = "#00FF00";

export interface ParsedImageInput {
  data: string;
  mimeType: string;
}

export function parseImageInput(input: string): ParsedImageInput {
  const dataUriMatch = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.-]+);base64,(.*)$/.exec(
    input
  );
  if (dataUriMatch) {
    return { data: dataUriMatch[2] as string, mimeType: dataUriMatch[1] as string };
  }
  return { data: input, mimeType: "image/png" };
}

export interface ResizeOptions {
  image: string;
  width?: number;
  height?: number;
  scale?: number;
  fit?: "cover" | "contain" | "fill" | "inside" | "outside";
  format?: "jpeg" | "png" | "webp" | "avif" | "gif";
  quality?: number;
}

export async function resizeImage(options: ResizeOptions): Promise<GeneratedImage> {
  const { data, mimeType } = parseImageInput(options.image);
  const inputBuffer = Buffer.from(data, "base64");

  let pipeline = sharp(inputBuffer);

  const metadata = await pipeline.metadata();
  const originalWidth = metadata.width ?? 0;
  const originalHeight = metadata.height ?? 0;

  let targetWidth = options.width;
  let targetHeight = options.height;

  if (options.scale !== undefined) {
    if (targetWidth === undefined && originalWidth > 0) {
      targetWidth = Math.round(originalWidth * options.scale);
    }
    if (targetHeight === undefined && originalHeight > 0) {
      targetHeight = Math.round(originalHeight * options.scale);
    }
  }

  if (targetWidth !== undefined || targetHeight !== undefined) {
    const resizeOptions: sharp.ResizeOptions = {
      width: targetWidth,
      height: targetHeight,
    };
    if (targetWidth !== undefined && targetHeight !== undefined) {
      resizeOptions.fit = options.fit ?? "cover";
    }
    pipeline = pipeline.resize(resizeOptions);
  }

  const outputFormat = options.format ?? extensionFromMimeType(mimeType);
  let outputBuffer: Buffer;
  let outputMimeType: string;

  switch (outputFormat) {
    case "jpeg":
      outputBuffer = await pipeline
        .jpeg({ quality: options.quality ?? 80, mozjpeg: true })
        .toBuffer();
      outputMimeType = "image/jpeg";
      break;
    case "webp":
      outputBuffer = await pipeline
        .webp({ quality: options.quality ?? 80 })
        .toBuffer();
      outputMimeType = "image/webp";
      break;
    case "avif":
      outputBuffer = await pipeline
        .avif({ quality: options.quality ?? 80 })
        .toBuffer();
      outputMimeType = "image/avif";
      break;
    case "gif":
      outputBuffer = await pipeline.gif().toBuffer();
      outputMimeType = "image/gif";
      break;
    case "png":
    default:
      outputBuffer = await pipeline.png({ quality: options.quality }).toBuffer();
      outputMimeType = "image/png";
      break;
  }

  return { data: outputBuffer.toString("base64"), mimeType: outputMimeType };
}

function extensionFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
  };
  return map[mimeType] ?? "png";
}

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
  let removeBackground: (typeof import("@imgly/background-removal-node"))["removeBackground"];
  try {
    ({ removeBackground } = await import("@imgly/background-removal-node"));
  } catch (error) {
    throw new Error(
      "The transparent_background feature requires the optional peer dependency @imgly/background-removal-node. Install it with: npm install @imgly/background-removal-node"
    );
  }

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
