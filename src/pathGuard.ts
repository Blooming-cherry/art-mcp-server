/**
 * 共享路径守卫：把所有文件访问限制在 Arknights 资产仓库内，越界就拒。
 *
 * 输入约定：传「相对资产仓库的路径」（如 "01-角色立绘_Portraits/char_002_amiya_1.png"）。
 * resolve(ART_REPO, input) 会把它拼到仓库根目录下；
 * 若 input 是绝对路径（想越权读 D:/etc/...），isInside 会拦下并抛错。
 *
 * export { validatePath } —— 把函数公开，别的工具 import 复用（≈ C++ 头文件）。
 */
import { resolve, normalize, sep } from "node:path";
import { ART_REPO } from "./config.js";

function isInside(target: string, parent: string): boolean {
  const t = normalize(target);
  const p = normalize(parent);
  return t === p || t.startsWith(p + sep);
}

function validatePath(input: string): string {
  const resolved = resolve(ART_REPO, input);
  if (!isInside(resolved, ART_REPO)) {
    throw new Error(`路径越界，拒绝访问：${input}`);
  }
  return resolved;
}

export { validatePath, isInside };
