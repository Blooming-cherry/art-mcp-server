/**
 * 工具 7/7：count_by_operator —— 统计 01-角色立绘_Portraits 里每个干员代号的立绘数量。
 *
 * 输入：无
 * 输出：{ "amiya": 6, "kalts": 4, "chen": 3, ... } 的 JSON（代号 → 立绘张数）
 *
 * 知识点：Map 分组计数（新概念）+ Map 转 JSON 的坑
 */
import { McpServer } from "@modelcontextprotocol/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ART_REPO } from "../config.js";

export function registerCountByOperator(server: McpServer): void {
  server.registerTool(
    "count_by_operator",
    {
      description: "统计 01-角色立绘_Portraits 目录里每个干员代号的立绘数量",
      inputSchema: {},
    },
    async () => {
      const files = await readdir (join(ART_REPO,"01-角色立绘_Portraits"));
      const counts = new Map <string,number>();
      for(const file of files){
      const code = file.split("_")[2];
      counts.set(code,(counts.get(code) ?? 0) +1);
     }
      const obj = Object.fromEntries(counts);
      return{
        content:[{type:"text" as const,text:JSON.stringify(obj)}]
      };
    }
  );
}
