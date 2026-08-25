/**
 * 工具 4/7：list_asset_categories —— 列出资产仓库里所有分类目录及各自文件数。
 *
 * 输入：无
 * 输出：[{ "category": "01-角色立绘_Portraits", "count": 1225 }, ...] 的 JSON
 *
 * 知识点：readdir 带 withFileTypes 区分「文件 vs 目录」→ 过滤出目录 → 对每个目录再 readdir 数文件
 */
import { McpServer } from "@modelcontextprotocol/server";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ART_REPO } from "../config.js";

export function registerListAssetCategories(server: McpServer): void {
  server.registerTool(
    "list_asset_categories",
    {
      description: "列出资产仓库所有分类目录及各自文件数（导航入口）",
      inputSchema: {},
    },
    async () => {
      const list = await readdir(ART_REPO,{withFileTypes:true});
      const dir =list.filter((e) => e.isDirectory() && /^\d{2}-/.test(e.name));

      const result = [];
      for (const d of dir) {
        const files = await readdir(join(ART_REPO, d.name));
        result.push({ category: d.name, count: files.length });
      }

      return {
        content: [{ type: "text" as const , text: JSON.stringify(result) }]
      };
    }
  );
}
