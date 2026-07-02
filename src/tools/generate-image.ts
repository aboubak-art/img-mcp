import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { generateImages, saveImageToDisk } from "../providers/google.js";
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

const ImageSizeSchema = z.enum(["512px (05.K)", "1K", "2K", "4K"]);

const GenerateImageArgsSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  model: z.string().optional(),
  n: z.number().int().min(1).max(4).optional().default(1),
  aspect_ratio: AspectRatioSchema.optional().default("1:1"),
  image_size: ImageSizeSchema.optional().default("1K"),
  output_path: z.string().optional(),
});

export function registerGenerateImageTool(server: McpServer): void {
  server.tool(
    "generate_image",
    "Generate images from a text prompt using Google's Nano Banana models via the Gemini API.",
    GenerateImageArgsSchema.shape,
    async (args) => {
      const config = loadConfig();

      const options: ImageGenerationOptions = {
        prompt: args.prompt,
        model: args.model ?? config.googleImageModel,
        n: args.n,
        aspectRatio: args.aspect_ratio,
        imageSize: args.image_size,
        outputPath: args.output_path,
      };

      const images = await generateImages(options);

      const content: Array<
        | { type: "image"; data: string; mimeType: string }
        | { type: "text"; text: string }
      > = images.map((img) => ({
        type: "image",
        data: img.data,
        mimeType: img.mimeType,
      }));

      if (options.outputPath && images[0]) {
        await saveImageToDisk(images[0], options.outputPath);
        content.push({
          type: "text",
          text: `Saved the first generated image to ${options.outputPath}`,
        });
      }

      return { content };
    }
  );
}
