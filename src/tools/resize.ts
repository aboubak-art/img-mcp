import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { resizeImage, saveImageToDisk } from "../utils/image.js";

const ResizeArgsBaseSchema = z.object({
  image: z.string().min(1, "Image is required"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  scale: z.number().positive().optional(),
  fit: z
    .enum(["cover", "contain", "fill", "inside", "outside"])
    .optional()
    .default("cover"),
  output_path: z.string().optional(),
  format: z.enum(["jpeg", "png", "webp", "avif", "gif"]).optional(),
  quality: z.number().int().min(1).max(100).optional(),
});

const ResizeArgsSchema = ResizeArgsBaseSchema.refine(
  (data) =>
    data.width !== undefined || data.height !== undefined || data.scale !== undefined,
  {
    message: "At least one of width, height, or scale must be provided",
  }
);

type ResizeArgs = z.infer<typeof ResizeArgsSchema>;

export function registerResizeImageTool(server: McpServer): void {
  server.registerTool(
    "resize_image",
    {
      description:
        "Resize an image by exact width, height, percentage scale, or fit mode. Accepts the image as a base64 string, data URI, file path, or URL. Supports output to disk or base64. Optionally convert format and adjust quality.",
      inputSchema: ResizeArgsBaseSchema.shape,
    },
    async (args: ResizeArgs) => {
      const resized = await resizeImage({
        image: args.image,
        width: args.width,
        height: args.height,
        scale: args.scale,
        fit: args.fit,
        format: args.format,
        quality: args.quality,
      });

      if (args.output_path) {
        await saveImageToDisk(resized, args.output_path);
        return {
          content: [
            { type: "text", text: `Saved the resized image to ${args.output_path}` },
          ],
        };
      }

      return {
        content: [
          { type: "image", data: resized.data, mimeType: resized.mimeType },
        ],
      };
    }
  );
}
