import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import TiltedCard from "./components/TiltedCard.jsx";
import placeholderSvg from "./portrait-placeholder.svg?url";
import portraitSrc from "./assets/figma-71/portrait.png";

/* 尽早告诉浏览器拉取大图，减轻「先白块/占位再闪一下」与偶发加载失败 */
if (typeof document !== "undefined") {
  const pre = document.createElement("link");
  pre.rel = "preload";
  pre.as = "image";
  pre.href = portraitSrc;
  pre.setAttribute("fetchpriority", "high");
  document.head.appendChild(pre);
}

const rootEl = document.getElementById("portrait-tilt-root");
if (rootEl) {

  createRoot(rootEl).render(
    <StrictMode>
      <TiltedCard
        imageSrc={portraitSrc}
        imageSrcFallback={placeholderSvg}
        altText="王朝阳"
        captionText="王朝阳 · Game UX Designer"
        containerHeight="651px"
        containerWidth="525px"
        imageHeight="651px"
        imageWidth="525px"
        rotateAmplitude={12}
        scaleOnHover={1.12}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={<p className="tilted-card-demo-text">Game UX Designer</p>}
      />
    </StrictMode>
  );
}
