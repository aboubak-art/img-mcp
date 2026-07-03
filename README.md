# img-mcp

[![npm version](https://img.shields.io/npm/v/img-mcp.svg?style=flat-square)](https://www.npmjs.com/package/img-mcp)
[![CI](https://img.shields.io/github/actions/workflow/status/aboubak-art/img-mcp/ci.yml?branch=main&style=flat-square)](https://github.com/aboubak-art/img-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/aboubak-art/img-mcp?style=flat-square)](./LICENSE)

📚 **[View the website](https://aboubak-art.github.io/img-mcp/)**

An open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets AI agents generate images. It currently supports Google's **Nano Banana** image-generation models (Gemini Flash Image) through the Gemini API.

## Features

- **Text-to-image generation** via MCP tools
- **Image-to-image / reference-image generation** by passing base64 images or data URIs
- **Transparent background generation**
- **Local image resizing** — scale, crop-fit, and convert formats without an API key
- **Local image format conversion** — JPEG, PNG, WebP, AVIF, GIF
- **Google Nano Banana** support (`gemini-3.1-flash-image`, `gemini-3.1-flash-lite-image`, `gemini-3-pro-image`, etc.)
- **User-provided API key** — you bring your own Google API key
- **Zero-install usage** with `npx img-mcp`
- **Multiple aspect ratios and image sizes**

## Installation

### Via `npx` (recommended)

```bash
npx -y img-mcp
```

### Via npm

```bash
npm install -g img-mcp
img-mcp
```

## Configuration

Set your Google API key as an environment variable:

```bash
export GOOGLE_API_KEY="your-google-api-key"
```

You can get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Image sizes

Supported `image_size` values are `512`, `1K`, `2K`, and `4K`. Note that `2K` and `4K` require a Nano Banana model that supports high-resolution output, such as `gemini-3-pro-image`. The default `gemini-3.1-flash-image` model typically supports `512` and `1K`.

### Optional environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | — |
| `GOOGLE_IMAGE_MODEL` | Default Nano Banana model ID | `gemini-3.1-flash-image` |

### Optional: transparent background support

The `transparent_background` feature relies on `@imgly/background-removal-node`, which is licensed under **AGPL-3.0**. To keep `img-mcp` itself under the permissive MIT license, this dependency is **optional** and is not installed by default.

To enable transparent backgrounds, install the peer dependency in your environment:

```bash
npm install -g @imgly/background-removal-node
```

Or, when using `npx`, install it alongside `img-mcp` in a local project. If `transparent_background` is requested while the package is missing, the tool returns an error with installation instructions.

## Usage with MCP hosts

Add the server to your MCP host configuration (e.g., Claude Desktop, Cursor, or Windsurf):

```json
{
  "mcpServers": {
    "img-mcp": {
      "command": "npx",
      "args": ["-y", "img-mcp"],
      "env": {
        "GOOGLE_API_KEY": "your-google-api-key"
      }
    }
  }
}
```

## Available Tools

### `generate_image`

Generates images from a text prompt.

**Arguments**

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `prompt` | `string` | Yes | — | Text description of the image |
| `model` | `string` | No | `gemini-3.1-flash-image` | Nano Banana model ID |
| `n` | `number` | No | `1` | Number of images to generate (1–4) |
| `aspect_ratio` | `string` | No | `1:1` | Aspect ratio (`1:1`, `16:9`, `9:16`, `3:2`, `2:3`, `4:3`, `3:4`, `4:5`, `5:4`, `21:9`) |
| `image_size` | `string` | No | `1K` | Image size (`512`, `1K`, `2K`, `4K`). Larger sizes may require a model such as `gemini-3-pro-image`. |
| `output_path` | `string` | No | — | If provided, saves the generated image(s) to disk at this path and returns the file path(s) instead of base64 |
| `images` | `string` or `string[]` | No | — | One or more reference images as base64 strings or data URIs (`data:image/png;base64,...`) |
| `transparent_background` | `boolean` | No | `false` | When `true`, the prompt is rewritten to request a bright green background and the background is removed after generation; output is always PNG |

**Example**

```json
{
  "prompt": "A futuristic city at sunset with flying cars",
  "aspect_ratio": "16:9",
  "image_size": "2K",
  "n": 1
}
```

**Example with reference images**

```json
{
  "prompt": "Generate a portrait in the same style as the reference photo",
  "aspect_ratio": "1:1",
  "image_size": "1K",
  "images": [
    "data:image/png;base64,iVBORw0KGgo..."
  ]
}
```

**Example with transparent background**

```json
{
  "prompt": "A golden retriever wearing sunglasses",
  "aspect_ratio": "1:1",
  "image_size": "1K",
  "transparent_background": true,
  "output_path": "/tmp/dog.png"
}
```

**Output behavior**

- If `output_path` is provided, the generated image(s) are written to disk and the tool returns the saved file path(s). When `n` is greater than 1, additional images are saved with numbered suffixes (e.g., `image_1.png`, `image_2.png`).
- If `output_path` is omitted, the generated image(s) are returned as base64 content.
- When `transparent_background` is `true`, the output is always a PNG with transparency and `output_path` is rewritten to use the `.png` extension.

### `resize_image`

Resizes an image using fast local processing (powered by `sharp`). Scale by width, height, percentage, or fit mode.

**Arguments**

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | — | Input image as a base64 string or data URI (`data:image/png;base64,...`) |
| `width` | `number` | No | — | Target width in pixels |
| `height` | `number` | No | — | Target height in pixels |
| `scale` | `number` | No | — | Scale factor (e.g., `0.5` for 50%) |
| `fit` | `string` | No | `cover` | Fit mode when both `width` and `height` are provided: `cover`, `contain`, `fill`, `inside`, `outside` |
| `output_path` | `string` | No | — | If provided, saves the resized image to disk and returns the file path |
| `format` | `string` | No | — | Output format: `jpeg`, `png`, `webp`, `avif`, `gif`. Defaults to the input format |
| `quality` | `number` | No | — | Output quality for lossy formats (`1`–`100`) |

At least one of `width`, `height`, or `scale` must be provided.

**Examples**

Scale to a specific width:

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "width": 800
}
```

Resize to exact dimensions with cover fit:

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "width": 800,
  "height": 600,
  "fit": "cover"
}
```

Scale by percentage and convert to WebP:

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "scale": 0.5,
  "format": "webp",
  "quality": 85,
  "output_path": "/tmp/resized.webp"
}
```

**Output behavior**

- If `output_path` is provided, the resized image is written to disk and the tool returns the saved file path.
- If `output_path` is omitted, the resized image is returned as base64 content.
- When only `width` or `height` is provided, the aspect ratio is preserved.
- When `format` is omitted, the output format matches the input image format.

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build
npm run build

# Lint / type check
npm run lint
```

### Testing with the MCP Inspector

```bash
npm run build
npx @modelcontextprotocol/inspector dist/index.js
```

## Provider: Google Nano Banana

This server uses the Gemini API [`interactions`](https://ai.google.dev/gemini-api/docs/image-generation) endpoint for Nano Banana models. You are responsible for your own API usage and costs.

## License

[MIT](./LICENSE)

## Contributing

Contributions are welcome! Please open an issue or pull request on GitHub.
