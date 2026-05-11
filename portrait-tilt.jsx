import { createRoot } from "react-dom/client";
import TiltedCard from "./components/TiltedCard.jsx";
/** 本地资源：portfolio-site/assets/figma-71/portrait.png（Vite 打包为带 hash 的 URL） */
import portraitSrc from "./assets/figma-71/portrait.png";

const el = document.getElementById("portrait-tilt-root");
if (el) {
  createRoot(el).render(
    <TiltedCard
      imageSrc={portraitSrc}
      altText="王朝阳"
      containerHeight="651px"
      containerWidth="525px"
      imageHeight="651px"
      imageWidth="525px"
      rotateAmplitude={24}
      scaleOnHover={1.1}
      showMobileWarning={false}
      showTooltip={false}
      displayOverlayContent={false}
    />
  );
}
