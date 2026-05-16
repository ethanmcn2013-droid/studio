"use client";

/**
 * Reveal engine — orchestrates the GSAP entrance timeline, Lenis
 * momentum scroll, ScrollTrigger directional reveals, char-split for
 * per-character hover lift, and gesture hover-replay.
 *
 * Targets the markup rendered by RevealHero / RevealManifesto /
 * RevealProducts / RevealClosing via class selectors. No props —
 * this component is mount-and-forget.
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
      // Dynamic imports keep GSAP/Lenis out of the initial server bundle
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const Lenis = (await import("lenis")).default;

      gsap.registerPlugin(ScrollTrigger);

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
        gsap.set(".reveal-gold-rule", { scaleX: 1 });
        // Headline is server-rendered visible; no gsap.set needed.
        gsap.set(".reveal-subhead", { y: 0, opacity: 1 });
        gsap.set(".reveal-scroll-cue", { y: 0, opacity: 1 });
        return;
      }

      // ─── Lenis momentum scroll synced to ScrollTrigger ────────
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      const tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      // ─── Initial states (defensive) ───────────────────────────
      // Headline is intentionally NOT set hidden — it's server-rendered
      // visible to remove the ~800ms blank flash during GSAP's dynamic
      // import. The choreography below is for everything else.
      gsap.set(".reveal-gold-rule", { scaleX: 0 });
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

      // Each brand gesture fires as its row lands — choreographed order.
      // notes is intentionally omitted — absence of the gesture IS the gesture
      tl.add(() => fire("tasks"), 1.0)
        .add(() => fire("roadmap"), 1.16)
        .add(() => fire("analytics"), 1.32);

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

      // ─── Scroll-triggered post-reveal sections ─────────────────
      gsap.from(".reveal-manifesto-eyebrow", {
        scrollTrigger: {
          trigger: ".reveal-manifesto",
          start: "top 78%",
          once: true,
        },
        opacity: 0,
        y: 10,
        duration: 0.55,
        ease: "expo.out",
      });
      gsap.from(".reveal-manifesto-h2", {
        scrollTrigger: {
          trigger: ".reveal-manifesto",
          start: "top 78%",
          once: true,
        },
        opacity: 0,
        y: 16,
        duration: 0.75,
        ease: "expo.out",
        delay: 0.12,
      });
      gsap.from(".reveal-manifesto-body", {
        scrollTrigger: {
          trigger: ".reveal-manifesto-body",
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 12,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
      });

      // Proof beat — same restraint as the manifesto: eyebrow settles,
      // headline rises, the four scene lines stagger in like evidence
      // arriving in order, the outro signs off.
      gsap.from(".reveal-proof-eyebrow", {
        scrollTrigger: {
          trigger: ".reveal-proof",
          start: "top 78%",
          once: true,
        },
        opacity: 0,
        y: 10,
        duration: 0.55,
        ease: "expo.out",
      });
      gsap.from(".reveal-proof-h2", {
        scrollTrigger: {
          trigger: ".reveal-proof",
          start: "top 78%",
          once: true,
        },
        opacity: 0,
        y: 16,
        duration: 0.75,
        ease: "expo.out",
        delay: 0.12,
      });
      gsap.from(".reveal-proof-line", {
        scrollTrigger: {
          trigger: ".reveal-proof-scene",
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 12,
        duration: 0.6,
        stagger: 0.1,
        ease: "expo.out",
      });
      gsap.from(".reveal-proof-outro", {
        scrollTrigger: {
          trigger: ".reveal-proof-outro",
          start: "top 90%",
          once: true,
        },
        opacity: 0,
        y: 8,
        duration: 0.55,
        ease: "expo.out",
      });

      gsap.from(".reveal-products-head", {
        scrollTrigger: {
          trigger: ".reveal-products-head",
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 8,
        duration: 0.55,
        ease: "expo.out",
      });

      const productRows = gsap.utils.toArray<HTMLElement>(
        ".reveal-product-row"
      );
      productRows.forEach((row) => {
        const left = row.querySelector(".left");
        const right = row.querySelector(".right");
        const trigger = {
          trigger: row,
          start: "top 82%",
          once: true,
        };
        if (left) {
          gsap.from(left, {
            scrollTrigger: trigger,
            opacity: 0,
            x: -28,
            duration: 0.7,
            ease: "expo.out",
          });
        }
        if (right) {
          gsap.from(right, {
            scrollTrigger: trigger,
            opacity: 0,
            x: 28,
            duration: 0.7,
            ease: "expo.out",
            delay: 0.1,
          });
        }
      });

      // Closing: accent hairline expands, sign-off rises, address signs off
      gsap.from(".reveal-closing-rule", {
        scrollTrigger: {
          trigger: ".reveal-closing",
          start: "top 82%",
          once: true,
        },
        width: 0,
        duration: 0.55,
        ease: "expo.out",
      });
      gsap.from(".reveal-closing-sign", {
        scrollTrigger: {
          trigger: ".reveal-closing",
          start: "top 82%",
          once: true,
        },
        opacity: 0,
        y: 14,
        duration: 0.75,
        delay: 0.2,
        ease: "expo.out",
      });
      gsap.from(".reveal-closing-addr", {
        scrollTrigger: {
          trigger: ".reveal-closing",
          start: "top 82%",
          once: true,
        },
        opacity: 0,
        y: 8,
        duration: 0.55,
        delay: 0.42,
        ease: "expo.out",
      });

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
        ScrollTrigger.getAll().forEach((st) => st.kill());
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
