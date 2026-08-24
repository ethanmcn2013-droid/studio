"use client";

import { motion, AnimatePresence } from "motion/react";
import { CinematicDemo } from "./showcase/cinematic-demo";
import { DOMAINS, type DomainId } from "@/components/marketing/heroes/tasks/lib/domains";

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
  // One workspace, fixed. Wedding matches the GTM wedge (Founding Venue
  // Programme) and is the highest-empathy opener for a first-time visitor.
  // The other three packs stay in `domains.ts` for later use.
  const domain: DomainId = "wedding";
  const pack = DOMAINS[domain];

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
      <div
        className={
          embedded
            ? "mx-auto w-full max-w-[1240px]"
            : "mx-auto mt-6 w-full max-w-[1240px] px-5 md:mt-8 md:px-6"
        }
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={domain}
            role={embedded ? "region" : undefined}
            aria-label={embedded ? "Scrollable Signal Tasks board" : undefined}
            tabIndex={embedded ? 0 : undefined}
            initial={{ opacity: 0, transform: "translateY(8px)" }}
            animate={{ opacity: 1, transform: "translateY(0)" }}
            exit={{ opacity: 0, transform: "translateY(-4px)" }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="demo-fit mx-auto"
          >
            <div className="demo-fit-inner">
              <CinematicDemo domain={pack.id} staticFrame={embedded} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

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
          .tasks-embedded .demo-fit {
            height: 590px;
            overflow-x: auto;
            overflow-y: hidden;
            overscroll-behavior-inline: contain;
            scrollbar-width: thin;
          }
          .tasks-embedded .demo-fit > .demo-fit-inner {
            width: 1180px;
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
