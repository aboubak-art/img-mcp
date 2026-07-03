# `crop_image`

Crop an image locally using the [sharp](https://sharp.pixelplumbing.com/) library. This tool does not require an API key and works entirely on your machine.

## Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | — | Input image as a base64 string, data URI (`data:image/png;base64,...`), local file path, or URL. |
| `left` | `number` | No | — | X coordinate of the top-left corner for an exact crop. |
| `top` | `number` | No | — | Y coordinate of the top-left corner for an exact crop. |
| `width` | `number` | No | — | Width of the cropped region. |
| `height` | `number` | No | — | Height of the cropped region. |
| `gravity` | `string` | No | — | Smart-crop gravity. Use with `width` and `height`. |
| `output_path` | `string` | No | — | If provided, saves the cropped image to disk and returns the file path. |
| `format` | `string` | No | — | Output format: `jpeg`, `png`, `webp`, `avif`, `gif`. Defaults to the input format. |
| `quality` | `number` | No | — | Quality for lossy formats (`1`–`100`). |

You must provide either:
- `left`, `top`, `width`, and `height` for an exact crop, or
- `width`, `height`, and `gravity` for a smart crop.

### Gravity values

- `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`
- `center` / `centre`
- `attention` — crop to the region with the highest luminance frequency
- `entropy` — crop to the region with the highest entropy

## Output behavior

- If `output_path` is omitted, the cropped image is returned as a base64 string.
- If `output_path` is provided, the image is saved to that path and the path is returned.
- When `format` is omitted, the output format matches the input image format.

## Examples

### Exact crop by coordinates

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "left": 100,
  "top": 50,
  "width": 800,
  "height": 600
}
```

### Smart crop from a file path

```json
{
  "image": "/path/to/photo.jpg",
  "width": 800,
  "height": 800,
  "gravity": "center"
}
```

### Crop from a URL and convert to WebP

```json
{
  "image": "https://example.com/photo.png",
  "width": 600,
  "height": 400,
  "gravity": "attention",
  "format": "webp",
  "quality": 85,
  "output_path": "/tmp/cropped.webp"
}
```

## Best practices

- Use exact coordinates when you know the region you want.
- Use `gravity: "attention"` for thumbnails of photos with a clear subject.
- Match the `output_path` extension to the chosen `format` to avoid confusion.
