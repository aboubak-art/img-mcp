import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { convertImage, saveImageToDisk } from "../utils/image.js";

const ConvertArgsSchema = z.object({
  image: z.string().min(1, "Image is required"),
  format: z.enum(["jpeg", "png", "webp", "avif", "gif"]),
  quality: z.number().int().min(1).max(100).optional(),
  output_path: z.string().optional(),
});

type ConvertArgs = z.infer<typeof ConvertArgsSchema>;

export function registerConvertImageTool(server: McpServer): void {
  server.registerTool(
    "convert_image",
    {
      description:
        "Convert an image to another format. Accepts the image as a base64 string, data URI, file path, or URL. Supports output to disk or base64. Optionally adjust quality for lossy formats.",
      inputSchema: ConvertArgsSchema.shape,
    },
    async (args: ConvertArgs) => {
      const converted = await convertImage({
        image: args.image,
        format: args.format,
        quality: args.quality,
      });

      if (args.output_path) {
        await saveImageToDisk(converted, args.output_path);
        return {
          content: [
            { type: "text", text: `Saved the converted image to ${args.output_path}` },
          ],
        };
      }

      return {
        content: [
          { type: "image", data: converted.data, mimeType: converted.mimeType },
        ],
      };
    }
  );
}
