"use client";

import { motion, AnimatePresence } from "motion/react";
import { CinematicDemo } from "./showcase/cinematic-demo";
import { DOMAINS, type DomainId } from "@/components/marketing/heroes/tasks/lib/domains";

export function TasksTheBoard() {
  // One workspace, fixed. Wedding matches the GTM wedge (Founding Venue
  // Programme) and is the highest-empathy opener for a first-time visitor.
  // The other three packs stay in `domains.ts` for later use.
  const domain: DomainId = "wedding";
  const pack = DOMAINS[domain];

  return (
    <section className="relative isolate overflow-hidden pt-2 md:pt-6">
      <div className="mx-auto w-full max-w-[1240px] px-5 md:px-6">
        <Eyebrow />
        {/* GALLERY EDIT 2026-07-27 — copy cut to the Notes shape.
            Was: "Execution clarity for live work." over a four-clause
            sentence carrying views, real-time, dates and "no vocabulary tax".
            Four promises in one breath is a specification, not a headline,
            and the last clause is itself jargon about avoiding jargon.
            Notes works because it names one job in plain words and lets the
            hero prove it. This does the same: the board underneath is already
            showing people moving work, so the headline only has to point at
            it. */}
        <h1 className="mt-5 max-w-[14ch] text-balance text-[clamp(2.6rem,1.8rem+4.6vw,5.5rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-ink">
          Work that moves
        </h1>
        <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] text-ink-soft">
          One list in four views, changing in front of everyone who needs to
          see it.
        </p>

        <p className="mt-7 inline-flex items-center gap-2 text-[12.5px] text-ink-faint">
          <span className="block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
          Demo is live
        </p>

        {/* GALLERY EDIT 2026-07-27 — the audience pill row (Wedding planner,
            Trades, Freelance, College student) is gone. Four switchable
            personas asked the visitor to pick an identity before they had
            seen anything work, and the row sat between the headline and the
            product at exactly the point the eye should be travelling down
            into the board. One workspace, shown well, does more. */}

        {/* Demo, keyed by domain so swap = clean state reset.
         *  Desktop renders at natural fluid width (perspective +
         *  shadow intact). Below md, `.demo-fit` scales the whole
         *  proven canvas down to fit the phone instead of clipping it
         *  to a headless sliver, the 80% are phone-first and this is
         *  the most-seen product surface. Scale rules: globals.css. */}
        <div className="mt-6 md:mt-8">
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
                <CinematicDemo domain={pack.id} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Eyebrow() {
  return (
    <p
      className="font-mono text-[11px] font-semibold uppercase text-ink-quiet"
      style={{ letterSpacing: "0.14em" }}
    >
      Signal Tasks
    </p>
  );
}
