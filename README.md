# img-mcp

[![npm version](https://img.shields.io/npm/v/img-mcp.svg?style=flat-square)](https://www.npmjs.com/package/img-mcp)
[![CI](https://img.shields.io/github/actions/workflow/status/sidikfaha/img-mcp/ci.yml?branch=main&style=flat-square)](https://github.com/sidikfaha/img-mcp/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/sidikfaha/img-mcp?style=flat-square)](./LICENSE)

📚 **[View the website](https://sidikfaha.github.io/img-mcp/)**

An open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets AI agents generate images. It currently supports Google's **Nano Banana** image-generation models (Gemini Flash Image) through the Gemini API.

## Features

- **Text-to-image generation** via MCP tools
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

### Optional environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | — |
| `GOOGLE_IMAGE_MODEL` | Default Nano Banana model ID | `gemini-3.1-flash-image` |

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
| `image_size` | `string` | No | `1K` | Image size (`512px (05.K)`, `1K`, `2K`, `4K`) |
| `output_path` | `string` | No | — | If provided, saves the first generated image to this path |

**Example**

```json
{
  "prompt": "A futuristic city at sunset with flying cars",
  "aspect_ratio": "16:9",
  "image_size": "2K",
  "n": 1
}
```

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
