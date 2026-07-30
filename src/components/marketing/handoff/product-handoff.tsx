"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductId } from "@/lib/product-urls";

/**
 * The handoff — the one section below each product hero.
 *
 * Built 2026-07-28. The hero proves the product; the handoff proves the
 * suite. Each page shows the single moment its product passes work to the
 * next one, and links onward to that product's page, so the four pages can
 * be walked the same way work moves:
 *
 *   notes → tasks → timeline → signal → the waitlist
 *
 * The exit is deliberate. After Signal the loop is closed, so the walk ends
 * at the one action the site asks for.
 *
 * Each vignette is drawn in its products' own grammar (the note row, the
 * board card, the rail, the read row) and plays once when it enters the
 * viewport: the left artifact acts, one chip crosses the lane, the right
 * artifact receives. Under prefers-reduced-motion the settled end state
 * renders immediately and nothing moves.
 */

type Handoff = {
  caption: string;
  lead: string;
  body: React.ReactNode;
  chip: string;
  nextHref: string;
  nextLabel: string;
};

const HANDOFFS: Record<ProductId, Handoff> = {
  notes: {
    caption: "Notes → Tasks",
    lead: "The approved line becomes work.",
    body: (
      <>
        It arrives on the board owned and due. The note it came from stays
        private.
      </>
    ),
    chip: "extract",
    nextHref: "/tasks",
    nextLabel: "Next: Tasks",
  },
  tasks: {
    caption: "Tasks → Timeline",
    lead: "Done moves the line.",
    body: (
      <>
        When the work completes, the public plan updates on its own. Nobody
        writes a status.
      </>
    ),
    chip: "done",
    nextHref: "/timeline",
    nextLabel: "Next: Timeline",
  },
  timeline: {
    caption: "Timeline → Signal",
    lead: "The plan feeds the read.",
    body: (
      <>
        The next dated moment shows up in tomorrow&rsquo;s briefing on its
        own.
      </>
    ),
    chip: "next",
    nextHref: "/signal",
    nextLabel: "Next: Signal",
  },
  signal: {
    caption: "Signal → the work",
    lead: "The read ends in the work.",
    body: (
      <>
        Caught in Notes, committed in Tasks, shared on the Timeline, read in
        Signal. That is the whole loop.
      </>
    ),
    chip: "open",
    nextHref: "/waitlist",
    nextLabel: "That is the whole loop. The close below is the only ask.",
  },
};

export function ProductHandoff({ product }: { product: ProductId }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlayed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const h = HANDOFFS[product];

  return (
    <section
      aria-labelledby="ho-lead"
      className="ho"
      data-played={played ? "true" : undefined}
      ref={sectionRef}
    >
      <div className="ho-inner">
        <p className="ho-caption">{h.caption}</p>

        <div className="ho-stage">
          <Vignette product={product} side="from" />
          <div aria-hidden="true" className="ho-lane">
            <span className="ho-arrow" />
            <span className="ho-chip">{h.chip}</span>
          </div>
          <Vignette product={product} side="to" />
        </div>

        <p className="ho-sentence" id="ho-lead">
          <strong>{h.lead}</strong> {h.body}
        </p>

        {/* POLISH 2026-07-28 — Signal's walk exit and the close band below it
            both said "Join the waitlist", so the page asked for the same thing
            twice in 400px. On Signal the exit is a quiet line instead: the
            close keeps the only button, and the walk still ends where it
            should. The other three link onward to a product, not the
            conversion, so they stay as links. */}
        {product === "signal" ? (
          <p className="ho-next ho-next-quiet">{h.nextLabel}</p>
        ) : (
          <a className="ho-next" href={h.nextHref}>
            {h.nextLabel}
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      <style>{CSS}</style>
    </section>
  );
}

/**
 * The two sides of each handoff, drawn in the products' own grammar. Left
 * acts on play; right receives after the chip lands. Everything is
 * decorative illustration over the real sentence, so both sides are
 * aria-hidden and the copy carries the meaning.
 */
function Vignette({
  product,
  side,
}: {
  product: ProductId;
  side: "from" | "to";
}) {
  if (product === "notes") {
    return side === "from" ? (
      <div aria-hidden="true" className="ho-card">
        <p className="ho-kicker">Private stream</p>
        <div className="ho-note">
          <i className="ho-note-mark" />
          <span className="ho-note-text">
            Venue can open the side room after six
          </span>
        </div>
        <p className="ho-meta">private · 8:41</p>
      </div>
    ) : (
      <div aria-hidden="true" className="ho-card ho-recv">
        <p className="ho-kicker">Board</p>
        <div className="ho-task">
          <i className="ho-box" />
          <span className="ho-task-text">
            Ask the venue to hold the side room
          </span>
        </div>
        <p className="ho-meta">from a note · owned · due Fri</p>
      </div>
    );
  }

  if (product === "tasks") {
    return side === "from" ? (
      <div aria-hidden="true" className="ho-card">
        <p className="ho-kicker">Board</p>
        <div className="ho-task">
          <i className="ho-box ho-box-ticks" />
          <span className="ho-task-text">Confirm the catering tasting menu</span>
        </div>
        <p className="ho-meta">In Progress · P1</p>
      </div>
    ) : (
      <div aria-hidden="true" className="ho-card ho-recv">
        <p className="ho-kicker">Public plan</p>
        <div className="ho-rail">
          <i className="ho-rail-base" />
          <i className="ho-rail-fill" />
          <i className="ho-dot" data-at="0" data-state="done" />
          <i className="ho-dot" data-at="1" data-state="done" />
          <i className="ho-dot ho-dot-lands" data-at="2" />
          <i className="ho-dot" data-at="3" />
        </div>
        <p className="ho-meta">Menu confirmed · 30 Jul</p>
      </div>
    );
  }

  if (product === "timeline") {
    return side === "from" ? (
      <div aria-hidden="true" className="ho-card">
        <p className="ho-kicker">Public plan</p>
        <div className="ho-rail">
          <i className="ho-rail-base" />
          <i className="ho-rail-fill" data-still="true" />
          <i className="ho-dot" data-at="0" data-state="done" />
          <i className="ho-dot" data-at="1" data-state="done" />
          <i className="ho-dot" data-at="2" data-state="next" />
          <i className="ho-dot" data-at="3" />
        </div>
        <p className="ho-meta">Send the invitations · 13 Aug</p>
      </div>
    ) : (
      <div aria-hidden="true" className="ho-card ho-recv">
        <p className="ho-kicker">Tomorrow&rsquo;s read</p>
        <div className="ho-read">
          <i className="ho-marker" data-tone="next" />
          <span className="ho-read-claim" data-tone="next">
            next
          </span>
          <span className="ho-read-text">
            Invitations follow one week later.
          </span>
        </div>
        <p className="ho-meta">receipt · timeline</p>
      </div>
    );
  }

  return side === "from" ? (
    <div aria-hidden="true" className="ho-card">
      <p className="ho-kicker">This morning&rsquo;s read</p>
      <div className="ho-read">
        <i className="ho-marker" data-tone="now" />
        <span className="ho-read-claim" data-tone="now">
          now
        </span>
        <span className="ho-read-text">
          The final dietary list is still open.
        </span>
      </div>
      <span className="ho-open">Open task</span>
    </div>
  ) : (
    <div aria-hidden="true" className="ho-card ho-recv ho-recv-held">
      <p className="ho-kicker">Tasks</p>
      <div className="ho-task">
        <i className="ho-box" />
        <span className="ho-task-text">Close the final dietary list</span>
      </div>
      <p className="ho-meta">owned · due today</p>
    </div>
  );
}

const CSS = `
.ho {
  border-top: 1px solid var(--hairline);
  background: var(--paper);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.ho-inner {
  max-width: 1080px;
  margin-inline: auto;
  padding: clamp(56px, 8vw, 104px) clamp(20px, 5vw, 72px);
}

.ho-caption {
  margin: 0;
  font-family: var(--font-geist-mono), monospace;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* ── stage ─────────────────────────────────────────────────────────── */

.ho-stage {
  margin-top: 30px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) clamp(72px, 10vw, 132px) minmax(0, 1fr);
  align-items: center;
}

.ho-card {
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--paper);
  padding: 14px 16px 12px;
  min-width: 0;
}

.ho-kicker {
  margin: 0 0 10px;
  font-family: var(--font-geist-mono), monospace;
  font-size: 8.5px;
  font-weight: 600;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--ink-ghost);
}

.ho-meta {
  margin: 9px 0 0;
  font-family: var(--font-geist-mono), monospace;
  font-size: 8.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* The receiving side sits muted until the chip lands. */
.ho-recv {
  opacity: 0.42;
}

.ho[data-played="true"] .ho-recv {
  animation: ho-receive 400ms var(--ease-out) 700ms both;
}

@keyframes ho-receive {
  from { opacity: 0.42; }
  55% { box-shadow: 0 0 0 3px var(--accent-tint); }
  to { opacity: 1; box-shadow: 0 0 0 0 transparent; }
}

/* Signal's board card receives as held work: the accent border stays. */
.ho[data-played="true"] .ho-recv-held {
  animation: ho-receive-held 400ms var(--ease-out) 700ms both;
}

@keyframes ho-receive-held {
  from { opacity: 0.42; }
  to { opacity: 1; border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
}

/* ── the lane and the crossing chip ────────────────────────────────── */

.ho-lane {
  --ho-travel: calc(clamp(72px, 10vw, 132px) - 20px);
  position: relative;
  height: 1px;
  background: var(--hairline);
  margin-inline: 10px;
}

.ho-arrow {
  position: absolute;
  right: -1px;
  top: 50%;
  width: 6px;
  height: 6px;
  border-top: 1px solid var(--ink-ghost);
  border-right: 1px solid var(--ink-ghost);
  transform: translateY(-50%) rotate(45deg);
}

.ho-chip {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  padding: 3px 8px;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--paper);
  font-family: var(--font-geist-mono), monospace;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0;
  white-space: nowrap;
}

.ho[data-played="true"] .ho-chip {
  animation: ho-cross 600ms var(--ease-in-out) 160ms both;
}

@keyframes ho-cross {
  0% { opacity: 0; transform: translate(calc(-50% - 6px), -50%); }
  18% { opacity: 1; }
  82% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(var(--ho-travel) - 50% + 6px), -50%); }
}

/* ── note grammar ──────────────────────────────────────────────────── */

.ho-note {
  display: flex;
  align-items: baseline;
  gap: 9px;
  min-width: 0;
}

.ho-note-mark {
  flex: none;
  width: 2px;
  height: 12px;
  border-radius: 1px;
  background: var(--accent);
  transform: translateY(1px);
}

.ho-note-text,
.ho-task-text,
.ho-read-text {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12.5px;
  font-weight: 550;
  color: var(--ink);
}

/* ── board grammar ─────────────────────────────────────────────────── */

.ho-task {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.ho-box {
  flex: none;
  position: relative;
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--ink-ghost);
  border-radius: 4px;
  background: var(--paper);
}

.ho-box::after {
  content: "";
  position: absolute;
  left: 3px;
  top: 1px;
  width: 5px;
  height: 8px;
  border-right: 1.5px solid var(--paper);
  border-bottom: 1.5px solid var(--paper);
  transform: rotate(40deg);
  opacity: 0;
}

/* The tasks vignette ticks its box as the handoff begins. */
.ho[data-played="true"] .ho-box-ticks {
  animation: ho-box-fill 220ms var(--ease-out) 80ms both;
}

.ho[data-played="true"] .ho-box-ticks::after {
  animation: ho-box-check 220ms var(--ease-out) 160ms both;
}

@keyframes ho-box-fill {
  to { background: var(--accent); border-color: var(--accent); }
}

@keyframes ho-box-check {
  to { opacity: 1; }
}

/* ── rail grammar ──────────────────────────────────────────────────── */

.ho-rail {
  position: relative;
  height: 22px;
}

.ho-rail-base,
.ho-rail-fill {
  position: absolute;
  top: 50%;
  left: 0;
  height: 1px;
  transform: translateY(-50%);
}

.ho-rail-base {
  right: 0;
  background: var(--ink-ghost);
}

.ho-rail-fill {
  width: 66%;
  height: 2px;
  background: var(--ink);
  transform: translateY(-50%) scaleX(0.5152);
  transform-origin: left center;
}

.ho-rail-fill[data-still] {
  width: 34%;
  transform: translateY(-50%);
}

/* On the tasks page the fill extends to the landing dot when it receives. */
.ho[data-played="true"] .ho-rail-fill:not([data-still]) {
  animation: ho-rail-extend 400ms var(--ease-out) 760ms both;
}

@keyframes ho-rail-extend {
  to { transform: translateY(-50%) scaleX(1); }
}

.ho-dot {
  position: absolute;
  top: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid var(--ink-faint);
  background: var(--paper);
  transform: translate(-50%, -50%);
}

.ho-dot[data-at="0"] { left: 2%; }
.ho-dot[data-at="1"] { left: 34%; }
.ho-dot[data-at="2"] { left: 66%; }
.ho-dot[data-at="3"] { left: 98%; }

.ho-dot[data-state="done"] {
  border-color: var(--ink);
  background: var(--ink);
}

.ho-dot[data-state="next"] {
  width: 9px;
  height: 9px;
  border: 2px solid var(--accent);
  box-shadow: 0 0 0 3px var(--accent-tint);
}

.ho[data-played="true"] .ho-dot-lands {
  animation: ho-dot-fill 220ms var(--ease-out) 980ms both;
}

@keyframes ho-dot-fill {
  to { border-color: var(--ink); background: var(--ink); }
}

/* ── read grammar ──────────────────────────────────────────────────── */

.ho-read {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
}

.ho-marker {
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ho-marker[data-tone="now"] {
  background: var(--status-blocked);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-blocked) 15%, transparent);
}

.ho-marker[data-tone="next"] {
  background: var(--status-flight);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--status-flight) 15%, transparent);
}

.ho-read-claim {
  flex: none;
  font-family: var(--font-geist-mono), monospace;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.ho-read-claim[data-tone="now"] {
  color: color-mix(in srgb, var(--status-blocked) 62%, var(--ink));
}

.ho-read-claim[data-tone="next"] {
  color: color-mix(in srgb, var(--status-flight) 46%, var(--ink));
}

.ho-open {
  display: inline-flex;
  margin-top: 11px;
  padding: 5px 12px;
  border-radius: 7px;
  background: var(--ink);
  color: var(--paper);
  font-size: 11px;
  font-weight: 560;
}

/* ── copy and the walk ─────────────────────────────────────────────── */

.ho-sentence {
  margin: 30px 0 0;
  max-width: 58ch;
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--ink-soft);
}

.ho-sentence strong {
  color: var(--ink);
  font-weight: 600;
}

.ho-next {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  font-size: 13.5px;
  font-weight: 560;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--ink-ghost);
  padding-bottom: 2px;
  transition:
    border-color var(--motion-fast) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}

.ho-next:hover {
  border-color: var(--accent);
}

.ho-next span {
  transition: translate var(--motion-fast) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .ho-next:hover span {
    translate: 3px 0;
  }
}

.ho-next:active {
  transform: scale(0.98);
}

/* Signal's exit: the sentence that ends the walk, with no second ask. */
.ho-next-quiet {
  margin: 18px 0 0;
  border: 0;
  padding: 0;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--ink-faint);
}

/* ── narrow ────────────────────────────────────────────────────────── */

@media (max-width: 720px) {
  .ho-stage {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 0;
  }

  .ho-lane {
    --ho-travel: 44px;
    height: 44px;
    width: 1px;
    background: var(--hairline);
    margin: 0 auto;
  }

  .ho-arrow {
    right: auto;
    left: 50%;
    top: auto;
    bottom: -1px;
    transform: translateX(-50%) rotate(135deg);
  }

  .ho[data-played="true"] .ho-chip {
    animation-name: ho-cross-down;
  }

  @keyframes ho-cross-down {
    0% { left: 50%; top: 0; opacity: 0; transform: translate(-50%, calc(-50% - 5px)); }
    18% { opacity: 1; }
    82% { opacity: 1; }
    100% { left: 50%; top: 0; opacity: 0; transform: translate(-50%, calc(var(--ho-travel) - 50% + 5px)); }
  }
}

/* Reduced motion: the settled end state, immediately and without movement. */
@media (prefers-reduced-motion: reduce) {
  .ho-chip,
  .ho[data-played="true"] .ho-chip {
    animation: none;
    opacity: 0;
  }

  .ho-recv,
  .ho[data-played="true"] .ho-recv {
    animation: none;
    opacity: 1;
  }

  .ho-recv-held,
  .ho[data-played="true"] .ho-recv-held {
    animation: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 1px var(--accent);
  }

  .ho-box-ticks,
  .ho[data-played="true"] .ho-box-ticks {
    animation: none;
    background: var(--accent);
    border-color: var(--accent);
  }

  .ho-box-ticks::after,
  .ho[data-played="true"] .ho-box-ticks::after {
    animation: none;
    opacity: 1;
  }

  .ho-rail-fill:not([data-still]),
  .ho[data-played="true"] .ho-rail-fill:not([data-still]) {
    animation: none;
    transform: translateY(-50%) scaleX(1);
  }

  .ho-dot-lands,
  .ho[data-played="true"] .ho-dot-lands {
    animation: none;
    border-color: var(--ink);
    background: var(--ink);
  }
}
`;
