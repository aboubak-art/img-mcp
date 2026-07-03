# `convert_image`

Convert an image to another format locally using the [sharp](https://sharp.pixelplumbing.com/) library. This tool does not require an API key and works entirely on your machine.

## Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | — | Input image as a base64 string, data URI (`data:image/png;base64,...`), local file path, or URL. |
| `format` | `string` | Yes | — | Output format: `jpeg`, `png`, `webp`, `avif`, `gif`. |
| `quality` | `number` | No | — | Quality for lossy formats (`1`–`100`). |
| `output_path` | `string` | No | — | If provided, saves the converted image to disk and returns the file path. |

## Output behavior

- If `output_path` is omitted, the converted image is returned as a base64 string.
- If `output_path` is provided, the image is saved to that path and the path is returned.

## Examples

### Convert a data URI to WebP

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "format": "webp",
  "quality": 85
}
```

### Convert a local file to JPEG

```json
{
  "image": "/path/to/photo.png",
  "format": "jpeg",
  "quality": 90,
  "output_path": "/path/to/photo.jpg"
}
```

### Convert an image from a URL to AVIF

```json
{
  "image": "https://example.com/photo.png",
  "format": "avif",
  "quality": 80,
  "output_path": "/tmp/photo.avif"
}
```

## Best practices

- Match the `output_path` extension to the chosen `format` to avoid confusion.
- Use `quality` between `70` and `90` for a good balance of size and visual quality.
- For lossless formats like `png`, the `quality` argument is ignored.
