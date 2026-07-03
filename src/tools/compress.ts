import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { compressImage, saveImageToDisk } from "../utils/image.js";

const CompressArgsSchema = z.object({
  image: z.string().min(1, "Image is required"),
  quality: z.number().int().min(1).max(100).optional(),
  format: z.enum(["jpeg", "png", "webp", "avif", "gif"]).optional(),
  target_size: z.number().int().positive().optional(),
  output_path: z.string().optional(),
});

type CompressArgs = z.infer<typeof CompressArgsSchema>;

export function registerCompressImageTool(server: McpServer): void {
  server.registerTool(
    "compress_image",
    {
      description:
        "Compress or optimize an image. Accepts the image as a base64 string, data URI, file path, or URL. Set quality, convert format, or target a specific file size (bytes) for lossy formats. Supports output to disk or base64.",
      inputSchema: CompressArgsSchema.shape,
    },
    async (args: CompressArgs) => {
      const compressed = await compressImage({
        image: args.image,
        quality: args.quality,
        format: args.format,
        target_size: args.target_size,
      });

      if (args.output_path) {
        await saveImageToDisk(compressed, args.output_path);
        return {
          content: [
            { type: "text", text: `Saved the compressed image to ${args.output_path}` },
          ],
        };
      }

      return {
        content: [
          { type: "image", data: compressed.data, mimeType: compressed.mimeType },
        ],
      };
    }
  );
}
