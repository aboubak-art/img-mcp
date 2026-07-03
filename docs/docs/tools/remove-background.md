# `remove_background`

Remove the background from an image using `@imgly/background-removal-node`. The output is always a transparent PNG.

This tool does not require an API key, but it requires the optional peer dependency `@imgly/background-removal-node`, which is licensed under AGPL-3.0. See [Configuration](/docs/configuration.html) for installation instructions.

## Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `image` | `string` | Yes | — | Input image as a base64 string, data URI (`data:image/png;base64,...`), local file path, or URL. |
| `output_path` | `string` | No | — | If provided, saves the result to disk as a PNG and returns the file path. The extension is forced to `.png`. |

## Output behavior

- If `output_path` is omitted, the result is returned as a base64 PNG string.
- If `output_path` is provided, the image is saved as PNG and the path is returned.
- The output is always a transparent PNG, regardless of the input format.

## Examples

### Remove background from a data URI

```json
{
  "image": "data:image/png;base64,iVBORw0KGgo..."
}
```

### Remove background from a file and save to disk

```json
{
  "image": "/path/to/photo.jpg",
  "output_path": "/path/to/photo-transparent.png"
}
```

### Remove background from a URL

```json
{
  "image": "https://example.com/photo.png",
  "output_path": "/tmp/photo.png"
}
```

## Best practices

- Use images where the subject is clearly separated from the background for best results.
- The first call may be slow because the model is downloaded on demand.
- Always use a `.png` extension in `output_path` to preserve transparency.
