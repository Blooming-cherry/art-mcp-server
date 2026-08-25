/**
 * 工具 5/7：search_asset —— 跨所有分类目录按名字搜索资产。
 *
 * 输入：name（关键词，如 "amiya"）
 * 输出：{ "01-角色立绘_Portraits": [...], "03-皮肤精灵_Skins": [...] } 的 JSON（只含有命中的分类）
 *
 * 知识点：嵌套循环（外层遍历目录、内层过滤文件）+ 对象累加（result[分类名] = 命中列表）
 */
import { McpServer } from "@modelcontextprotocol/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { ART_REPO } from "../config.js";

export function registerSearchAsset(server: McpServer): void {
  server.registerTool(
    "search_asset",
    {
      description: "跨所有分类目录按名字搜索资产，返回 {分类名: 命中文件列表}",
      inputSchema: {
        name: z.string(),
      },
    },
    async ({ name }) => {
      const list = await readdir(ART_REPO,{withFileTypes:true})
      const dir = list.filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name));
      const result: Record<string,string[]> = {};
      for(const d of dir){
        const files = await readdir(join(ART_REPO,d.name));
        const matched = files.filter((t) => t.toLowerCase().includes(name.toLowerCase()))
        if (matched.length > 0) result[d.name] = matched;
      }
      return{
        content:[{type:"text" as const,text:JSON.stringify(result)}]
      };
    }
  );
}
