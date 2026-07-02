export interface ImageGenerationOptions {
  prompt: string;
  model: string;
  n: number;
  aspectRatio: string;
  imageSize: string;
  outputPath?: string;
}

export interface GeneratedImage {
  data: string; // base64
  mimeType: string;
}

export interface GeminiInteractionInput {
  type: "text" | "image";
  text?: string;
  data?: string;
  mime_type?: string;
}

export interface GeminiResponseFormat {
  type: "image";
  mime_type: string;
  aspect_ratio: string;
  image_size: string;
}

export interface GeminiInteractionRequest {
  model: string;
  input: GeminiInteractionInput[];
  response_format: GeminiResponseFormat;
}

export interface GeminiImageBlock {
  data: string;
  mime_type: string;
}

export interface GeminiInteractionResponse {
  output_image?: GeminiImageBlock;
  output_images?: GeminiImageBlock[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
