"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { CinematicDemo } from "./showcase/cinematic-demo";
import { DOMAINS, type DomainId } from "@/components/marketing/heroes/tasks/lib/domains";
import { useMarketingPreviewMotion } from "@/components/marketing/delight/marketing-preview-motion";

/**
 * POLISH 2026-07-28 — three changes from the design review.
 *
 *   grid    the copy column now sits on the site's 1080px grid (the same
 *           left edge the handoff and close use), while the board keeps its
 *           wider 1240px canvas. Copy on the grid, artifact allowed to
 *           exceed it: the same relationship the Timeline page uses.
 *   voice   the headline joins the shared register (one clamp, 600,
 *           -0.04em) instead of running 20% larger than every other page.
 *   eyebrow removed. It said "Signal Tasks" directly under a pill nav that
 *           already says Tasks; the page introduced itself twice.
 */
export function TasksTheBoard({
  embedded = false,
}: {
  embedded?: boolean;
} = {}) {
  const previewMotion = useMarketingPreviewMotion();
  const [compactViewport, setCompactViewport] = useState(false);
  // One workspace, fixed. Wedding matches the GTM wedge (Founding Venue
  // Programme) and is the highest-empathy opener for a first-time visitor.
  // The other three packs stay in `domains.ts` for later use.
  const domain: DomainId = "wedding";
  const pack = DOMAINS[domain];

  useEffect(() => {
    if (!embedded) return;

    const compactQuery = window.matchMedia("(max-width: 767px)");
    const syncCompactViewport = () => setCompactViewport(compactQuery.matches);
    syncCompactViewport();
    compactQuery.addEventListener("change", syncCompactViewport);
    return () =>
      compactQuery.removeEventListener("change", syncCompactViewport);
  }, [embedded]);

  return (
    <section
      className={`relative isolate overflow-hidden${embedded ? " tasks-embedded" : " pt-2 md:pt-6"}`}
      aria-label={embedded ? "Signal Tasks wedding workspace" : undefined}
    >
      {!embedded ? <div className="mx-auto w-full max-w-[1080px] px-[clamp(20px,_5vw,_72px)]">
        <h1 className="mt-5 max-w-[14ch] text-balance text-[clamp(2.5rem,_1.2rem_+_3.9vw,_4.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">
          Work that moves
        </h1>
        <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] text-ink-soft">
          One list in four views, changing in front of everyone who needs to
          see it.
        </p>

        <p className="mt-7 inline-flex items-center gap-2 text-[12.5px] text-ink-faint">
          <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
          Demo workspace
        </p>
      </div> : null}

      {/* The board keeps its wider canvas: copy on the grid, artifact
          allowed to exceed it. Below md, `.demo-fit` scales the whole
          proven canvas down to fit the phone instead of crushing four
          lanes into slivers — the 80% are phone-first and this is the
          most-seen product surface. */}
      {!compactViewport ? (
        <div
          className={
            embedded
              ? "tasks-full-proof mx-auto w-full max-w-[1240px]"
              : "mx-auto mt-6 w-full max-w-[1240px] px-5 md:mt-8 md:px-6"
          }
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={domain}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
              className="demo-fit mx-auto"
            >
              <div className="demo-fit-inner">
                <CinematicDemo
                  domain={pack.id}
                  homepageEmbedded={embedded}
                  paused={
                    embedded &&
                    previewMotion.hasStarted &&
                    !previewMotion.isVisible
                  }
                  staticFrame={embedded && !previewMotion.hasStarted}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {embedded ? (
        <div className="tasks-compact-proof" aria-hidden="true">
          <div className="tasks-compact-head">
            <span>Mara and Finn</span>
            <strong>Venue details</strong>
            <span>2 views</span>
          </div>
          <div className="tasks-compact-board">
            <div className="tasks-compact-lane">
              <span className="tasks-compact-lane-mark" aria-hidden />
              <strong>Open</strong>
              <span>1</span>
            </div>
            <div className="tasks-compact-lane tasks-compact-lane-done">
              <span className="tasks-compact-lane-mark" aria-hidden />
              <strong>Done</strong>
              <span>1</span>
            </div>
            <article className="tasks-compact-card">
              <span className="tasks-compact-state">
                <i aria-hidden />
                Venue
              </span>
              <strong>Ask the venue to hold the side room after six.</strong>
              <span className="tasks-compact-owner">
                <i aria-hidden>M</i>
                Mara
              </span>
            </article>
          </div>
          <div className="tasks-compact-receipt">
            <span className="tasks-compact-check" aria-hidden>✓</span>
            <span>
              <strong>Commitment completed</strong>
              Owner and source kept with the task.
            </span>
          </div>
        </div>
      ) : null}

      {/* PORT FIX 2026-07-28 — these rules lived in the tasks repo's
          globals.css and did not come across with the hero, so phones got
          four 84px lanes instead of a scaled board. Copied with the
          original's approach intact: pure CSS, SSR-safe, and an ancestor
          scale() never touches the scripted scene's own coordinate space.
          The scale factor divides a length by a length so min() compares
          like with like. 1180 is the demo design width; 704 is the measured
          natural height of this demo at that width (chrome + subheader +
          560 surface + status bar + borders). */}
      <style>{`
        @media (max-width: 767px) {
          .demo-fit {
            overflow: hidden;
            height: calc(704px * min(1, (100vw - 2.5rem) / 1180px));
          }
          .demo-fit > .demo-fit-inner {
            width: 1180px;
            transform-origin: top left;
            transform: scale(min(1, (100vw - 2.5rem) / 1180px));
          }
          .tasks-embedded .tasks-full-proof {
            display: none;
          }
        }

        .tasks-compact-proof {
          display: none;
        }

        @media (max-width: 767px) {
          .tasks-embedded .tasks-compact-proof {
            display: block;
            min-height: 388px;
            overflow: hidden;
            border: 1px solid var(--hairline);
            border-radius: 9px;
            background: var(--paper-deep);
            color: var(--ink);
          }

          .tasks-compact-head {
            min-height: 62px;
            display: grid;
            grid-template-columns: 1fr auto;
            align-content: center;
            gap: 3px 14px;
            padding: 12px 14px;
            border-bottom: 1px solid var(--hairline);
            background: var(--paper);
            color: var(--ink-faint);
            font-family: var(--font-mono);
            font-size: 8.5px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .tasks-compact-head strong {
            grid-row: 2;
            color: var(--ink);
            font-family: var(--font-sans);
            font-size: 15px;
            font-weight: 620;
            letter-spacing: -0.015em;
            text-transform: none;
          }

          .tasks-compact-head > span:last-child {
            grid-column: 2;
            grid-row: 1 / 3;
            align-self: center;
          }

          .tasks-compact-board {
            position: relative;
            height: 224px;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .tasks-compact-lane {
            min-width: 0;
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-content: start;
            align-items: center;
            gap: 6px;
            padding: 13px 11px;
            border-right: 1px solid var(--hairline);
            background: color-mix(in srgb, var(--status-blocked) 4%, var(--paper));
            font-size: 10px;
          }

          .tasks-compact-lane-done {
            border-right: 0;
            background: color-mix(in srgb, var(--status-done) 5%, var(--paper));
          }

          .tasks-compact-lane-mark {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--status-blocked);
          }

          .tasks-compact-lane-done .tasks-compact-lane-mark {
            background: var(--status-done);
          }

          .tasks-compact-lane > span:last-child {
            color: var(--ink-faint);
            font-family: var(--font-mono);
            font-size: 9px;
          }

          .tasks-compact-card {
            position: absolute;
            top: 49px;
            left: 10px;
            width: calc(50% - 20px);
            min-height: 140px;
            display: flex;
            flex-direction: column;
            padding: 12px;
            border: 1px solid var(--hairline);
            border-radius: 7px;
            background: var(--paper);
            box-shadow: 0 12px 30px -26px rgba(17, 17, 17, 0.44);
            transform: translateX(calc(100% + 20px));
          }

          .tasks-compact-state {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: var(--ink-faint);
            font-family: var(--font-mono);
            font-size: 8px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .tasks-compact-state i {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--accent);
          }

          .tasks-compact-card > strong {
            margin-top: 12px;
            font-size: 12px;
            font-weight: 610;
            letter-spacing: -0.01em;
            line-height: 1.38;
          }

          .tasks-compact-owner {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-top: auto;
            color: var(--ink-soft);
            font-size: 9px;
          }

          .tasks-compact-owner i {
            width: 20px;
            height: 20px;
            display: inline-grid;
            place-items: center;
            border-radius: 50%;
            background: var(--accent-tint);
            color: var(--accent);
            font-family: var(--font-mono);
            font-size: 8px;
            font-style: normal;
          }

          .tasks-compact-receipt {
            min-height: 100px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            border-top: 1px solid var(--hairline);
            background: var(--paper);
            color: var(--ink-soft);
            font-size: 10px;
            line-height: 1.45;
          }

          .tasks-compact-receipt strong {
            display: block;
            margin-bottom: 3px;
            color: var(--ink);
            font-size: 11px;
            font-weight: 620;
          }

          .tasks-compact-check {
            width: 28px;
            height: 28px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border: 1px solid var(--status-done);
            border-radius: 50%;
            color: var(--status-done);
          }

          .marketing-preview-motion[data-motion-started="true"][data-motion-visible="true"] .tasks-compact-card {
            animation: tasks-compact-move 560ms var(--ease-out) 180ms both;
          }

          .marketing-preview-motion[data-motion-started="true"][data-motion-visible="true"] .tasks-compact-receipt {
            animation: tasks-compact-receipt 360ms var(--ease-out) 620ms both;
          }
        }

        @keyframes tasks-compact-move {
          from {
            opacity: 0.76;
            transform: translateX(0);
          }
          to {
            opacity: 1;
            transform: translateX(calc(100% + 20px));
          }
        }

        @keyframes tasks-compact-receipt {
          from {
            opacity: 0;
            transform: translateY(7px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .marketing-preview-motion[data-motion-started="true"][data-motion-visible="false"] .tasks-embedded *,
        .marketing-preview-motion[data-motion-started="true"][data-motion-visible="false"] .tasks-embedded *::before,
        .marketing-preview-motion[data-motion-started="true"][data-motion-visible="false"] .tasks-embedded *::after {
          animation-play-state: paused !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .tasks-compact-card,
          .tasks-compact-receipt {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
