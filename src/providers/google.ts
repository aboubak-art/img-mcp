import { writeFile } from "node:fs/promises";
import type {
  GeneratedImage,
  GeminiInteractionRequest,
  GeminiInteractionResponse,
  ImageGenerationOptions,
} from "../types.js";
import { loadConfig } from "../config.js";

const SUPPORTED_ASPECT_RATIOS = [
  "1:1",
  "3:2",
  "2:3",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
];

const SUPPORTED_IMAGE_SIZES = ["512px (05.K)", "1K", "2K", "4K"];

export function validateImageGenerationOptions(
  options: ImageGenerationOptions
): void {
  if (!options.prompt || options.prompt.trim().length === 0) {
    throw new Error("Prompt is required and cannot be empty.");
  }

  if (options.n < 1 || options.n > 4) {
    throw new Error("n must be between 1 and 4.");
  }

  if (!SUPPORTED_ASPECT_RATIOS.includes(options.aspectRatio)) {
    throw new Error(
      `Unsupported aspect_ratio: ${options.aspectRatio}. Supported: ${SUPPORTED_ASPECT_RATIOS.join(
        ", "
      )}`
    );
  }

  if (!SUPPORTED_IMAGE_SIZES.includes(options.imageSize)) {
    throw new Error(
      `Unsupported image_size: ${options.imageSize}. Supported: ${SUPPORTED_IMAGE_SIZES.join(
        ", "
      )}`
    );
  }
}

export async function generateImages(
  options: ImageGenerationOptions
): Promise<GeneratedImage[]> {
  validateImageGenerationOptions(options);

  const config = loadConfig();
  const requestBody: GeminiInteractionRequest = {
    model: options.model,
    input: [{ type: "text", text: options.prompt }],
    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: options.aspectRatio,
      image_size: options.imageSize,
    },
  };

  const response = await fetch(config.apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": config.googleApiKey,
    },
    body: JSON.stringify(requestBody),
  });

  const responseData = (await response.json()) as GeminiInteractionResponse;

  if (!response.ok) {
    const message = responseData.error?.message ?? response.statusText;
    const status = responseData.error?.status ?? String(response.status);
    throw new Error(`Google API error (${status}): ${message}`);
  }

  const images: GeneratedImage[] = [];

  if (responseData.output_images && responseData.output_images.length > 0) {
    for (const img of responseData.output_images.slice(0, options.n)) {
      images.push({ data: img.data, mimeType: img.mime_type });
    }
  } else if (responseData.output_image) {
    images.push({
      data: responseData.output_image.data,
      mimeType: responseData.output_image.mime_type,
    });
  }

  if (images.length === 0) {
    throw new Error("No image was returned by the Google API.");
  }

  return images;
}

export async function saveImageToDisk(
  image: GeneratedImage,
  outputPath: string
): Promise<void> {
  const buffer = Buffer.from(image.data, "base64");
  await writeFile(outputPath, buffer);
}
