import { describe, it } from "node:test";
import assert from "node:assert";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

interface TextContent {
  type: "text";
  text: string;
}

async function withClient<T>(callback: (client: Client) => Promise<T>): Promise<T> {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./dist/index.js"],
  });

  const client = new Client({ name: "test-client", version: "1.0.0" });
  await client.connect(transport);

  try {
    return await callback(client);
  } finally {
    await client.close();
  }
}

describe("img-mcp server", () => {
  it("lists the generate_image tool", async () => {
    await withClient(async (client) => {
      const tools = await client.listTools();
      const names = tools.tools.map((tool) => tool.name);
      assert.ok(names.includes("generate_image"));
      assert.ok(names.includes("resize_image"));
      assert.ok(names.includes("convert_image"));
      assert.ok(names.includes("crop_image"));
    });
  });

  it("exposes an images argument on generate_image", async () => {
    await withClient(async (client) => {
      const tools = await client.listTools();
      const tool = tools.tools.find((t) => t.name === "generate_image");
      assert.ok(tool, "generate_image tool not found");
      const schema = tool.inputSchema as { properties?: Record<string, unknown> };
      assert.ok(schema.properties, "tool schema has no properties");
      assert.ok(
        Object.prototype.hasOwnProperty.call(schema.properties, "images"),
        "generate_image schema is missing images property"
      );
    });
  });

  it("exposes a transparent_background argument on generate_image", async () => {
    await withClient(async (client) => {
      const tools = await client.listTools();
      const tool = tools.tools.find((t) => t.name === "generate_image");
      assert.ok(tool, "generate_image tool not found");
      const schema = tool.inputSchema as { properties?: Record<string, unknown> };
      assert.ok(schema.properties, "tool schema has no properties");
      assert.ok(
        Object.prototype.hasOwnProperty.call(schema.properties, "transparent_background"),
        "generate_image schema is missing transparent_background property"
      );
    });
  });

  it("returns an error when called without an API key", async () => {
    await withClient(async (client) => {
      const result = (await client.callTool({
        name: "generate_image",
        arguments: { prompt: "a cat" },
      })) as { isError?: boolean; content: unknown[] };

      assert.strictEqual(
        result.isError,
        true,
        "Expected an error response without GOOGLE_API_KEY"
      );

      const texts = (result.content as Array<{ type: string; text?: string }>)
        .filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .filter((text): text is string => text.length > 0);

      assert.ok(
        texts.some((text) =>
          text.toLowerCase().includes("missing google_api_key")
        ),
        `Expected error message to mention missing GOOGLE_API_KEY, got: ${texts.join(" ")}`
      );
    });
  });
});
