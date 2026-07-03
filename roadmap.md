# Roadmap

img-mcp is becoming a general-purpose image manipulation MCP server. Generation is one tool; the main focus is fast, local, non-AI image operations powered by Node.js.

## Shipped

- [x] **Text-to-image generation** — create images from natural-language prompts.
- [x] **Reference-image generation** — guide generation with base64 or data-URI images.
- [x] **Multiple aspect ratios and sizes** — 1:1, 16:9, 9:16, 4K, and more.
- [x] **Transparent backgrounds** — remove backgrounds via `@imgly/background-removal-node`.
- [x] **Zero-install usage** — run with `npx -y img-mcp`.
- [x] **Bring-your-own-key** — your Google API key stays in your environment.

## Planned — Core image manipulation

The priority is robust, dependency-light Node.js operations that work without an API key.

- [ ] **Resize** — scale by width, height, percentage, or fit mode (`cover`, `contain`, `fill`).
- [ ] **Crop** — crop by coordinates/dimensions or gravity-based smart crop.
- [ ] **Compress / optimize** — quality, format-specific tuning, and target file-size optimization.
- [ ] **Convert formats** — JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF.
- [ ] **Rotate & flip** — arbitrary rotation, horizontal/vertical flip, auto-orient from EXIF.
- [ ] **Blur & sharpen** — gaussian blur, unsharp mask, motion blur.
- [ ] **Adjustments** — brightness, contrast, saturation, hue, exposure, gamma.
- [ ] **Filters & effects** — grayscale, sepia, invert, tint, rounded corners, drop shadow.
- [ ] **Metadata read/write** — EXIF, IPTC, XMP extraction and stripping.
- [ ] **Batch operations** — apply the same transform to multiple images in one call.

## Planned — Advanced manipulation

- [ ] **Watermark / overlay** — add text or image watermarks with positioning and opacity.
- [ ] **Collage / montage** — combine multiple images into a grid or custom layout.
- [ ] **Sprite sheet generation** — pack frames into a single image.
- [ ] **Image comparison** — diff two images and return similarity metrics.
- [ ] **Thumbnails** — generate preset thumbnail sizes with face/center gravity.
- [ ] **Animated image support** — split/combine GIF/WebP frames.
- [ ] **SVG rasterization** — render SVGs to PNG/JPEG at any size.

## Research

Longer-term or optional capabilities that may rely on AI or heavier dependencies.

- [ ] **Additional generation providers** — support image models beyond Google Nano Banana.
- [ ] **Upscale & super-resolution** — increase resolution and recover detail.
- [ ] **Inpainting / outpainting** — edit or extend image regions.
- [ ] **Background replacement** — replace backgrounds via segmentation or color keying.
- [ ] **Style transfer & presets** — apply consistent artistic styles and brand presets.
- [ ] **Image analysis feedback loop** — let agents critique and iteratively refine images.

## Share your ideas

Have a feature request? Open an issue on [GitHub](https://github.com/aboubak-art/img-mcp/issues) and let us know what you'd like to see next.
