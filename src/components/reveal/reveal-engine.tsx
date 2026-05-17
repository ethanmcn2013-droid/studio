"use client";

/**
 * Reveal engine — orchestrates the GSAP hero entrance timeline, Lenis
 * momentum scroll, char-split for per-character hover lift, and gesture
 * hover-replay.
 *
 * GSAP is used exclusively for the hero entrance choreography.
 * Secondary section reveals (manifesto, proof, products, closing) use
 * the CSS .reveal scroll-driven pattern in globals.css — no JS, no
 * ScrollTrigger, baseline-visible, reduced-motion safe.
 *
 * Targets the markup rendered by RevealHero via class selectors. No
 * props — this component is mount-and-forget.
 *
 * Reduced-motion is honored: when the user prefers reduced motion,
 * the timeline + Lenis are skipped and final states are set
 * synchronously.
 */

import { useEffect } from "react";

export function RevealEngine() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      // Dynamic imports keep GSAP/Lenis out of the initial server bundle.
      // ScrollTrigger is intentionally not imported — secondary sections
      // now use the CSS .reveal scroll-driven pattern (no JS dependency).
      const { gsap } = await import("gsap");
      const Lenis = (await import("lenis")).default;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ─── Char-split product wordmarks for per-char hover lift ──
      const splitChars = (wordEl: HTMLElement) => {
        const text = wordEl.textContent ?? "";
        if (!text) return;
        wordEl.textContent = "";
        const frag = document.createDocumentFragment();
        [...text].forEach((ch, i) => {
          const span = document.createElement("span");
          span.className = "char";
          span.style.setProperty("--ci", String(i));
          span.textContent = ch === " " ? " " : ch;
          frag.appendChild(span);
        });
        wordEl.appendChild(frag);
      };
      document
        .querySelectorAll<HTMLElement>(".reveal-product-row .mark .word")
        .forEach(splitChars);

      // ─── Reduced-motion early return — set final states ───────
      const fire = (key: string) => {
        document
          .querySelector(`.stack-row[data-key="${key}"]`)
          ?.classList.add("fire");
      };

      if (reduceMotion) {
        document
          .querySelectorAll(".stack-row")
          .forEach((r) => r.classList.add("fire"));
        gsap.set(".reveal-gold-rule", { width: 132 });
        // Headline is server-rendered visible; no gsap.set needed.
        gsap.set(".reveal-subhead", { y: 0, opacity: 1 });
        gsap.set(".reveal-scroll-cue", { y: 0, opacity: 1 });
        return;
      }

      // ─── Lenis momentum scroll ────────────────────────────────
      // No ScrollTrigger sync needed — all secondary reveals are CSS-driven.
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // ─── Initial states (defensive) ───────────────────────────
      // Headline is intentionally NOT set hidden — it's server-rendered
      // visible to remove the ~800ms blank flash during GSAP's dynamic
      // import. The choreography below is for everything else.
      gsap.set(".reveal-gold-rule", { width: 0 });
      gsap.set(".reveal-subhead", { y: 8, opacity: 0 });
      gsap.set(".stack-row", { y: 10, opacity: 0 });
      gsap.set(".reveal-scroll-cue", { y: 4, opacity: 0 });

      // ─── Entrance timeline ────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Kowalski pass (2026-05-15): the headline is server-rendered
      // visible, so the old timeline left the page motionless for 2.2s —
      // it read as frozen, and the scroll cue didn't exist until 4.8s.
      // The whole entrance now resolves by ~2.4s: every beat earns its
      // place, nothing makes the visitor wait on the UI.

      // Accent hairline draws under the (already-visible) headline.
      tl.to(".reveal-gold-rule", { width: 132, duration: 0.5 }, 0);

      // Subhead settles almost immediately — typewriter starts ~700ms
      // (see TypewriterSub), riding just behind this fade.
      tl.to(
        ".reveal-subhead",
        { opacity: 1, y: 0, duration: 0.5 },
        0.35
      );

      // Four-row stack — gentle back-out for character, not bounce.
      // 1.4 overshoot was too springy for a restraint brand; 1.1 reads
      // as "settled with intent".
      tl.to(
        ".stack-row",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "back.out(1.1)",
          stagger: 0.08,
        },
        0.6
      );

      // Each brand gesture fires as its row lands — choreographed to
      // cascade top-to-bottom in the ratified stack order
      // (roadmap → tasks → notes → analytics). notes is intentionally
      // omitted — absence of the gesture IS the gesture — so analytics,
      // now the bottom row, fires a beat later than the old 1.32 to
      // land with its row rather than before it.
      tl.add(() => fire("roadmap"), 1.0)
        .add(() => fire("tasks"), 1.16)
        .add(() => fire("analytics"), 1.4);

      // Scroll cue arrives while the visitor is still looking at the hero,
      // not 3 seconds after they've already decided to leave.
      tl.to(
        ".reveal-scroll-cue",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          onComplete: () =>
            document.querySelector(".reveal-scroll-cue")?.classList.add("bob"),
        },
        1.7
      );

      // Secondary sections below the hero now use the CSS .reveal
      // scroll-driven pattern (globals.css) — no GSAP/ScrollTrigger
      // dependency, baseline-visible, reduced-motion safe. GSAP here
      // is reserved exclusively for the hero entrance above.

      // ─── Hover-replay (hero stack + product rows) ──────────────
      const hoverListeners: Array<{ el: HTMLElement; fn: () => void }> = [];

      const wireHoverReplay = (
        selector: string,
        replayClass: "fire" | "replay"
      ) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((row) => {
          let cooldown = false;
          const handler = () => {
            const key = row.dataset.key;
            if (replayClass === "fire" && !row.classList.contains("fire")) {
              return;
            }
            if (cooldown) return;
            cooldown = true;
            row.classList.remove(replayClass);
            void row.offsetWidth;
            row.classList.add(replayClass);
            const wait = key === "tasks" ? 600 : 1200;
            setTimeout(() => {
              cooldown = false;
            }, wait);
          };
          row.addEventListener("mouseenter", handler);
          hoverListeners.push({ el: row, fn: handler });
        });
      };
      wireHoverReplay(".stack-row", "fire");
      wireHoverReplay(".reveal-product-row", "replay");

      // ─── Cleanup on unmount ────────────────────────────────────
      cleanup = () => {
        tl.kill();
        gsap.ticker.remove(tickerFn);
        lenis.destroy();
        hoverListeners.forEach(({ el, fn }) =>
          el.removeEventListener("mouseenter", fn)
        );
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return null;
}
