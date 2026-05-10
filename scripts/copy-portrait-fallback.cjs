/**
 * 构建后把 portrait 复制到 dist/assets/figma-71/portrait.png
 * 兼容仍请求旧路径的缓存/代理（GitHub Pages 上该路径此前 404）。
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "assets", "figma-71", "portrait.png");
const dir = path.join(root, "dist", "assets", "figma-71");
const dst = path.join(dir, "portrait.png");

if (!fs.existsSync(src)) {
  console.warn("[copy-portrait-fallback] skip: missing", src);
  process.exit(0);
}
fs.mkdirSync(dir, { recursive: true });
fs.copyFileSync(src, dst);
console.log("[copy-portrait-fallback] ok ->", path.relative(root, dst));
