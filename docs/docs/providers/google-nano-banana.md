# Google Nano Banana

img-mcp currently supports Google's **Nano Banana** image-generation models, also known as **Gemini Flash Image**.

## What is Nano Banana?

Nano Banana is Google's family of fast, high-quality image-generation models available through the Gemini API. They are designed for text-to-image and image-to-image tasks and offer strong prompt adherence and visual quality.

## Available models

Model IDs may change as Google releases updates. Common Nano Banana model IDs include:

- `gemini-3.1-flash-image` — default, fast, and cost-effective
- `gemini-3.1-flash-lite-image` — lighter variant for faster generation
- `gemini-3-pro-image` — higher quality for demanding use cases

You can set the default model with the `GOOGLE_IMAGE_MODEL` environment variable or override it per request with the `model` argument.

## API endpoint

img-mcp uses the Gemini API [`interactions`](https://ai.google.dev/gemini-api/docs/image-generation) endpoint for all image generation calls.

## Pricing and quotas

You are responsible for your own API usage and costs. Google may offer free tiers or rate limits that change over time. Check the [Gemini API pricing page](https://ai.google.dev/pricing) for current rates and quotas.

## Getting an API key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Create a new API key.
4. Export it as `GOOGLE_API_KEY` when running img-mcp.

## Regional availability

Gemini API availability and supported models vary by region. If you receive model-not-found errors, confirm that your selected model is available in your region.
