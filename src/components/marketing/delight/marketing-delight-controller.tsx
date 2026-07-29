"use client";

import { useEffect } from "react";

/**
 * Runs the two intentionally rare marketing one-shots.
 *
 * Content is visible without JavaScript. The observer only adds the state
 * attribute that lets CSS acknowledge a meaningful viewport arrival. Each
 * target is released after its first intersection, so no ambient loop or
 * repeated scroll theatre remains.
 */
export function MarketingDelightController() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-delight-once]"),
    );

    if (targets.length === 0) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach((target) => {
        target.dataset.delightVisible = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.dataset.delightVisible = "true";
          observer.unobserve(target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return null;
}
