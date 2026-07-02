import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerGenerateImageTool } from "./tools/generate-image.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "image-mcp",
    version: "1.0.0",
  });

  registerGenerateImageTool(server);

  return server;
}
