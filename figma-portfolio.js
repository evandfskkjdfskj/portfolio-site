(function () {
  var nav = document.querySelector(".figma-nav");
  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.querySelectorAll("a").forEach(function (a) {
          a.classList.remove("is-active");
        });
        if (link.getAttribute("href") === "#top") {
          link.classList.add("is-active");
        }
      });
    });
  }

  var root = document.querySelector("[data-case-carousel]");
  if (!root) return;

  var track = document.getElementById("case-carousel-track");
  var prevBtn = root.querySelector(".figma-case__btn--prev");
  var nextBtn = root.querySelector(".figma-case__btn--next");
  var dotsHost = document.getElementById("case-carousel-dots");
  if (!track || !prevBtn || !nextBtn || !dotsHost) return;

  var slides = root.querySelectorAll("[data-carousel-slide]");
  var total = slides.length;
  if (total === 0) return;

  var FRAME = 1920;
  var index = 0;
  var touchStartX = null;
  var resizeTimer = null;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("is-reduced-motion");
  }

  function slideWidthPx() {
    if (!slides[0] || !slides[0].getBoundingClientRect) return FRAME;
    var w = slides[0].getBoundingClientRect().width;
    return w > 0 ? w : FRAME;
  }

  function setTransform() {
    var w = slideWidthPx();
    track.style.transform = "translateX(" + -index * w + "px)";
  }

  function updateDots() {
    dotsHost.querySelectorAll(".figma-case__dot").forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === index);
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function updateA11y() {
    slides.forEach(function (slide, i) {
      slide.setAttribute("aria-hidden", i === index ? "false" : "true");
    });
    root.setAttribute("data-carousel-index", String(index));
  }

  function go(nextIndex) {
    index = ((nextIndex % total) + total) % total;
    setTransform();
    updateDots();
    updateA11y();
  }

  for (var d = 0; d < total; d++) {
    (function (i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "figma-case__dot";
      dot.setAttribute("aria-label", "第 " + (i + 1) + " 屏案例");
      dot.addEventListener("click", function () {
        go(i);
      });
      dotsHost.appendChild(dot);
    })(d);
  }

  prevBtn.addEventListener("click", function () {
    go(index - 1);
  });
  nextBtn.addEventListener("click", function () {
    go(index + 1);
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  });

  var swipeEl = root.querySelector(".figma-case__viewport") || track;
  swipeEl.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );

  swipeEl.addEventListener("touchend", function (e) {
    if (touchStartX == null || e.changedTouches.length !== 1) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (dx > 48) go(index - 1);
    else if (dx < -48) go(index + 1);
  });

  function onResize() {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      resizeTimer = null;
      setTransform();
    }, 100);
  }

  window.addEventListener("resize", onResize);
  if (window.ResizeObserver && slides[0]) {
    var ro = new ResizeObserver(function () {
      setTransform();
    });
    ro.observe(root.querySelector(".figma-case__viewport") || slides[0]);
  }

  setTransform();
  updateDots();
  updateA11y();
})();
