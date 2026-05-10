/**
 * 首页头像：纯 DOM + Vite 资源 URL，避免 TiltedCard/3D 在部分浏览器或 Pages 上不绘制大图。
 */
import portraitUrl from "./assets/figma-71/portrait.png";

function mount() {
  const root = document.getElementById("portrait-tilt-root");
  if (!root) return;

  root.replaceChildren();

  const img = document.createElement("img");
  img.src = portraitUrl;
  img.alt = "王朝阳";
  img.className = "figma-portrait__static";
  img.width = 525;
  img.height = 651;
  img.loading = "eager";
  img.decoding = "async";
  img.setAttribute("fetchpriority", "high");

  const cap = document.createElement("p");
  cap.className = "figma-portrait__overlay-label";
  cap.textContent = "Game UX Designer";

  root.appendChild(img);
  root.appendChild(cap);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
