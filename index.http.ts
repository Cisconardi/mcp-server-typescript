#!/usr/bin/env node
import { McpHttpServer } from "@modelcontextprotocol/sdk/server/mcp-http.js";
import { agentConfig } from "./index.js";

const port = parseInt(process.env.PORT || "5678", 10);

async function main() {
  const server = new McpHttpServer(agentConfig);
  await server.listen(port);
  console.error(`✅ MCP HTTP Server running on port ${port}`);
}

main().catch((error) => {
  console.error("Fatal error in index.http.ts:", error);
  process.exit(1);
});
