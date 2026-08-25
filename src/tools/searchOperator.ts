/**
 * 工具 1/7：search_operator —— 按干员英文代号搜索立绘资产。
 *
 * 输入：name（如 "amiya"、"chen"）
 * 输出：文件名里包含该代号的立绘文件列表
 *
 * 知识点：readdir（遍历目录） + filter（数组过滤） + toLowerCase（忽略大小写）
 */
import { McpServer } from "@modelcontextprotocol/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { ART_REPO } from "../config.js";

export function registerSearchOperator(server: McpServer): void {
  server.registerTool(
    "search_operator",
    {
      description: "按干员英文代号（如 amiya/chen)搜索立绘,返回匹配的文件名列表",
      inputSchema: {
        name: z.string(),
      },
    },
    async ({ name }) => {

      const list = await readdir(join(ART_REPO,"01-角色立绘_Portraits"));

      const matched = list.filter((f) => f.toLowerCase().includes(name.toLocaleLowerCase()))

      return {
        content:[{type:"text" as const,text:`命中${matched.length}个：\n${matched.join("\n")}`}],
      };



    }
  );
}
