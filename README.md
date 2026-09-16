# art-mcp-server

## 基于本地化资源的管理 mcp 工具

该工具为**本地化部署的 LLM 模型**提供一套《明日方舟》美术资产的管理工具。通过 stdio 暴露 7 个工具，
可供 Claude Code、[dsh](https://github.com/deepseek-ai/dsh) 等任意 MCP client 调用，
按干员、分类、设计 Token 检索与读取本地美术资产。

由于是初次开发，仍有很多不足，如有 issue 请提交 PR。

> **素材说明**：`arknights-art-repo/` 中的美术素材来自公开渠道的收集，本人完成的是**分类整理、
> 元数据抽取与工具封装**，并非原创绘制。以上内容涉及商业的资产均仅供个人学习，
> 涉及的 mcp 工具可以作为游戏开发的一部分，助力开发者将更多精力放在内容的创作上。

## 工具一览

7 个工具全部注册在同一个 `McpServer` 上（`src/server.ts`，写完一个加一个 `register`）。

| # | 工具 | 输入 | 输出 |
|---|------|------|------|
| 1 | `search_operator` | `name`：干员英文代号（如 `amiya`） | 立绘文件名列表（忽略大小写） |
| 2 | `get_art_metadata` | `path`：相对资产仓库的路径 | `{id, code, variant, size, mtime}` |
| 3 | `query_design_tokens` | `category`：`colors` \| `typography`（可选，默认 `colors`） | 对应 Token 文件解析后的 JSON |
| 4 | `list_asset_categories` | 无 | `[{category, count}]`，各分类目录及文件数 |
| 5 | `search_asset` | `name`：关键词 | `{分类名: 命中文件列表}`，只含有命中的分类 |
| 6 | `read_prompt` | `name`：不带 `.md` 后缀 | 该 prompt 文件原文 |
| 7 | `count_by_operator` | 无 | `{干员代号: 立绘张数}` |

文件名约定为 `char_<id>_<code>_<variant>.png`（如 `char_002_amiya_1.png`），
`get_art_metadata` 与 `count_by_operator` 都依赖这个下划线分段结构。

## 环境要求

- **Node.js**：实测通过于 v24.16.0。`package.json` 未声明 `engines`，最低版本未实测
- 无需编译原生模块；MCP SDK 与 zod 均为纯 JS 依赖

## 安装与运行

```bash
npm i                 # 安装依赖
npm run typecheck     # 类型检查（tsc --noEmit）
npm start             # 以 stdio 启动 MCP server
npm run dev           # 同上，但带 tsx watch 热重载
```

MCP client 侧配置示例（路径按实际位置替换）：

```json
{
  "mcpServers": {
    "art": {
      "command": "npx",
      "args": ["tsx", "D:/dev/playground/art-mcp-server/src/server.ts"]
    }
  }
}
```

## 目录结构

```
art-mcp-server
├── .gitignore              # 排除了 arknights-art-repo/（资产太大不入库）
├── package.json            # MCP server ^2.0.0 + zod ^4 + tsx + TS5.7，ESM/NodeNext
├── tsconfig.json
├── node_modules\
├── arknights-art-repo\     # 资产仓库（数据源，被 gitignore）
│   ├── 01-角色立绘_Portraits\    (1225 张，char_XXX_code_variant.png)
│   ├── 02-角色头像_Avatars\
│   ├── 03-皮肤精灵_Skins\
│   ├── 04-技能图标_SkillIcons\
│   ├── 05-基建技能_BuildingSkills\
│   ├── 06-物品图标_Items\
│   ├── 07-稀有度_Rarity\
│   ├── 08-敌方单位_Enemies\
│   ├── 09-关卡地图_Maps\
│   ├── design-tokens\     # colors.json + typography.json
│   ├── prompts\           # illustration-prompts.md / ui-redesign-prompts.md
│   └── FIGMA_GUIDE.md / README.md
└── src\
    ├── config.ts           # ART_REPO 指向资产仓库，可用环境变量覆盖
    ├── pathGuard.ts        # 共享 validatePath / isInside，所有文件访问限在仓库内
    ├── server.ts           # serveStdio + 一个 McpServer，逐个 registerXxx(server)
    └── tools\              # 每工具一个模块，export function registerXxx(server)
        ├── searchOperator.ts       (1/7)
        ├── getArtMetadata.ts       (2/7)
        ├── queryDesignTokens.ts    (3/7)
        ├── listAssetCategories.ts  (4/7)
        ├── searchAsset.ts          (5/7)
        ├── readPrompt.ts           (6/7)
        └── countByOperator.ts      (7/7)
```

## 资产仓库

资产仓库**不入库**（3.0 GB，`.gitignore` 已排除），克隆后需自行放置到项目根目录的
`arknights-art-repo/`，或用环境变量指到别处：

```bash
ART_REPO=/path/to/arknights-art-repo npm start
```

`src/config.ts` 中 `ART_REPO` 默认为相对项目根目录的 `arknights-art-repo/`。

## 验证状态

**2026-09-16 复现**（本次实跑，非历史记录）：

- `npm run typecheck` 通过（`tsc --noEmit`，退出码 0）
- 以 `npx tsx src/server.ts` 启动，经 stdio 完成 MCP 握手
  （`initialize` → `tools/list` → `tools/call`），协商协议版本 `2024-11-05`
- `tools/list` 返回 **7/7** 工具
- 7 个工具的正常路径**逐个实调成功**；`list_asset_categories` 返回的 9 个分类文件数
  与磁盘实数一致（立绘 1225、头像 2131、皮肤 1289、技能图标 1639、基建 542、
  物品 1284、稀有度 6、敌方 1692、关卡地图 2897）
- 路径守卫生效：`../package.json`、`/etc/hosts` 均被拒（"路径越界，拒绝访问"）
- 空结果不报错：`search_operator("zzz_不存在的干员")` 返回 "命中0个"

本次未执行：单元测试（项目当前没有测试文件）、性能与并发测试、CI。

## 已知限制与缺陷

以下为 2026-09-16 复现过程中**实际触发**的问题，**当前均未修复**，如实记录：

1. **`read_prompt` 未接入路径守卫**（`src/tools/readPrompt.ts:26`）
   该工具直接 `join(ART_REPO, "prompts", name + ".md")`，而 `name` 是自由字符串（`z.string()`），
   没有调用 `pathGuard.ts` 的 `validatePath`。实测 `{"name": "../../README"}` 成功返回了资产仓库
   **之外**的 `art-mcp-server/README.md` 全文；唯一的限制是文件名必须以 `.md` 结尾。

   需要精确说明的是：**7 个工具中只有 `get_art_metadata` 一个 import 了 pathGuard**。
   其余工具的路径来源分为三类，只有 `read_prompt` 落在风险区：

   | 工具 | 路径来源 | 是否可越界 |
   |---|---|---|
   | `get_art_metadata` | 自由字符串 | 否（有守卫） |
   | `read_prompt` | 自由字符串 `z.string()` | **是（无守卫，已复现）** |
   | `query_design_tokens` | `z.enum(["colors","typography"])` | 否（枚举已限死） |
   | `search_operator` / `search_asset` | 目录名固定，输入只用于文件名**过滤** | 否 |
   | `list_asset_categories` / `count_by_operator` | 固定目录，无输入 | 否 |

2. **`get_art_metadata` 对下划线段数不足的文件名抛裸 TypeError**（`src/tools/getArtMetadata.ts:33`）
   `parts[3].replace(".png","")` 假定文件名恒有 3 个下划线。实测
   `{"path": "02-角色头像_Avatars/avatar_avg_1502.png"}` 返回
   `Cannot read properties of undefined (reading 'replace')`。
   **该项影响真实数据**：`02-角色头像_Avatars/` 下的头像文件名多为 3 段（`avatar_avg_1502.png`），
   共 2131 个文件。同一次实测中 `search_asset("avatar_avg_1502")` **能搜到**该文件，
   但 `get_art_metadata` 对同一路径**必崩**——两个工具在真实数据上互相矛盾。
   此外 `stat` 未检查 `isFile()`，传入目录（如 `design-tokens`）也会走到同一个 TypeError。

3. **扩展名剥离区分大小写**（同 `src/tools/getArtMetadata.ts:33`）
   `replace(".png","")` 不匹配大写。实测 `char_002_amiya_1.PNG` 返回 `variant: "1.PNG"`，
   而 `char_002_amiya_1.png` 返回 `variant: "1"`——同一张图两种写法得到不同的值。

4. **错误信息为系统原文，未做业务包装**
   不含前 3 条时，异常路径返回的是 `ENOENT: no such file or directory, stat 'D:\...'` 这类原文，
   会暴露本机绝对路径，且调用方难以据此区分「文件不存在」与「参数非法」。

## 许可

仅供个人学习与技术交流。美术素材版权归原权利方所有，请勿用于商业用途。
