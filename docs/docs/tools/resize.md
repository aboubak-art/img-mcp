# `resize_image`

Resize an image locally using the [sharp](https://sharp.pixelplumbing.com/) library. This tool does not require an API key and works entirely on your machine.

## Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | — | Input image as a base64 string, data URI (`data:image/png;base64,...`), local file path, or URL. |
| `width` | `number` | No | — | Target width in pixels. |
| `height` | `number` | No | — | Target height in pixels. |
| `scale` | `number` | No | — | Scale factor, for example `0.5` for 50%. |
| `fit` | `string` | No | `cover` | How to fit the image when both `width` and `height` are provided. |
| `output_path` | `string` | No | — | If provided, saves the resized image to disk and returns the file path. |
| `format` | `string` | No | — | Output format: `jpeg`, `png`, `webp`, `avif`, `gif`. Defaults to the input format. |
| `quality` | `number` | No | — | Quality for lossy formats (`1`–`100`). |

You must provide at least one of `width`, `height`, or `scale`.

### Fit modes

- `cover` — Crop to fill both dimensions, preserving aspect ratio.
- `contain` — Fit within both dimensions, preserving aspect ratio; may add empty space.
- `fill` — Stretch to exactly match both dimensions.
- `inside` — Fit within the given dimensions; result may be smaller than requested.
- `outside` — Cover the given dimensions; result may be larger than requested.

## Output behavior

- If `output_path` is omitted, the resized image is returned as a base64 string.
- If `output_path` is provided, the image is saved to that path and the path is returned.
- When only `width` or `height` is provided, the original aspect ratio is preserved.
- When `format` is omitted, the output format matches the input image format.

## Examples

### Scale by width from a data URI

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "width": 800
}
```

### Resize an image from a local file path

```json
{
  "image": "/path/to/photo.jpg",
  "width": 800,
  "height": 600,
  "fit": "cover"
}
```

### Resize an image from a URL

```json
{
  "image": "https://example.com/photo.png",
  "scale": 0.5,
  "format": "webp",
  "quality": 85,
  "output_path": "/tmp/resized.webp"
}
```

## Best practices

- Provide only `width` or `height` when you want to preserve the aspect ratio.
- Use `fit: "cover"` for thumbnails and `fit: "contain"` when you need the entire image visible.
- Set `quality` between `70` and `90` for a good balance of size and visual quality.
