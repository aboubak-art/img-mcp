# Configuration

img-mcp is configured through environment variables. No config files are required.

## Required variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Your Google Gemini API key | `AIza...` |

Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Optional variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_IMAGE_MODEL` | Default Nano Banana model ID | `gemini-3.1-flash-image` |

You can override the model per request using the `model` argument of `generate_image`.

## Example environment

```bash
export GOOGLE_API_KEY="AIza..."
export GOOGLE_IMAGE_MODEL="gemini-3.1-flash-image"
```

## Setting variables in MCP host configs

Most hosts let you define environment variables directly in the server config:

```json
{
  "mcpServers": {
    "img-mcp": {
      "command": "npx",
      "args": ["-y", "img-mcp"],
      "env": {
        "GOOGLE_API_KEY": "AIza...",
        "GOOGLE_IMAGE_MODEL": "gemini-3.1-flash-image"
      }
    }
  }
}
```

## Optional dependency: background removal

The `remove_background` tool uses `@imgly/background-removal-node`, which is licensed under AGPL-3.0. To keep img-mcp under MIT, this package is an optional peer dependency.

Install it to enable background removal:

```bash
npm install -g @imgly/background-removal-node
```

If the package is missing when `remove_background` is called, img-mcp returns an error with installation instructions.
