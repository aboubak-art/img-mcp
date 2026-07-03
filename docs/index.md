---
layout: home

hero:
  name: img-mcp
  text: Documentation
  tagline: Open-source MCP server for AI image generation. Connect your agents to Google's Nano Banana models in minutes.
  image:
    src: https://aboubak-art.github.io/img-mcp/assets/hero.jpg
    alt: Abstract illustration of AI image generation
  actions:
    - theme: brand
      text: Get started
      link: /getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/aboubak-art/img-mcp

features:
  - icon: 🎨
    title: Text-to-image
    details: Generate images from natural-language prompts with controls for aspect ratio, resolution, and output format.
  - icon: 🖼️
    title: Reference images
    details: Guide generation by passing base64 images or data URIs to preserve style, subject, or composition.
  - icon: ✨
    title: Transparent backgrounds
    details: Produce clean PNG assets with transparent backgrounds ready for logos, overlays, and product shots.
  - icon: 🔑
    title: Bring your own key
    details: Your Google API key never leaves your machine. No shared credentials or proxy servers.
  - icon: ⚡
    title: Zero-install usage
    details: Run instantly with npx -y img-mcp. No global install or container setup required.
  - icon: 🔌
    title: MCP native
    details: Works with Claude Desktop, Cursor, Windsurf, Kimi Code, OpenCode, Codex CLI, and any MCP host.
---

## What is img-mcp?

**img-mcp** is an open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets AI agents generate images. It connects any MCP-compatible host to Google's **Nano Banana** image-generation models (Gemini Flash Image) through the Gemini API.

Because img-mcp speaks the standard MCP protocol, you can add image generation to Claude, Cursor, Windsurf, Kimi, OpenCode, or the OpenAI Codex CLI with a single configuration block.

## Quick start

```bash
export GOOGLE_API_KEY="your-google-api-key"
npx -y img-mcp
```

Then add the server to your MCP host and ask your agent to generate an image.

## Learn more

- [Installation and first run](/getting-started)
- [Environment variables](/configuration)
- [`generate_image` tool reference](/tools/generate-image)
- [Supported providers](/providers/google-nano-banana)
- [Project roadmap](/roadmap)
