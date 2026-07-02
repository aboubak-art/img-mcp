export interface Config {
  googleApiKey: string;
  googleImageModel: string;
  apiEndpoint: string;
}

export function loadConfig(): Config {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_API_KEY environment variable. Set your Google Gemini API key before starting the server."
    );
  }

  return {
    googleApiKey: apiKey,
    googleImageModel: process.env.GOOGLE_IMAGE_MODEL ?? "gemini-3.1-flash-image",
    apiEndpoint:
      process.env.GOOGLE_API_ENDPOINT ??
      "https://generativelanguage.googleapis.com/v1beta/interactions",
  };
}
