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
      const pulseStack = (key: string) => {
        const row = document.querySelector<HTMLElement>(
          `.stack-row[data-key="${key}"]`
        );
        if (!row) return;
        row.classList.add("fire");
        row.classList.remove("sequence-fire");
        void row.offsetWidth;
        row.classList.add("sequence-fire");
      };

      if (reduceMotion) {
        document
          .querySelectorAll(".stack-row")
          .forEach((r) => r.classList.add("fire"));
        return;
      }

      // ─── Lenis momentum scroll synced to ScrollTrigger ────────
      const lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // ─── Initial states (defensive) ───────────────────────────
      gsap.set(".reveal-gold-rule", { width: 0 });
      gsap.set(".reveal-headline .word-inner", { y: "110%" });
      gsap.set(".reveal-subhead", { y: 8, opacity: 0 });
      gsap.set(".stack-row", { y: 10, opacity: 0 });
      gsap.set(".reveal-scroll-cue", { y: 4, opacity: 0 });

      // ─── Entrance timeline ────────────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Antique-gold hairline draws
      tl.to(".reveal-gold-rule", { width: 132, duration: 0.55 }, 0.30);

      // Headline — words rise from beneath their masks
      tl.to(
        ".reveal-headline .word-inner",
        {
          y: "0%",
          duration: 0.95,
          ease: "expo.out",
          stagger: 0.1,
        },
        0.55
      );

      // Subhead settles
      tl.to(
        ".reveal-subhead",
        { opacity: 1, y: 0, duration: 0.55 },
        2.2
      );

      // Four-row stack — each row enters with a slight back-out for character
      tl.to(
        ".stack-row",
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "back.out(1.4)",
          stagger: 0.12,
        },
        2.55
      );

      // Let one signal travel through the suite in order.
      tl.add(() => pulseStack("tasks"), 2.85)
        .add(() => pulseStack("roadmap"), 3.12)
        .add(() => pulseStack("analytics"), 3.39)
        .add(() => pulseStack("notes"), 3.66);

      // Scroll cue arrives after the silence beat
      tl.to(
        ".reveal-scroll-cue",
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          onComplete: () =>
            document.querySelector(".reveal-scroll-cue")?.classList.add("bob"),
        },
        4.8
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
          start: "top 68%",
          once: true,
        };
        if (left) {
          gsap.from(left, {
            scrollTrigger: trigger,
            opacity: 0,
            x: -28,
            duration: 1.05,
            ease: "expo.out",
          });
        }
        if (right) {
          gsap.from(right, {
            scrollTrigger: trigger,
            opacity: 0,
            x: 28,
            duration: 1.05,
            ease: "expo.out",
            delay: 0.16,
          });
        }
      });

      ScrollTrigger.create({
        trigger: ".reveal-products",
        start: "top 68%",
        once: true,
        onEnter: () => {
          productRows.forEach((row, index) => {
            window.setTimeout(() => {
              row.classList.add("sequence-fire");
            }, index * 260);
          });
        },
      });

      // Closing: gold hairline expands, sign-off rises, address signs off
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
      const wireHoverReplay = (
        selector: string,
        replayClass: "fire" | "replay"
      ) => {
        document.querySelectorAll<HTMLElement>(selector).forEach((row) => {
          let cooldown = false;
          row.addEventListener("mouseenter", () => {
            const key = row.dataset.key;
            if (replayClass === "fire" && !row.classList.contains("fire")) {
              return;
            }
            if (cooldown) return;
            cooldown = true;
            row.classList.remove(replayClass);
            row.classList.remove("sequence-fire");
            void row.offsetWidth;
            row.classList.add(replayClass);
            if (replayClass === "fire") {
              row.classList.add("sequence-fire");
            }
            const wait = key === "tasks" ? 600 : 1200;
            setTimeout(() => {
              cooldown = false;
            }, wait);
          });
        });
      };
      wireHoverReplay(".stack-row", "fire");
      wireHoverReplay(".reveal-product-row", "replay");

      // ─── Cleanup on unmount ────────────────────────────────────
      cleanup = () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        tl.kill();
        lenis.destroy();
      };
    })();

    return () => {
      cleanup?.();
    };
  }, []);

  return null;
}
