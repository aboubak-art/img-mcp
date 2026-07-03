# Installation

Get img-mcp running locally and connected to your favorite MCP host.

## Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- A Google API key only if you want AI image generation (local manipulation works without one)

## Get a Google API key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Create a new API key.
3. Copy the key and export it in your terminal:

```bash
export GOOGLE_API_KEY="your-google-api-key"
```

On Windows PowerShell, use:

```powershell
$env:GOOGLE_API_KEY="your-google-api-key"
```

## Run with npx (recommended)

The fastest way to try img-mcp is with `npx`:

```bash
npx -y img-mcp
```

This downloads and runs the latest version without installing anything globally.

## Install globally

If you prefer a global install:

```bash
npm install -g img-mcp
img-mcp
```

## Add to an MCP host

Once the server is running, add it to your MCP host configuration. Most hosts use a JSON config similar to this:

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

### Claude Desktop

Add the block above to your `claude_desktop_config.json` and restart Claude Desktop.

### Cursor / Windsurf

Open the MCP server settings and paste the server block, then reload the window.

### Kimi Code

Use the CLI:

```bash
kimi mcp add --transport stdio img-mcp -- npx -y img-mcp
```

Or add the JSON block to `~/.kimi-code/mcp.json`.

### OpenCode

Add the block to `~/.config/opencode/opencode.json` under the `mcp` key, or run:

```bash
opencode mcp add
```

### OpenAI Codex CLI

Add to `~/.codex/config.toml`:

```toml
[mcp_servers.img-mcp]
command = "npx"
args = ["-y", "img-mcp"]

[mcp_servers.img-mcp.env]
GOOGLE_API_KEY = "your-google-api-key"
```

## Verify it works

Ask your agent to generate an image:

> Generate an image of a futuristic city at sunset, 16:9 aspect ratio, 2K resolution.

If everything is configured correctly, the agent will call the `generate_image` tool and return the image.

## Next steps

- [Configure environment variables](/docs/configuration.html)
- [Read the `generate_image` tool reference](/docs/tools/generate-image.html)
- [Read the `resize_image` tool reference](/docs/tools/resize.html)
- [Read the `convert_image` tool reference](/docs/tools/convert.html)
- [View the project roadmap](/docs/roadmap.html)

## Local manipulation without an API key

`resize_image` and `convert_image` run entirely on your machine using `sharp`. You only need a `GOOGLE_API_KEY` for `generate_image` and other AI-powered features.