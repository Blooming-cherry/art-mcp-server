/**
 * 工具 6/7：read_prompt —— 读取 prompts/ 目录下某个 prompt 文件（.md）的原文。
 *
 * 输入：name（不带 .md 后缀，如 "illustration-prompts"）
 * 输出：该 .md 文件的纯文本内容
 *
 * 知识点：readFile 读文本文件（这次【不 JSON.parse】，直接返回原文）+ try/catch 处理「文件不存在」
 */
import { McpServer } from "@modelcontextprotocol/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { ART_REPO } from "../config.js";

export function registerReadPrompt(server: McpServer): void {
  server.registerTool(
    "read_prompt",
    {
      description: "读取 prompts/ 目录下指定 prompt 文件(.md)的原文",
      inputSchema: {
        name: z.string(),
      },
    },
    async ({ name }) => {
      try{
      const file = await readFile(join(ART_REPO,"prompts",`${name}.md`),"utf-8");
        return {
          content:[{type:"text" as const ,text:file}]
        };
      }catch{
        throw new Error(`找不到prompt:${name}`);
      }
    }
  );
}
