"use client";

import { useEffect } from "react";

/**
 * The floor's arrival reveal, on pages that do not run the scene engine.
 * Every `.rise` element under the floor page starts lifted and faded and
 * settles once it enters the viewport. Reduced motion and browsers without
 * IntersectionObserver land everything at once; without JavaScript the
 * page's <noscript> style shows the end state.
 */
export function FloorRise() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(".floor-page .rise"),
    );
    if (targets.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
