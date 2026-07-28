"use client";

import { useEffect, useState } from "react";
import { TimelineArtifact } from "@/components/marketing/heroes/timeline/artifact/timeline-artifact";
import { TIMELINE_HERO_FIXTURE } from "./fixture";

/**
 * Timeline hero, rebuilt 2026-07-27.
 *
 * The visual is the real thing: `TimelineArtifact` from the app, unmodified,
 * on a frozen fixture DTO. The TimeLens in the top right is the app's own
 * control, so days-remaining and percent-complete behave here exactly as they
 * do in the product.
 *
 * GALLERY EDIT 2026-07-27 (revised) — the spoken overture is gone. It was
 * built to match The Brief's, and it did, but the two heroes are not doing the
 * same job: Signal has to explain an idea before it can show one, whereas the
 * timeline explains itself the moment it draws. Seven seconds of held text in
 * front of it was a toll on the thing people came to see. The hero now opens
 * straight onto the artifact and lets the rail do the talking.
 */

/** A beat to let the frame paint before the rail starts drawing. */
const OPEN_DELAY_MS = 120;

export function TimelineTheLine() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setOpened(true);
      return;
    }
    const timer = window.setTimeout(() => setOpened(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="tlh" data-opened={opened ? "true" : undefined}>
      <div className="tlh-frame">
        <div className="tlh-folio">
          <span className="tlh-folio-name">Shared plan</span>
          <span className="tlh-folio-rule" aria-hidden="true" />
          <span className="tlh-folio-link">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 11V8a5 5 0 0110 0v3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect x="5" y="11" width="14" height="9" rx="2" fill="currentColor" />
            </svg>
            timeline.signalstudio.ie/mara-and-finn
          </span>
        </div>

        {/* The artifact is mounted from the first frame so it reserves its
            space and the layout never jumps. But its entrance choreography
            fires on mount, which at t=0 is seven seconds before anyone can see
            it behind the overture veil — which is exactly why the timeline
            used to look like it simply appeared. Re-keying on `opened`
            remounts it as the veil lifts, so the rail draws and the milestones
            wake while the viewer is watching. */}
        <div className="tlh-artifact">
          <TimelineArtifact
            key={opened ? "run" : "idle"}
            timeline={TIMELINE_HERO_FIXTURE}
          />
        </div>

        <p className="tlh-foot">
          Anyone with the link sees this. No account, no login, nothing hidden.
        </p>
      </div>

      <style>{CSS}</style>
    </section>
  );
}

const CSS = `
.tlh {
  --tlh-ease-soft: cubic-bezier(0.16, 1, 0.3, 1); /* ds-allow — hero motion choreography */

  position: relative;
  /* PORT NOTE 2026-07-28 — was min-height 100svh for a standalone gallery
     route. As a hero it is one band above the rest of the page, so it sizes
     to the artifact and keeps only a floor. */
  min-height: clamp(600px, 78svh, 820px);
  display: grid;
  place-items: center;
  /* Narrower side padding than the other heroes on purpose: this one is
     meant to read as the artifact actually open, so it runs closer to the
     edge of the screen than a centred column would. */
  padding: clamp(20px, 4vw, 56px) clamp(14px, 2.4vw, 40px);
  background: var(--paper);
  font-family: var(--font-sans, var(--font-geist-sans));
  isolation: isolate;
}

/* ── frame ───────────────────────────────────────────────────────────── */

/* 2026-07-28 — widened from 1080px. Timeline is the one hero whose subject is
   a document rather than a workspace: it should read as the shared plan
   actually open on screen, not as a screenshot of one sitting in a column.
   The artifact drives its own layout from container queries (widest above
   980px), so the frame can grow without anything inside it breaking, and the
   six milestones simply take more of the rail. Capped so ultrawide displays
   do not stretch the rail into a thin line with distant dots. */
.tlh-frame {
  width: 100%;
  max-width: min(1560px, 96vw);
  opacity: 0;
  transform: translateY(10px);
}

.tlh[data-opened="true"] .tlh-frame {
  animation: tlh-settle 760ms var(--tlh-ease-soft) both;
}

@keyframes tlh-settle {
  to { opacity: 1; transform: translateY(0); }
}

.tlh-folio {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  font-family: var(--font-mono, var(--font-geist-mono));
  font-size: 10.5px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.tlh-folio-rule {
  flex: 1;
  height: 1px;
  background: var(--hairline);
}

.tlh-folio-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 11px;
}

.tlh-folio-link svg {
  width: 12px;
  height: 12px;
  color: var(--ink-ghost);
}

/* The artifact ships its own surface. The hero only lifts it off the page. */
.tlh-artifact {
  border: 1px solid var(--hairline);
  border-radius: 16px;
  overflow: hidden;
  background: var(--paper);
  box-shadow:
    0 1px 2px rgba(17, 17, 17, 0.03),
    0 28px 64px -20px rgba(17, 17, 17, 0.16);
}

.tlh-foot {
  margin: 16px 0 0;
  text-align: center;
  font-size: 12.5px;
  color: var(--ink-faint);
}

@media (prefers-reduced-motion: reduce) {
  .tlh-frame,
  .tlh[data-opened="true"] .tlh-frame {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
`;
