import type {
  GeneratedImage,
  GeminiInteractionInput,
  GeminiInteractionRequest,
  GeminiInteractionResponse,
  ImageGenerationOptions,
} from "../types.js";
import { loadConfig } from "../config.js";
import { parseImageInput } from "../utils/image.js";

export { parseImageInput } from "../utils/image.js";

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

const SUPPORTED_IMAGE_SIZES = ["512", "1K", "2K", "4K"];

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

  const input: GeminiInteractionInput[] = [{ type: "text", text: options.prompt }];
  if (options.images) {
    for (const image of options.images) {
      const parsed = parseImageInput(image);
      input.push({ type: "image", data: parsed.data, mime_type: parsed.mimeType });
    }
  }

  const requestBody: GeminiInteractionRequest = {
    model: options.model,
    input,
    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: options.aspectRatio,
      image_size: options.imageSize,
    },
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  let response: Response;
  try {
    response = await fetch(config.apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.googleApiKey,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request to ${config.apiEndpoint} timed out after 60 seconds.`
      );
    }
    throw new Error(
      `Request to ${config.apiEndpoint} failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  clearTimeout(timeout);

  const responseText = await response.text();

  let responseData: GeminiInteractionResponse;
  try {
    responseData = JSON.parse(responseText) as GeminiInteractionResponse;
  } catch {
    throw new Error(
      `Google API returned non-JSON response (status ${response.status}): ${responseText}`
    );
  }

  if (!response.ok) {
    const message = responseData.error?.message ?? response.statusText;
    const status = responseData.error?.status ?? String(response.status);
    let errorText = `Google API error (${status}): ${message}`;

    if (response.status === 404) {
      errorText += ` This may mean the model '${options.model}' does not support image_size '${options.imageSize}'. Try '1K', or use a model such as 'gemini-3-pro-image' if you need larger sizes.`;
    }

    throw new Error(errorText);
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
  } else if (responseData.steps) {
    for (const step of responseData.steps) {
      if (step.type !== "model_output" || !step.content) continue;
      for (const item of step.content) {
        if (item.type === "image" && item.data && item.mime_type) {
          images.push({ data: item.data, mimeType: item.mime_type });
          if (images.length >= options.n) break;
        }
      }
      if (images.length >= options.n) break;
    }
  }

  if (images.length === 0) {
    throw new Error(
      `No image was returned by the Google API. Response: ${JSON.stringify(
        responseData,
        null,
        2
      )}`
    );
  }

  return images;
}
