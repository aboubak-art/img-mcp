import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  ensurePngExtension,
  removeBackgroundFromImage,
  saveImageToDisk,
} from "../utils/image.js";

const RemoveBackgroundArgsSchema = z.object({
  image: z.string().min(1, "Image is required"),
  output_path: z.string().optional(),
});

type RemoveBackgroundArgs = z.infer<typeof RemoveBackgroundArgsSchema>;

export function registerRemoveBackgroundTool(server: McpServer): void {
  server.registerTool(
    "remove_background",
    {
      description:
        "Remove the background from an image and return a transparent PNG. Accepts the image as a base64 string, data URI, file path, or URL. Supports output to disk or base64. Requires the optional peer dependency @imgly/background-removal-node.",
      inputSchema: RemoveBackgroundArgsSchema.shape,
    },
    async (args: RemoveBackgroundArgs) => {
      try {
        const removed = await removeBackgroundFromImage(args.image);

        if (args.output_path) {
          const outputPath = ensurePngExtension(args.output_path);
          await saveImageToDisk(removed, outputPath);
          return {
            content: [
              { type: "text", text: `Saved the image with background removed to ${outputPath}` },
            ],
          };
        }

        return {
          content: [
            { type: "image", data: removed.data, mimeType: removed.mimeType },
          ],
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error);
        if (message.includes("@imgly/background-removal-node")) {
          return {
            content: [
              {
                type: "text",
                text: "Background removal is not available because the optional dependency `@imgly/background-removal-node` is not installed. Please install it with:\n\n  npm install @imgly/background-removal-node\n\nIf you are using `npx`, install the dependency alongside img-mcp in your project.",
              },
            ],
            isError: true,
          };
        }
        throw error;
      }
    }
  );
}
