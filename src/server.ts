import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerConvertImageTool } from "./tools/convert.js";
import { registerCropImageTool } from "./tools/crop.js";
import { registerGenerateImageTool } from "./tools/generate-image.js";
import { registerResizeImageTool } from "./tools/resize.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "img-mcp",
    version: "1.0.0",
  });

  registerGenerateImageTool(server);
  registerResizeImageTool(server);
  registerConvertImageTool(server);
  registerCropImageTool(server);

  return server;
}
