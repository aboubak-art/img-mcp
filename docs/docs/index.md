---
layout: home

hero:
  name: img-mcp
  text: Documentation
  tagline: Open-source MCP server for AI image generation and local image manipulation. Connect your agents to Google's Nano Banana models or process images locally with Node.js.
  image:
    src: /assets/hero.jpg
    alt: Illustration of an AI agent workspace with image generation and local Node.js processing
  actions:
    - theme: brand
      text: Get started
      link: /docs/getting-started.html
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
  - icon: 📐
    title: Resize & convert
    details: Scale, crop, and convert formats locally with sharp. No API key or network call required.
  - icon: 🔑
    title: Bring your own key
    details: Your Google API key never leaves your machine. No shared credentials or proxy servers.
  - icon: ⚡
    title: Zero-install usage
    details: Run instantly with npx -y img-mcp. No global install or container setup required.
---

## What is img-mcp?

**img-mcp** is an open-source [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that lets AI agents generate and manipulate images. It connects any MCP-compatible host to Google's **Nano Banana** image-generation models (Gemini Flash Image) through the Gemini API, and runs fast local operations with [sharp](https://sharp.pixelplumbing.com/) and Node.js.

Because img-mcp speaks the standard MCP protocol, you can add image generation and manipulation to Claude, Cursor, Windsurf, Kimi, OpenCode, or the OpenAI Codex CLI with a single configuration block.

## Quick start

For local image manipulation, no API key is needed:

```bash
npx -y img-mcp
```

For AI image generation, set a Google API key first:

```bash
export GOOGLE_API_KEY="your-google-api-key"
npx -y img-mcp
```

Then add the server to your MCP host and ask your agent to resize, convert, or generate an image.

## Learn more

- [Installation and first run](/docs/getting-started.html)
- [Environment variables](/docs/configuration.html)
- [`generate_image` tool reference](/docs/tools/generate-image.html)
- [`resize_image` tool reference](/docs/tools/resize.html)
- [`convert_image` tool reference](/docs/tools/convert.html)
- [Supported providers](/docs/providers/google-nano-banana.html)
- [Project roadmap](/docs/roadmap.html)
