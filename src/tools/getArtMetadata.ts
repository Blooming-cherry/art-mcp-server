/**
 * 工具 2/7：get_art_metadata —— 读取单个资产文件的元数据。
 *
 * 输入：path（相对资产仓库的路径，如 "01-角色立绘_Portraits/char_002_amiya_1.png"）
 * 输出：{ id, code, variant, size, mtime } 的 JSON
 *
 * 知识点：validatePath（复用路径守卫）+ stat（读文件属性）+ split（解析文件名）
 */
import { McpServer } from "@modelcontextprotocol/server";
import { stat } from "node:fs/promises";
import { z } from "zod";
import { validatePath } from "../pathGuard.js";

export function registerGetArtMetadata(server: McpServer): void {
  server.registerTool(
    "get_art_metadata",
    {
      description: "读取单个资产文件的元数据（解析文件名 + 文件大小/修改时间）",
      inputSchema: {
        path: z.string(),
      },
    },
    async ({ path }) => {
        const allowed = validatePath(path);
        const info = await stat(allowed);
        const base = path.split("/").pop();
        if(typeof base !== "string"){
          throw new Error("无效的资产路径");
        }
        const parts = base.split("_");
        const id = parts[1];
        const code = parts[2];
        const variant = parts[3].replace(".png","");
        const size = info.size;
        const mtime = info.mtimeMs;

        return {
          content: [{
            type:"text",
            text: JSON.stringify({id,code,variant,size:size,mtime:mtime}),
          }],
        };
    }
  );
}
