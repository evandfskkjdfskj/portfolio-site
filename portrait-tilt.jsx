import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TiltedCard from "./components/TiltedCard.jsx";
import portraitSrc from "./assets/figma-71/portrait.png";

const el = document.getElementById("portrait-tilt-root");
if (el) {
  createRoot(el).render(
    <StrictMode>
      <TiltedCard
        imageSrc={portraitSrc}
        altText="王朝阳"
        captionText="Game UX Designer"
        containerHeight="100%"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        rotateAmplitude={12}
        scaleOnHover={1.08}
        showMobileWarning={false}
        showTooltip
        displayOverlayContent
        overlayContent={
          <p className="figma-portrait__overlay-label">Game UX Designer</p>
        }
      />
    </StrictMode>
  );
}
