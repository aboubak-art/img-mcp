# Roadmap

Image generation is the foundation. Here is where img-mcp is headed next.

## Shipped

These features are already available.

- **Text-to-image generation** — create images from natural-language prompts.
- **Reference-image generation** — guide generation with base64 or data-URI images.
- **Transparent backgrounds** — generate clean PNG assets with background removal.
- **Multiple aspect ratios and sizes** — 1:1, 16:9, 9:16, 4K, and more.
- **Zero-install usage** — run with `npx -y img-mcp`.
- **Bring-your-own-key** — your Google API key stays in your environment.

## Planned

Features we are actively designing or planning to implement.

- **Upscale & super-resolution** — increase resolution and recover fine detail.
- **Inpainting** — edit or replace selected regions of an image.
- **Outpainting** — extend the canvas beyond the original image edges.
- **Background replacement** — swap backgrounds while preserving the subject.
- **Style transfer & presets** — apply consistent artistic styles and brand presets.
- **Batch generation** — generate multiple variants in a single tool call.
- **Output metadata** — return generation parameters alongside images.

## Research

Longer-term ideas under exploration.

- **Additional providers** — support for other image models beyond Google Nano Banana.
- **Fine-tuned model hooks** — integrate custom LoRAs and fine-tuned checkpoints.
- **Image analysis feedback loop** — let agents critique and iteratively refine images.
- **Plugin system** — community extensions for custom transformations.

## Share your ideas

Have a feature request? Open an issue on [GitHub](https://github.com/aboubak-art/img-mcp/issues) and let us know what you'd like to see next.
