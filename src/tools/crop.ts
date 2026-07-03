import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { cropImage, saveImageToDisk } from "../utils/image.js";

const GravitySchema = z.enum([
  "north",
  "northeast",
  "east",
  "southeast",
  "south",
  "southwest",
  "west",
  "northwest",
  "center",
  "centre",
  "attention",
  "entropy",
]);

const CropArgsBaseSchema = z.object({
  image: z.string().min(1, "Image is required"),
  left: z.number().int().min(0).optional(),
  top: z.number().int().min(0).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  gravity: GravitySchema.optional(),
  output_path: z.string().optional(),
  format: z.enum(["jpeg", "png", "webp", "avif", "gif"]).optional(),
  quality: z.number().int().min(1).max(100).optional(),
});

const CropArgsSchema = CropArgsBaseSchema.refine(
  (data) => {
    const hasCoordinates =
      data.left !== undefined &&
      data.top !== undefined &&
      data.width !== undefined &&
      data.height !== undefined;
    const hasGravityCrop =
      data.width !== undefined && data.height !== undefined && data.gravity !== undefined;
    return hasCoordinates || hasGravityCrop;
  },
  {
    message:
      "Provide either left/top/width/height for an exact crop, or width/height/gravity for a smart crop",
  }
);

type CropArgs = z.infer<typeof CropArgsSchema>;

export function registerCropImageTool(server: McpServer): void {
  server.registerTool(
    "crop_image",
    {
      description:
        "Crop an image by exact coordinates or by gravity-based smart crop. Accepts the image as a base64 string, data URI, file path, or URL. Supports output to disk or base64. Optionally convert format and adjust quality.",
      inputSchema: CropArgsBaseSchema.shape,
    },
    async (args: CropArgs) => {
      const cropped = await cropImage({
        image: args.image,
        left: args.left,
        top: args.top,
        width: args.width,
        height: args.height,
        gravity: args.gravity,
        format: args.format,
        quality: args.quality,
      });

      if (args.output_path) {
        await saveImageToDisk(cropped, args.output_path);
        return {
          content: [
            { type: "text", text: `Saved the cropped image to ${args.output_path}` },
          ],
        };
      }

      return {
        content: [
          { type: "image", data: cropped.data, mimeType: cropped.mimeType },
        ],
      };
    }
  );
}
