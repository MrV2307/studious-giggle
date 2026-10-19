"use client";

import { useCallback, useEffect, useState } from "react";

const revealSelector =
  ".hero-copy,.hero-art,.section-head,.post-card,.feature-inner>div,.newsletter>*,.page-intro,.about-grid>*,.values>div,.article-top>*,.article-hero,.article-body>*,.comments>*,.editorial-feature>*";

export default function MotionEnhancements() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const update = useCallback(() => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    setProgress(Math.max(0, Math.min(100, (window.scrollY / max) * 100)));
    setShowTop(window.scrollY > 480);
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer =
      !reduceMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("in-view");
                  observer?.unobserve(entry.target);
                }
              });
            },
            { rootMargin: "0px 0px -5% 0px", threshold: 0.06 },
          )
        : null;

    const observe = () => {
      document.querySelectorAll<HTMLElement>(revealSelector).forEach((element, index) => {
        if (element.dataset.motionReady) return;
        element.dataset.motionReady = "true";
        element.classList.add("motion-reveal");
        element.style.setProperty("--reveal-order", String(index % 3));
        if (reduceMotion || !observer) element.classList.add("in-view");
        else observer.observe(element);
      });
    };

    document.documentElement.classList.add("motion-ready");
    observe();
    const mutationObserver = new MutationObserver(observe);
    const main = document.querySelector("main");
    if (main) mutationObserver.observe(main, { childList: true, subtree: true });

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
        document.querySelector(".topbar")?.classList.toggle("is-scrolled", window.scrollY > 20);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mutationObserver.disconnect();
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [update]);

  return (
    <>
      <div className="reading-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <button
        className={`back-to-top ${showTop ? "visible" : ""}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </>
  );
}
