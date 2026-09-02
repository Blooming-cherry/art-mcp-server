

## 基于本地化资源的管理mcp工具
/*该工具为本地化部署的LLM模型提供一套管理工具，由于是初次开发，仍有很多不足，如有issue请提交PR。*/


本项目的大致结构如下：

```
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
│   ├── prompts\
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
以上内容涉及商业的资产均仅供个人学习，涉及的mcp工具可以作为游戏开发的一部分，助力开发者将更多精力放在内容的创作上。
