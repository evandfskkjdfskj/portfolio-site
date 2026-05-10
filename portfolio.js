(function () {
  var loader = document.getElementById("loader");
  var loaderFill = document.getElementById("loader-fill");
  var loaderPct = document.getElementById("loader-pct");
  var yearEl = document.getElementById("year");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var heroParallax = document.getElementById("hero-parallax");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  function runLoader() {
    if (!loader || !loaderFill || !loaderPct) return;
    var p = 0;
    var start = performance.now();
    var duration = 1200;

    function tick(now) {
      var t = Math.min(1, (now - start) / duration);
      p = Math.round(t * 100);
      loaderFill.style.width = p + "%";
      loaderPct.textContent = String(p);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(function () {
          loader.classList.add("is-done");
        }, 150);
      }
    }
    requestAnimationFrame(tick);
  }

  runLoader();

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", open ? "false" : "true");
      if (open) mobileNav.setAttribute("hidden", "");
      else mobileNav.removeAttribute("hidden");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileNav.setAttribute("hidden", "");
      });
    });
  }

  /* Hero scroll parallax */
  function onScroll() {
    if (!heroParallax || reduceMotion) return;
    var vh = window.innerHeight || 1;
    var y = window.scrollY;
    var p = Math.min(1, y / (vh * 0.55));
    var opacity = 1 - p * 0.92;
    var scale = 1 - p * 0.045;
    var ty = p * 72;
    heroParallax.style.opacity = String(Math.max(0, opacity));
    heroParallax.style.transform = "translateY(" + ty + "px) scale(" + scale + ")";
  }

  if (heroParallax && !reduceMotion) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mouse spotlight on cards */
  if (!reduceMotion) {
    document.querySelectorAll("[data-spotlight]").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        el.style.setProperty("--sx", x + "px");
        el.style.setProperty("--sy", y + "px");
      });
    });
  }

  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { rootMargin: "-6% 0px -6% 0px", threshold: 0.06 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  var track = document.getElementById("carousel-track");
  var slides = track ? track.querySelectorAll(".carousel__slide") : [];
  var prevBtn = document.getElementById("carousel-prev");
  var nextBtn = document.getElementById("carousel-next");
  var dotsRoot = document.getElementById("carousel-dots");
  var captionEl = document.getElementById("carousel-caption");
  var index = 0;

  function setSlide(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) {
      s.classList.toggle("is-active", j === index);
    });
    if (dotsRoot) {
      var dots = dotsRoot.querySelectorAll(".carousel__dot");
      dots.forEach(function (d, j) {
        d.classList.toggle("is-active", j === index);
        d.setAttribute("aria-selected", j === index ? "true" : "false");
      });
    }
    var cap = slides[index] && slides[index].querySelector("figcaption");
    if (captionEl && cap) captionEl.textContent = cap.textContent;
  }

  if (slides.length && dotsRoot) {
    slides.forEach(function (_, j) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "carousel__dot btn-pressable" + (j === 0 ? " is-active" : "");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "第 " + (j + 1) + " 张");
      b.setAttribute("aria-selected", j === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        setSlide(j);
      });
      dotsRoot.appendChild(b);
    });
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { setSlide(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { setSlide(index + 1); });

  document.addEventListener("keydown", function (e) {
    if (!slides.length) return;
    if (e.key === "ArrowLeft") setSlide(index - 1);
    if (e.key === "ArrowRight") setSlide(index + 1);
  });

  if (slides.length) setSlide(0);

  function addRipple(el, clientX, clientY) {
    var rect = el.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var r = document.createElement("span");
    var size = Math.max(rect.width, rect.height);
    r.className = "ripple";
    r.style.width = r.style.height = size + "px";
    r.style.left = x - size / 2 + "px";
    r.style.top = y - size / 2 + "px";
    el.appendChild(r);
    setTimeout(function () {
      r.remove();
    }, 500);
  }

  document.addEventListener(
    "pointerdown",
    function (e) {
      var t = e.target.closest(".btn-pressable");
      if (!t || t.disabled) return;
      t.classList.add("is-pressed");
      if (t.tagName === "BUTTON" || t.classList.contains("btn")) {
        addRipple(t, e.clientX, e.clientY);
      }
      if (t.classList.contains("site-header__menu")) {
        addRipple(t, e.clientX, e.clientY);
      }
    },
    true
  );

  document.addEventListener(
    "pointerup",
    function () {
      document.querySelectorAll(".btn-pressable.is-pressed").forEach(function (el) {
        el.classList.remove("is-pressed");
      });
    },
    true
  );

  document.addEventListener(
    "pointercancel",
    function () {
      document.querySelectorAll(".btn-pressable.is-pressed").forEach(function (el) {
        el.classList.remove("is-pressed");
      });
    },
    true
  );
})();
