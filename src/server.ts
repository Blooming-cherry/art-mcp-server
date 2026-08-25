/**
 * art-mcp-server 主入口：一个 server 暴露全部工具（写完一个加一个 register）。
 *
 * 结构照搬 toolbox-mcp/src/server.ts：
 *   一个 serveStdio + 一个 McpServer + N 次 register。
 */
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerSearchOperator } from "./tools/searchOperator.js";
import { registerGetArtMetadata } from "./tools/getArtMetadata.js";
import { registerQueryDesignTokens } from "./tools/queryDesignTokens.js";
import { registerListAssetCategories } from "./tools/listAssetCategories.js";
import { registerSearchAsset } from "./tools/searchAsset.js";
import { registerReadPrompt } from "./tools/readPrompt.js";
import { registerCountByOperator } from "./tools/countByOperator.js";

serveStdio(() => {
  const server = new McpServer({ name: "art-mcp-server", version: "0.1.0" });

  registerSearchOperator(server);
  registerGetArtMetadata(server);
  registerQueryDesignTokens(server);
  registerListAssetCategories(server);
  registerSearchAsset(server);
  registerReadPrompt(server);
  registerCountByOperator(server);

  return server;
});
