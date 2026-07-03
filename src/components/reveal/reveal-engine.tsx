"use client";

/**
 * Reveal engine, orchestrates the GSAP hero entrance timeline, Lenis
 * momentum scroll, char-split for per-character hover lift, and gesture
 * hover-replay.
 *
 * GSAP is used exclusively for the hero entrance choreography.
 * Secondary section reveals (manifesto, proof, products, closing) use
 * the CSS .reveal scroll-driven pattern in globals.css, no JS, no
 * ScrollTrigger, baseline-visible, reduced-motion safe.
 *
 * Targets the markup rendered by RevealHero via class selectors. No
 * props, this component is mount-and-forget.
 *
 * Reduced-motion is honored: when the user prefers reduced motion,
 * the timeline + Lenis are skipped and final states are set
 * synchronously.
 *
 * P1-6 fix (2026-05-18): hero entrance is first-visit-only per session.
 * Back-nav (bfcache pageshow) and same-session revisits skip the entrance
 * and restore the final settled state via sessionStorage + pageshow gate.
 *
 * P3-2 fix (2026-05-18): first paint is a clean top-of-hero state.
 * The gold rule starts at width:0 in CSS (globals.css .reveal-gold-rule).
 * On back-nav bfcache restore, restoreFinalState() is called synchronously
 * before GSAP's dynamic import can reset elements to hidden initial states.
 *
 * P3-3 fix (2026-05-18): notes dot added to the entrance cascade. All four
 * products in the hero stack now have their brand gesture active after
 * the entrance completes. fires at t=1.28s (between tasks 1.16 and
 * analytics 1.4, one beat per product row).
 */

import { useEffect } from "react";

export function RevealEngine() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    (async () => {
      // Dynamic imports keep GSAP/Lenis out of the initial server bundle.
      // ScrollTrigger is intentionally not imported, secondary sections
      // now use the CSS .reveal scroll-driven pattern (no JS dependency).
      const { gsap } = await import("gsap");
      const Lenis = (await import("lenis")).default;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ─── Char-split product wordmarks for per-char hover lift ──
      const splitChars = (wordEl: HTMLElement) => {
        // Idempotency guard: bfcache restore re-mounts the engine; re-splitting
        // an already-split wordmark turns each .char into nested per-letter
        // spans and visually corrupts the mark.
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
          // Non-breaking space keeps multi-word marks ("daily signal")
          // from wrapping between words after char-split.
          span.textContent = ch === " " ? "\u00a0" : ch;
          frag.appendChild(span);
        });
        wordEl.appendChild(frag);
      };
      document
        .querySelectorAll<HTMLElement>(".reveal-product-row .mark .word")
        .forEach(splitChars);

      // ─── Product rows: cross-browser staggered scroll entrance ──
      // Safari has no animation-timeline:view(); a one-shot IO adds
      // .in per row, the children choreograph via CSS transitions
      // (globals.css). Reduced-motion → shown immediately, no motion.
      const productRows = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal-product-row")
      );
      let rowIO: IntersectionObserver | undefined;
      if (reduceMotion) {
        productRows.forEach((r) => r.classList.add("in"));
      } else {
        rowIO = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                rowIO?.unobserve(e.target);
              }
            });
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
        );
        productRows.forEach((r) => rowIO!.observe(r));
      }
      const ioPrevCleanup = cleanup;
      cleanup = () => {
        ioPrevCleanup?.();
        rowIO?.disconnect();
      };

      // ─── Helper: fire brand gesture on a stack row ─────────────
      const fire = (key: string) => {
        document
          .querySelector(`.stack-row[data-key="${key}"]`)
          ?.classList.add("fire");
      };

      // ─── Helper: restore final hero state (no animation) ──────
      // Used for: reduced-motion, back-nav bfcache restore,
      // and subsequent same-session visits.
      // P1-6 fix: hero must not replay on back-nav (ISSUE_REGISTER P1-6).
      // P3-2 fix: first paint is a clean settled state, not mid-animation.
      const restoreFinalState = () => {
        ["notes", "tasks", "timeline", "signal"].forEach(fire);
        gsap.set(".reveal-gold-rule", { width: 132 });
        // Headline is server-rendered visible; no gsap.set needed.
        gsap.set(".reveal-subhead", { y: 0, opacity: 1 });
        // Stack is now a horizontal row, clear x (and any legacy y).
        gsap.set(".stack-row", { x: 0, y: 0, opacity: 1 });
        gsap.set(".reveal-scroll-cue", { y: 0, opacity: 1 });
        document.querySelector(".reveal-scroll-cue")?.classList.add("bob");
      };

      // ─── Reduced-motion early return ──────────────────────────
      if (reduceMotion) {
        restoreFinalState();
        // Still fall through to wire hover-replay below.
      } else {
        // ─── P1-6: first-visit gate via sessionStorage ──────────
        // The hero entrance runs exactly once per browser session.
        // sessionStorage survives tab-lifetime but not close+reopen:
        // a new tab = fresh first impression. That scope is correct.
        const SESSION_KEY = "signal-hero-played";
        const alreadyPlayed = sessionStorage.getItem(SESSION_KEY) === "1";

        // bfcache handler: fires when the browser restores the page from
        // the back-forward cache (e.persisted === true). Without this, the
        // page is restored mid-GSAP state, which is the P3-2 mid-animation
        // first-paint defect on back-nav.
        const onPageShow = (e: PageTransitionEvent) => {
          if (e.persisted) {
            restoreFinalState();
          }
        };
        window.addEventListener("pageshow", onPageShow);

        // Register pageshow cleanup regardless of path below.
        const existingCleanup = cleanup;
        cleanup = () => {
          existingCleanup?.();
          window.removeEventListener("pageshow", onPageShow);
        };

        if (alreadyPlayed) {
          // Not first visit this session, skip entrance, go to final state.
          // GSAP entrance would reset .stack-row to opacity:0 then animate
          // up, that flash is visible before the animation starts. Skip it.
          restoreFinalState();
        } else {
          // ─── Lenis momentum scroll ────────────────────────────
          // No ScrollTrigger sync needed, all secondary reveals are CSS-driven.
          const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
          });
          const tickerFn = (time: number) => lenis.raf(time * 1000);
          gsap.ticker.add(tickerFn);
          gsap.ticker.lagSmoothing(0);

          // ─── Initial states (defensive) ──────────────────────
          // Headline is intentionally NOT set hidden, it's server-rendered
          // visible to remove the ~800ms blank flash during GSAP's dynamic
          // import. The choreography below is for everything else.
          gsap.set(".reveal-gold-rule", { width: 0 });
          gsap.set(".reveal-subhead", { y: 8, opacity: 0 });
          // Horizontal row: rows start offset to the left + a tiny y to
          // add a vertical settle on arrival. fromTo in the timeline below
          // re-declares these, gsap.set here ensures the pre-animation
          // first paint isn't a flash of the final state.
          gsap.set(".stack-row", { x: -40, y: 6, opacity: 0 });
          gsap.set(".reveal-scroll-cue", { y: 4, opacity: 0 });

          // ─── Entrance timeline ────────────────────────────────
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

          // Choreography pass (2026-05-20, flag #4): the prior 0.95s ride /
          // 0.18s stagger / back.out(0.7) timing still blew through the
          // four products before the eye could resolve each wordmark, the
          // overshoot bounce read as rushed at that duration. New cadence
          // is deliberately cinematic: each row gets a clear arrival beat,
          // a 0.3s breath, then its brand gesture punctuates. Total hero
          // resolve ~3.9s, generous on purpose. Ethan flagged this four
          // times; trust the gut and let it breathe.

          // Accent hairline draws under the (already-visible) headline.
          // Lengthened to match the slower entrance rhythm.
          tl.to(".reveal-gold-rule", { width: 132, duration: 0.7 }, 0);

          // Subhead settles. Typewriter starts ~700ms (see TypewriterSub),
          // riding just behind this fade.
          tl.to(
            ".reveal-subhead",
            { opacity: 1, y: 0, duration: 0.6 },
            0.45
          );

          // Four-product row, each wordmark arrives with momentum and
          // settles firmly. expo.out (vs back.out) eliminates the bounce
          // that was reading as staccato at slower speeds. Subtle y:6
          // adds a vertical settle on top of the horizontal entry so the
          // arrival feels earned, not slid. Stagger 0.34s gives the eye
          // time to recognise each wordmark before the next begins.
          tl.fromTo(
            ".stack-row",
            { opacity: 0, x: -40, y: 6 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.34,
            },
            0.95
          );

          // Each brand gesture fires ~0.3s after its row finishes landing,
          // cascading in the operator-directed stack order (notes → tasks
          // → timeline → signal, 2026-05-18). Each gesture gets its own
          // beat instead of overlapping with the still-arriving row.
          //
          // Per-row landing times (start + duration):
          //   notes:     0.95 + 1.20 = 2.15s  → fire 2.45
          //   tasks:     1.29 + 1.20 = 2.49s  → fire 2.79
          //   timeline:  1.63 + 1.20 = 2.83s  → fire 3.13
          //   signal:    1.97 + 1.20 = 3.17s  → fire 3.47
          tl.add(() => fire("notes"),     2.45)
            .add(() => fire("tasks"),     2.79)
            .add(() => fire("timeline"),  3.13)
            .add(() => fire("signal"),    3.47);

          // Scroll cue arrives just after the final gesture lands, so the
          // visitor finishes reading the suite before the cue invites them
          // onward.
          tl.to(
            ".reveal-scroll-cue",
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              onComplete: () => {
                document
                  .querySelector(".reveal-scroll-cue")
                  ?.classList.add("bob");
                // Mark entrance as played for this session.
                // Try/catch: sessionStorage can be blocked in private
                // browsing or at storage quota. Silently skip if so.
                try {
                  sessionStorage.setItem(SESSION_KEY, "1");
                } catch {
                  // Blocked, entrance will replay next same-session visit.
                  // Acceptable: the re-play is not a breakage.
                }
              },
            },
            3.85
          );

          // Secondary sections below the hero now use the CSS .reveal
          // scroll-driven pattern (globals.css), no GSAP/ScrollTrigger
          // dependency, baseline-visible, reduced-motion safe. GSAP here
          // is reserved exclusively for the hero entrance above.

          const previousCleanup = cleanup;
          cleanup = () => {
            previousCleanup?.();
            tl.kill();
            gsap.ticker.remove(tickerFn);
            lenis.destroy();
          };
        }
      }

      // ─── Hover-replay (hero stack + product rows) ──────────────
      // Wired regardless of whether the entrance ran or was skipped.
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
      const prevCleanup = cleanup;
      cleanup = () => {
        prevCleanup?.();
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
