/**
 * Art MCP 全局配置。
 *
 * ART_REPO 指向明日方舟美术资产仓库根目录（已移到项目内）。
 * 默认相对项目根目录的 arknights-art-repo/；环境变量 ART_REPO 可覆盖（换机器时传绝对路径）。
 */
import { resolve } from "node:path";

const ART_REPO = resolve(process.env.ART_REPO ?? "arknights-art-repo");

export { ART_REPO };
