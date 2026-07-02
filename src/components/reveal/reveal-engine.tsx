"use client";

/**
 * Reveal engine: Studio conductor pass for the homepage hero.
 *
 * First visit in a browser session:
 * 1. The Studio house mark broadcasts once.
 * 2. Notes, Tasks, Timeline, and Signal receive the beat in work order.
 * 3. Every mark settles with no idle animation.
 *
 * Reduced motion, bfcache restore, and same-session revisits skip the
 * timeline and render the final meaningful state synchronously.
 */

import { useEffect } from "react";

const PRODUCT_KEYS = ["notes", "tasks", "timeline", "signal"] as const;
type ProductKey = (typeof PRODUCT_KEYS)[number];

const GESTURE_MS: Record<ProductKey, number> = {
  notes: 900,
  tasks: 960,
  timeline: 1180,
  signal: 920,
};

export function RevealEngine() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const Lenis = (await import("lenis")).default;

      if (cancelled) return;

      const cleanups: Array<() => void> = [];
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const rowFor = (key: ProductKey) =>
        document.querySelector<HTMLElement>(`.stack-row[data-key="${key}"]`);

      const splitChars = (wordEl: HTMLElement) => {
        if (wordEl.dataset.split === "1") return;
        const text = wordEl.textContent ?? "";
        if (!text) return;

        wordEl.dataset.split = "1";
        wordEl.textContent = "";

        const frag = document.createDocumentFragment();
        [...text].forEach((ch, i) => {
          const span = document.createElement("span");
          span.className = ch === " " ? "char char-space" : "char";
          span.style.setProperty("--ci", String(i));
          span.textContent = ch === " " ? "\u00a0" : ch;
          frag.appendChild(span);
        });

        wordEl.appendChild(frag);
      };

      document
        .querySelectorAll<HTMLElement>(".reveal-product-row .mark .word")
        .forEach(splitChars);

      const productRows = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal-product-row")
      );

      if (reduceMotion) {
        productRows.forEach((row) => row.classList.add("in"));
      } else {
        const rowIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("in");
              rowIO.unobserve(entry.target);
            });
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
        );

        productRows.forEach((row) => rowIO.observe(row));
        cleanups.push(() => rowIO.disconnect());
      }

      const fire = (key: ProductKey) => {
        const row = rowFor(key);
        if (!row) return;
        row.classList.remove("settled");
        row.classList.add("fire");
      };

      const settle = (key: ProductKey) => {
        const row = rowFor(key);
        if (!row) return;
        row.classList.remove("fire");
        row.classList.add("settled");
      };

      const settleAll = () => {
        PRODUCT_KEYS.forEach(settle);
      };

      const settleHouseMark = () => {
        const house = document.querySelector<HTMLElement>(".reveal-house-mark");
        if (!house) return;
        house.classList.remove("broadcast");
        house.classList.add("settled");
      };

      const restoreFinalState = () => {
        settleHouseMark();
        settleAll();
        gsap.set(".reveal-gold-rule", { width: 132 });
        gsap.set(".reveal-subhead", { y: 0, opacity: 1 });
        gsap.set(".reveal-house-mark", { y: 0, opacity: 1 });
        gsap.set(".stack-row", { x: 0, y: 0, opacity: 1 });
      };

      if (reduceMotion) {
        restoreFinalState();
      } else {
        const SESSION_KEY = "signal-hero-played";
        const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";

        const onPageShow = (event: PageTransitionEvent) => {
          if (event.persisted) restoreFinalState();
        };

        window.addEventListener("pageshow", onPageShow);
        cleanups.push(() => window.removeEventListener("pageshow", onPageShow));

        if (alreadyPlayed) {
          restoreFinalState();
        } else {
          const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
          });

          const tickerFn = (time: number) => lenis.raf(time * 1000);
          gsap.ticker.add(tickerFn);
          gsap.ticker.lagSmoothing(0);

          cleanups.push(() => {
            gsap.ticker.remove(tickerFn);
            lenis.destroy();
          });

          gsap.set(".reveal-gold-rule", { width: 0 });
          gsap.set(".reveal-subhead", { y: 8, opacity: 0 });
          gsap.set(".reveal-house-mark", { y: 10, opacity: 0 });
          gsap.set(".stack-row", { y: 14, opacity: 0 });

          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

          tl.to(".reveal-gold-rule", { width: 132, duration: 0.7 }, 0)
            .to(".reveal-subhead", { opacity: 1, y: 0, duration: 0.55 }, 0.42)
            .to(
              ".reveal-house-mark",
              { opacity: 1, y: 0, duration: 0.62 },
              0.78
            )
            .add(() => {
              document
                .querySelector(".reveal-house-mark")
                ?.classList.add("broadcast");
            }, 1.12)
            .add(settleHouseMark, 1.92);

          PRODUCT_KEYS.forEach((key, index) => {
            const row = rowFor(key);
            if (!row) return;

            const start = 1.42 + index * 0.42;
            tl.to(row, { opacity: 1, y: 0, duration: 0.56 }, start)
              .add(() => fire(key), start + 0.18)
              .add(() => settle(key), start + 0.18 + GESTURE_MS[key] / 1000);
          });

          tl.add(() => {
            settleAll();
            try {
              sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
              // Storage can be blocked. The animation may replay next visit.
            }
          }, 3.95);

          cleanups.push(() => tl.kill());
        }

        const hoverListeners: Array<{ el: HTMLElement; fn: () => void }> = [];
        const hoverTimeouts: number[] = [];

        document.querySelectorAll<HTMLElement>(".stack-row").forEach((row) => {
          let cooldown = false;
          const handler = () => {
            if (!row.classList.contains("settled") || cooldown) return;
            const key = row.dataset.key as ProductKey | undefined;
            if (!key || !PRODUCT_KEYS.includes(key)) return;

            cooldown = true;
            row.classList.remove("fire");
            void row.offsetWidth;
            row.classList.add("fire");

            const timeout = window.setTimeout(() => {
              settle(key);
              cooldown = false;
            }, GESTURE_MS[key]);
            hoverTimeouts.push(timeout);
          };

          row.addEventListener("mouseenter", handler);
          hoverListeners.push({ el: row, fn: handler });
        });

        cleanups.push(() => {
          hoverListeners.forEach(({ el, fn }) =>
            el.removeEventListener("mouseenter", fn)
          );
          hoverTimeouts.forEach((timeout) => window.clearTimeout(timeout));
        });
      }

      cleanup = () => {
        cleanups.splice(0).forEach((fn) => fn());
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
