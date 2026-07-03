export interface ImageGenerationOptions {
  prompt: string;
  model: string;
  n: number;
  aspectRatio: string;
  imageSize: string;
  outputPath?: string;
  images?: string[];
  transparentBackground?: boolean;
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

export interface GeminiStepContent {
  type: "image" | "text";
  data?: string;
  mime_type?: string;
  text?: string;
}

export interface GeminiStep {
  type: "thought" | "model_output";
  signature?: string;
  content?: GeminiStepContent[];
}

export interface GeminiInteractionResponse {
  id?: string;
  status?: string;
  object?: string;
  model?: string;
  output_image?: GeminiImageBlock;
  output_images?: GeminiImageBlock[];
  steps?: GeminiStep[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}
