import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/** Old HTML or caches may still request dist/assets/figma-71/portrait.png. */
function copyPortraitFallback() {
  return {
    name: "copy-portrait-fallback",
    closeBundle() {
      const src = resolve(__dirname, "assets/figma-71/portrait.png");
      const destDir = resolve(__dirname, "dist/assets/figma-71");
      const dest = resolve(destDir, "portrait.png");
      if (!existsSync(src)) {
        console.warn("[copy-portrait-fallback] missing source:", src);
        return;
      }
      mkdirSync(destDir, { recursive: true });
      copyFileSync(src, dest);
      console.log("[copy-portrait-fallback] wrote", dest);
    }
  };
}

export default defineConfig({
  plugins: [react(), copyPortraitFallback()],
  root: ".",
  base: "./",
  server: {
    open: true,
    port: 5173
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        projectShuaitu: resolve(__dirname, "project-shuaitu.html")
      }
    }
  }
});
