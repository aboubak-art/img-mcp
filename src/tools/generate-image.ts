import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generateImages } from "../providers/google.js";
import { saveImagesToDisk } from "../utils/image.js";
import { loadConfig } from "../config.js";
import type { ImageGenerationOptions } from "../types.js";

const AspectRatioSchema = z.enum([
  "1:1",
  "3:2",
  "2:3",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
]);

const ImageSizeSchema = z.enum(["512", "1K", "2K", "4K"]);

const GenerateImageArgsSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().optional(),
  n: z.number().int().min(1).max(4).optional().default(1),
  aspect_ratio: AspectRatioSchema.optional().default("1:1"),
  image_size: ImageSizeSchema.optional().default("1K"),
  output_path: z.string().optional(),
  images: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((val) => (val === undefined ? undefined : Array.isArray(val) ? val : [val])),
});

export function registerGenerateImageTool(server: McpServer): void {
  server.registerTool(
    "generate_image",
    {
      description:
        "Generate images from a text prompt using Google's Nano Banana models via the Gemini API. Optionally provide reference images as base64 strings, data URIs, file paths, or URLs to guide generation.",
      inputSchema: GenerateImageArgsSchema.shape,
    },
    async (args) => {
      const config = loadConfig();

      const options: ImageGenerationOptions = {
        prompt: args.prompt,
        model: args.model ?? config.googleImageModel,
        n: args.n,
        aspectRatio: args.aspect_ratio,
        imageSize: args.image_size,
        outputPath: args.output_path,
        images: args.images,
      };

      const images = await generateImages(options);

      if (options.outputPath) {
        const savedPaths = await saveImagesToDisk(images, options.outputPath);
        const text =
          savedPaths.length === 1
            ? `Saved the generated image to ${savedPaths[0]}`
            : `Saved ${savedPaths.length} generated images to:\n${savedPaths.map((p) => `- ${p}`).join("\n")}`;
        return { content: [{ type: "text", text }] };
      }

      const content: Array<
        | { type: "image"; data: string; mimeType: string }
        | { type: "text"; text: string }
      > = images.map((img) => ({
        type: "image",
        data: img.data,
        mimeType: img.mimeType,
      }));

      return { content };
    }
  );
}
