# `generate_image`

The main tool exposed by img-mcp. It generates images from text prompts and can optionally use reference images, control aspect ratio and resolution, and save outputs to disk.

## Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `prompt` | `string` | Yes | — | Text description of the image you want to generate. |
| `model` | `string` | No | `gemini-3.1-flash-image` | Nano Banana model ID. Can also be set with `GOOGLE_IMAGE_MODEL`. |
| `n` | `number` | No | `1` | Number of images to generate, from 1 to 4. |
| `aspect_ratio` | `string` | No | `1:1` | Output aspect ratio. |
| `image_size` | `string` | No | `1K` | Output resolution. Larger sizes may require a model such as `gemini-3-pro-image`. |
| `output_path` | `string` | No | — | If provided, saves the first image to disk and returns the file path. |
| `images` | `string` or `string[]` | No | — | One or more reference images as base64 strings, data URIs, file paths, or URLs. |

### Supported aspect ratios

`1:1`, `16:9`, `9:16`, `3:2`, `2:3`, `4:3`, `3:4`, `4:5`, `5:4`, `21:9`

### Supported image sizes

- `512`
- `1K`
- `2K`
- `4K`

::: tip Model support for larger sizes
`2K` and `4K` outputs require a Nano Banana model that supports high-resolution generation, such as `gemini-3-pro-image`. The default `gemini-3.1-flash-image` model typically supports `512` and `1K`.
:::

## Output behavior

- If `output_path` is omitted, the generated image is returned as a base64 string.
- If `output_path` is provided, the image is saved to that path and the file path is returned.
- When `n` is greater than 1, additional images are saved with numbered suffixes (for example, `image_1.png`, `image_2.png`).

## Examples

### Basic text-to-image

```json
{
  "prompt": "A futuristic city at sunset with flying cars",
  "aspect_ratio": "16:9",
  "image_size": "2K",
  "n": 1
}
```

### Save to disk

```json
{
  "prompt": "A golden retriever wearing sunglasses",
  "aspect_ratio": "1:1",
  "image_size": "1K",
  "output_path": "/tmp/dog.png"
}
```

### Use reference images

```json
{
  "prompt": "Generate a portrait in the same style as the reference photo",
  "aspect_ratio": "1:1",
  "image_size": "1K",
  "images": [
    "data:image/png;base64,iVBORw0KGgo..."
  ]
}
```

## Best practices

- Be specific in your prompts. Descriptions of lighting, style, camera angle, and mood usually produce better results.
- Use reference images when you need consistency across multiple generations.
- Use `output_path` when you want to chain image generation with other tools or workflows on your local machine.
