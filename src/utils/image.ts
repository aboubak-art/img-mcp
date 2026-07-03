import { readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, basename, join } from "node:path";
import sharp, { type ResizeOptions as SharpResizeOptions, type Sharp } from "sharp";
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

function mimeTypeFromExtension(pathOrUrl: string): string {
  const ext = extname(new URL(pathOrUrl, "file:").pathname).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
  };
  return map[ext] ?? "image/png";
}

function looksLikeUrl(input: string): boolean {
  return /^https?:\/\//i.test(input);
}

async function loadImageFromUrl(url: string): Promise<ParsedImageInput> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${url}: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const data = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = response.headers.get("content-type")?.split(";")[0].trim() ?? mimeTypeFromExtension(url);
  return { data, mimeType };
}

async function loadImageFromFile(filePath: string): Promise<ParsedImageInput> {
  const buffer = await readFile(filePath);
  return {
    data: buffer.toString("base64"),
    mimeType: mimeTypeFromExtension(filePath),
  };
}

async function tryLoadImageFromFile(input: string): Promise<ParsedImageInput | null> {
  try {
    const stats = await stat(input);
    if (stats.isFile()) {
      return await loadImageFromFile(input);
    }
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error.code === "ENOENT" || error.code === "ENAMETOOLONG")
    ) {
      return null;
    }
    throw error;
  }
  return null;
}

export async function loadImageInput(input: string): Promise<ParsedImageInput> {
  const dataUriMatch = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.-]+);base64,(.*)$/.exec(input);
  if (dataUriMatch) {
    return { data: dataUriMatch[2] as string, mimeType: dataUriMatch[1] as string };
  }

  if (looksLikeUrl(input)) {
    return loadImageFromUrl(input);
  }

  const fileResult = await tryLoadImageFromFile(input);
  if (fileResult) {
    return fileResult;
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

export interface ConvertOptions {
  image: string;
  format: "jpeg" | "png" | "webp" | "avif" | "gif";
  quality?: number;
}

async function applyOutputFormat(
  pipeline: Sharp,
  outputFormat: "jpeg" | "png" | "webp" | "avif" | "gif",
  quality?: number
): Promise<GeneratedImage> {
  let outputBuffer: Buffer;
  let outputMimeType: string;

  switch (outputFormat) {
    case "jpeg":
      outputBuffer = await pipeline
        .jpeg({ quality: quality ?? 80, mozjpeg: true })
        .toBuffer();
      outputMimeType = "image/jpeg";
      break;
    case "webp":
      outputBuffer = await pipeline
        .webp({ quality: quality ?? 80 })
        .toBuffer();
      outputMimeType = "image/webp";
      break;
    case "avif":
      outputBuffer = await pipeline
        .avif({ quality: quality ?? 80 })
        .toBuffer();
      outputMimeType = "image/avif";
      break;
    case "gif":
      outputBuffer = await pipeline.gif().toBuffer();
      outputMimeType = "image/gif";
      break;
    case "png":
    default:
      outputBuffer = await pipeline.png({ quality }).toBuffer();
      outputMimeType = "image/png";
      break;
  }

  return { data: outputBuffer.toString("base64"), mimeType: outputMimeType };
}

export async function resizeImage(options: ResizeOptions): Promise<GeneratedImage> {
  const { data, mimeType } = await loadImageInput(options.image);
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
    const resizeOptions: SharpResizeOptions = {
      width: targetWidth,
      height: targetHeight,
    };
    if (targetWidth !== undefined && targetHeight !== undefined) {
      resizeOptions.fit = options.fit ?? "cover";
    }
    pipeline = pipeline.resize(resizeOptions);
  }

  const outputFormat = options.format ?? extensionFromMimeType(mimeType);
  return applyOutputFormat(pipeline, outputFormat, options.quality);
}

export async function convertImage(options: ConvertOptions): Promise<GeneratedImage> {
  const { data } = await loadImageInput(options.image);
  const inputBuffer = Buffer.from(data, "base64");
  const pipeline = sharp(inputBuffer);
  return applyOutputFormat(pipeline, options.format, options.quality);
}

export interface CropOptions {
  image: string;
  left?: number;
  top?: number;
  width?: number;
  height?: number;
  gravity?:
    | "north"
    | "northeast"
    | "east"
    | "southeast"
    | "south"
    | "southwest"
    | "west"
    | "northwest"
    | "center"
    | "centre"
    | "attention"
    | "entropy";
  format?: "jpeg" | "png" | "webp" | "avif" | "gif";
  quality?: number;
}

export async function cropImage(options: CropOptions): Promise<GeneratedImage> {
  const { data, mimeType } = await loadImageInput(options.image);
  const inputBuffer = Buffer.from(data, "base64");
  let pipeline = sharp(inputBuffer);

  if (
    options.left !== undefined &&
    options.top !== undefined &&
    options.width !== undefined &&
    options.height !== undefined
  ) {
    pipeline = pipeline.extract({
      left: options.left,
      top: options.top,
      width: options.width,
      height: options.height,
    });
  } else if (options.width !== undefined && options.height !== undefined && options.gravity) {
    pipeline = pipeline.resize(options.width, options.height, {
      fit: "cover",
      position: options.gravity,
    });
  } else {
    throw new Error(
      "Provide either left/top/width/height for an exact crop, or width/height/gravity for a smart crop"
    );
  }

  const outputFormat = options.format ?? extensionFromMimeType(mimeType);
  return applyOutputFormat(pipeline, outputFormat, options.quality);
}

export interface CompressOptions {
  image: string;
  quality?: number;
  format?: "jpeg" | "png" | "webp" | "avif" | "gif";
  target_size?: number;
}

type LossyFormat = "jpeg" | "webp" | "avif";

async function encodeLossy(pipeline: Sharp, format: LossyFormat, quality: number): Promise<Buffer> {
  switch (format) {
    case "jpeg":
      return pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
    case "webp":
      return pipeline.webp({ quality }).toBuffer();
    case "avif":
      return pipeline.avif({ quality }).toBuffer();
  }
}

function lossyFormatFromMimeType(mimeType: string): LossyFormat {
  if (mimeType === "image/jpeg") return "jpeg";
  if (mimeType === "image/avif") return "avif";
  return "webp";
}

async function compressToTargetSize(
  pipeline: Sharp,
  format: LossyFormat,
  targetSize: number
): Promise<GeneratedImage> {
  let low = 1;
  let high = 100;
  let bestBuffer: Buffer | null = null;

  for (let i = 0; i < 10 && low <= high; i++) {
    const mid = Math.floor((low + high) / 2);
    const buffer = await encodeLossy(pipeline.clone(), format, mid);

    if (buffer.length <= targetSize) {
      bestBuffer = buffer;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (!bestBuffer) {
    bestBuffer = await encodeLossy(pipeline, format, 1);
  }

  const mimeTypeMap: Record<LossyFormat, string> = {
    jpeg: "image/jpeg",
    webp: "image/webp",
    avif: "image/avif",
  };

  return { data: bestBuffer.toString("base64"), mimeType: mimeTypeMap[format] };
}

export async function compressImage(options: CompressOptions): Promise<GeneratedImage> {
  const { data, mimeType } = await loadImageInput(options.image);
  const inputBuffer = Buffer.from(data, "base64");
  const pipeline = sharp(inputBuffer);

  const outputFormat = options.format ?? extensionFromMimeType(mimeType);

  if (options.target_size !== undefined) {
    if (outputFormat !== "jpeg" && outputFormat !== "webp" && outputFormat !== "avif") {
      throw new Error(
        `target_size is only supported for lossy formats (jpeg, webp, avif). Got: ${outputFormat}`
      );
    }
    return compressToTargetSize(pipeline, outputFormat, options.target_size);
  }

  return applyOutputFormat(pipeline, outputFormat, options.quality);
}

function extensionFromMimeType(mimeType: string): "jpeg" | "png" | "webp" | "avif" | "gif" {
  const map: Record<string, "jpeg" | "png" | "webp" | "avif" | "gif"> = {
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
