# `compress_image`

Compress or optimize an image locally using the [sharp](https://sharp.pixelplumbing.com/) library. This tool does not require an API key and works entirely on your machine.

## Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | — | Input image as a base64 string, data URI (`data:image/png;base64,...`), local file path, or URL. |
| `quality` | `number` | No | — | Quality for lossy formats (`1`–`100`). Higher is better quality and larger file. |
| `format` | `string` | No | — | Output format: `jpeg`, `png`, `webp`, `avif`, `gif`. Defaults to the input format. |
| `target_size` | `number` | No | — | Target file size in bytes. Only supported for lossy formats (`jpeg`, `webp`, `avif`). |
| `output_path` | `string` | No | — | If provided, saves the compressed image to disk and returns the file path. |

At least one of `quality` or `target_size` should be provided, or `format` should differ from the input format. Otherwise the output is likely identical to the input.

## Output behavior

- If `output_path` is omitted, the compressed image is returned as a base64 string.
- If `output_path` is provided, the image is saved to that path and the path is returned.
- When `format` is omitted, the output format matches the input image format.

## Examples

### Compress with a fixed quality

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo...",
  "format": "webp",
  "quality": 75
}
```

### Target a specific file size

```json
{
  "image": "/path/to/photo.jpg",
  "format": "jpeg",
  "target_size": 51200,
  "output_path": "/path/to/photo-optimized.jpg"
}
```

### Compress an image from a URL

```json
{
  "image": "https://example.com/photo.png",
  "format": "avif",
  "quality": 80,
  "output_path": "/tmp/photo.avif"
}
```

## Best practices

- Use `quality` between `70` and `90` for a good balance of size and visual quality.
- Use `target_size` when you need to meet a strict size constraint, such as an upload limit.
- `target_size` only works with lossy formats. For `png` or `gif`, use `quality` (PNG ignores quality) or convert to a lossy format first.
- Match the `output_path` extension to the chosen `format` to avoid confusion.
