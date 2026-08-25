/**
 * 工具 3/7：query_design_tokens —— 查询设计 Token（配色 / 字体系统）。
 *
 * 输入：category（"colors" | "typography"，可选，不传默认 "colors"）
 * 输出：对应 token 文件的 JSON
 *
 * 知识点：readFile + JSON.parse（字符串→对象）+ z.enum（枚举参数）
 */
import { McpServer } from "@modelcontextprotocol/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { ART_REPO } from "../config.js";

export function registerQueryDesignTokens(server: McpServer): void {
  server.registerTool(
    "query_design_tokens",
    {
      description: "查询设计 Token(colors 配色系统 / typography 字体系统）",
      inputSchema: {
        category: z.enum(["colors", "typography"]).optional(),
      },
    },
    async ({ category }) => {
    const name = category ?? "colors";
    const text = await readFile(join(ART_REPO,"design-tokens",`${name}.json`),"utf-8")
    return{content:[{type:"text",text:JSON.stringify(JSON.parse(text))}]}
    }
  );
}
