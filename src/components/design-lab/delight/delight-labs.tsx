"use client";

import { useCallback, useEffect, useState } from "react";
import {
  PrototypePicker,
  updatePrototypeUrl,
} from "./prototype-picker";

const CONTINUITY_VARIANTS = ["Immediate", "Travelled", "Shared geometry"] as const;
const LINEAGE_VARIANTS = ["Static receipt", "One-shot handoff", "Continuous relay"] as const;
const CONTINUITY_PICKER = ["Immediate", "Travelled", "Shared"] as const;
const LINEAGE_PICKER = ["Static", "Handoff", "Relay"] as const;

type LabProps = {
  initialVariant: number;
};

function useLabSelection(initialVariant: number, count: number) {
  const [active, setActive] = useState(
    Math.min(Math.max(initialVariant, 0), count - 1),
  );
  const [run, setRun] = useState(0);

  const select = useCallback(
    (index: number) => {
      if (index < 0 || index >= count) return;
      setActive(index);
      setRun((value) => value + 1);
      updatePrototypeUrl(index);
    },
    [count],
  );

  const replay = useCallback(() => setRun((value) => value + 1), []);

  return { active, replay, run, select };
}

export function RouteContinuityLab({ initialVariant }: LabProps) {
  const { active, replay, run, select } = useLabSelection(
    initialVariant,
    CONTINUITY_VARIANTS.length,
  );
  const [reduced, setReduced] = useState(false);

  return (
    <main className="dl-page" id="main">
      <LabHeader
        eyebrow="Delight review / Route continuity"
        reduced={reduced}
        setReduced={setReduced}
        title="How should the suite cross a product boundary?"
      >
        Judge one transition at a time. Each option starts with the same Notes
        receipt and lands in the same Tasks destination; only the continuity
        model changes.
      </LabHeader>

      <section
        aria-label={`${CONTINUITY_VARIANTS[active]} route continuity prototype`}
        className="dl-stage-wrap"
        data-reduced={reduced ? "true" : undefined}
      >
        <ContinuityStage
          key={`${active}-${run}-${reduced}`}
          reduced={reduced}
          variant={active}
        />
      </section>

      <LabNotes
        items={[
          active === 0
            ? "Fastest and least theatrical. It preserves a clean white boundary and lets the destination own the arrival."
            : active === 1
              ? "A 120ms travelling dot names the relationship without turning navigation into a film."
              : "The receipt itself crosses and resolves into destination chrome. Strongest continuity, highest implementation and accessibility cost.",
          "The actual product URL, data state, and navigation timing are intentionally simulated in this isolated route.",
          "Use 1–3 or arrow keys to compare. R replays the current transition.",
        ]}
      />

      <PrototypePicker
        active={active}
        names={CONTINUITY_PICKER}
        onReplay={replay}
        onSelect={select}
      />
      <style>{LAB_CSS}</style>
    </main>
  );
}

function ContinuityStage({
  reduced,
  variant,
}: {
  reduced: boolean;
  variant: number;
}) {
  const [go, setGo] = useState(reduced);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setTimeout(() => setGo(true), 680);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  const replay = () => {
    setGo(false);
    window.setTimeout(() => setGo(true), 40);
  };

  return (
    <div
      className="dl-continuity"
      data-go={go ? "true" : undefined}
      data-variant={variant + 1}
    >
      <div className="dl-browser">
        <div className="dl-browser-bar">
          <span aria-hidden="true" className="dl-window-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="dl-address">
            {go ? "app.signalstudio.ie/tasks" : "app.signalstudio.ie/notes"}
          </span>
          <span className="dl-secure">Private workspace</span>
        </div>

        <div className="dl-route-canvas">
          <article className="dl-source-card">
            <p className="dl-label">Notes / private stream</p>
            <p className="dl-note-line">
              <span aria-hidden="true" className="dl-note-mark" />
              Ask the venue to hold the side room after six.
            </p>
            <div className="dl-receipt">
              <span>Approved line</span>
              <strong>Ready to make a task</strong>
            </div>
            <button className="dl-route-action" onClick={replay} type="button">
              Continue to Tasks <span aria-hidden="true">→</span>
            </button>
          </article>

          <div aria-hidden="true" className="dl-route-lane">
            <span className="dl-route-rule" />
            <span className="dl-travel-dot" />
            <span className="dl-shared-chip">Approved line</span>
          </div>

          <article className="dl-destination-card">
            <div className="dl-destination-head">
              <p className="dl-label">Tasks / board</p>
              <span className="dl-board-state">Private workspace</span>
            </div>
            <div className="dl-lanes">
              <section>
                <p>To do <span>2</span></p>
                <div className="dl-task-card dl-task-arrival">
                  <span className="dl-task-box" />
                  <div>
                    <strong>Ask the venue to hold the side room</strong>
                    <small>From Notes · due Friday</small>
                  </div>
                </div>
                <div className="dl-task-card dl-task-muted">
                  <span className="dl-task-box" />
                  <div>
                    <strong>Confirm final guest numbers</strong>
                    <small>Owned by Ethan</small>
                  </div>
                </div>
              </section>
              <section>
                <p>Moving <span>1</span></p>
                <div className="dl-task-card dl-task-muted">
                  <span className="dl-task-box" />
                  <div>
                    <strong>Review the tasting menu</strong>
                    <small>Priority one</small>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>

      <p aria-live="polite" className="dl-status">
        {go
          ? `${CONTINUITY_VARIANTS[variant]} arrival settled`
          : "Leaving Notes…"}
      </p>
    </div>
  );
}

export function HomepageLineageLab({ initialVariant }: LabProps) {
  const { active, replay, run, select } = useLabSelection(
    initialVariant,
    LINEAGE_VARIANTS.length,
  );
  const [reduced, setReduced] = useState(false);

  return (
    <main className="dl-page" id="main">
      <LabHeader
        eyebrow="Delight review / Homepage lineage"
        reduced={reduced}
        setReduced={setReduced}
        title="How much should one artefact travel through the homepage?"
      >
        The content and four-product spine stay fixed. Compare only how the
        approved line proves Notes → Tasks → Timeline → Signal.
      </LabHeader>

      <section
        aria-label={`${LINEAGE_VARIANTS[active]} homepage lineage prototype`}
        className="dl-stage-wrap dl-lineage-wrap"
        data-reduced={reduced ? "true" : undefined}
      >
        <LineageStage
          key={`${active}-${run}-${reduced}`}
          reduced={reduced}
          variant={active}
        />
      </section>

      <LabNotes
        items={[
          active === 0
            ? "Quietest and clearest. The relationship is carried entirely by persistent receipts and sequence."
            : active === 1
              ? "Recommended candidate. One artefact moves once, then every chapter stays still with its receipt visible."
              : "Stress-test candidate, retained rather than erased. The loop is legible but competes with reading and weakens the page’s editorial calm.",
          "This lab does not replace the current homepage or its content.",
          "Use 1–3 or arrow keys to compare. R replays the current lineage.",
        ]}
      />

      <PrototypePicker
        active={active}
        names={LINEAGE_PICKER}
        onReplay={replay}
        onSelect={select}
      />
      <style>{LAB_CSS}</style>
    </main>
  );
}

function LineageStage({
  reduced,
  variant,
}: {
  reduced: boolean;
  variant: number;
}) {
  return (
    <div
      className="dl-lineage"
      data-reduced={reduced ? "true" : undefined}
      data-variant={variant + 1}
    >
      <div className="dl-lineage-intro">
        <p className="dl-label">One line of work / four small tools</p>
        <h2>From a private thought to a useful morning read.</h2>
      </div>

      <div className="dl-lineage-track">
        <span aria-hidden="true" className="dl-lineage-rail" />
        <span aria-hidden="true" className="dl-lineage-token">
          Hold the side room
        </span>
        <ProductChapter
          index="01"
          name="Notes"
          receipt="Private capture"
          title="Venue can open the side room after six."
        />
        <ProductChapter
          index="02"
          name="Tasks"
          receipt="Owned · due Friday"
          title="Ask the venue to hold the side room."
        />
        <ProductChapter
          index="03"
          name="Timeline"
          receipt="Plan updated"
          title="Side room decision · 2 August"
        />
        <ProductChapter
          index="04"
          name="Signal"
          receipt="Receipt · Timeline"
          title="The side room decision is due Friday."
        />
      </div>

      <div className="dl-lineage-verdict">
        <span className="dl-lineage-dot" />
        <p>
          <strong>{LINEAGE_VARIANTS[variant]}</strong>
          {variant === 0
            ? " — sequence does the work."
            : variant === 1
              ? " — one handoff, then rest."
              : " — deliberately kept as the rejection benchmark."}
        </p>
      </div>
    </div>
  );
}

function ProductChapter({
  index,
  name,
  receipt,
  title,
}: {
  index: string;
  name: string;
  receipt: string;
  title: string;
}) {
  return (
    <article className="dl-chapter">
      <div className="dl-chapter-top">
        <span>{index}</span>
        <strong>{name}</strong>
      </div>
      <p>{title}</p>
      <small>{receipt}</small>
    </article>
  );
}

function LabHeader({
  children,
  eyebrow,
  reduced,
  setReduced,
  title,
}: {
  children: React.ReactNode;
  eyebrow: string;
  reduced: boolean;
  setReduced: (value: boolean) => void;
  title: string;
}) {
  return (
    <header className="dl-header">
      <div>
        <p className="dl-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="dl-deck">{children}</p>
      </div>
      <button
        aria-pressed={reduced}
        className="dl-reduced"
        onClick={() => setReduced(!reduced)}
        type="button"
      >
        <span aria-hidden="true" />
        Reduced motion {reduced ? "on" : "off"}
      </button>
    </header>
  );
}

function LabNotes({ items }: { items: readonly string[] }) {
  return (
    <aside className="dl-notes" aria-label="Review notes">
      <p>Review lens</p>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </aside>
  );
}

const LAB_CSS = `
.dl-page {
  min-height: 100vh;
  padding: clamp(104px, 12vw, 156px) clamp(20px, 5vw, 72px) 120px;
  background:
    radial-gradient(circle at 50% 24%, color-mix(in srgb, var(--accent) 5%, transparent), transparent 34%),
    var(--paper);
  color: var(--ink);
  font-family: var(--font-geist-sans), system-ui, sans-serif;
}

.dl-header,
.dl-stage-wrap,
.dl-notes {
  width: min(1160px, 100%);
  margin-inline: auto;
}

.dl-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 36px;
}

.dl-eyebrow,
.dl-label {
  margin: 0;
  font-family: var(--font-geist-mono), monospace;
  font-size: 10px;
  font-weight: 650;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.dl-header h1 {
  max-width: 780px;
  margin: 14px 0 0;
  font-size: clamp(32px, 5vw, 62px);
  font-weight: 610;
  letter-spacing: -.055em;
  line-height: .98;
}

.dl-deck {
  max-width: 700px;
  margin: 22px 0 0;
  color: var(--ink-soft);
  font-size: 16px;
  line-height: 1.6;
}

.dl-reduced {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink-soft);
  font: 550 12px/1 var(--font-geist-sans), system-ui, sans-serif;
  cursor: pointer;
  transition:
    color var(--motion-fast) var(--ease-out),
    border-color var(--motion-fast) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}

.dl-reduced span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ink-ghost);
}

.dl-reduced[aria-pressed="true"] span { background: var(--accent); }
.dl-reduced:active { transform: scale(.98); }
.dl-reduced:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.dl-stage-wrap {
  margin-top: 58px;
}

.dl-browser {
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 18px;
  background: var(--paper);
  box-shadow: 0 28px 80px color-mix(in srgb, var(--ink) 9%, transparent);
}

.dl-browser-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid var(--hairline);
  background: var(--paper-soft);
}

.dl-window-dots { display: flex; gap: 6px; }
.dl-window-dots i {
  width: 8px;
  height: 8px;
  border: 1px solid var(--hairline);
  border-radius: 50%;
  background: var(--paper-deep);
}

.dl-address,
.dl-secure {
  color: var(--ink-faint);
  font: 500 10px/1 var(--font-geist-mono), monospace;
}

.dl-secure { justify-self: end; }

.dl-route-canvas {
  display: grid;
  grid-template-columns: minmax(0, .72fr) clamp(76px, 9vw, 124px) minmax(0, 1.2fr);
  min-height: 480px;
  padding: clamp(28px, 5vw, 64px);
  background:
    linear-gradient(var(--paper) 0 0) padding-box,
    repeating-linear-gradient(90deg, transparent 0 79px, color-mix(in srgb, var(--hairline) 60%, transparent) 80px);
}

.dl-source-card,
.dl-destination-card {
  align-self: center;
  min-width: 0;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--paper);
}

.dl-source-card { padding: 20px; }

.dl-note-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 24px 0 0;
  font: 590 17px/1.45 var(--font-geist-sans), system-ui, sans-serif;
}

.dl-note-mark {
  flex: none;
  width: 2px;
  height: 15px;
  border-radius: 2px;
  background: var(--accent);
}

.dl-receipt {
  display: grid;
  gap: 3px;
  margin-top: 26px;
  padding: 12px;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  background: var(--paper-soft);
}

.dl-receipt span,
.dl-receipt strong {
  font-family: var(--font-geist-mono), monospace;
  font-size: 9px;
  letter-spacing: .08em;
  text-transform: uppercase;
}
.dl-receipt span { color: var(--ink-faint); }
.dl-receipt strong { color: var(--ink); }

.dl-route-action {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  margin-top: 18px;
  padding: 0 15px;
  border: 0;
  border-radius: 8px;
  background: var(--ink);
  color: var(--paper);
  font: 590 12px/1 var(--font-geist-sans), system-ui, sans-serif;
  cursor: pointer;
  transition: transform 140ms var(--ease-out);
}
.dl-route-action:active { transform: scale(.98); }
.dl-route-action:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

.dl-route-lane {
  --dl-route-travel: calc(clamp(76px, 9vw, 124px) - 20px);
  position: relative;
  align-self: center;
  height: 40px;
  margin-inline: 10px;
}

.dl-route-rule {
  position: absolute;
  inset: 50% 0 auto;
  height: 1px;
  background: var(--hairline);
}

.dl-travel-dot,
.dl-shared-chip {
  position: absolute;
  left: 0;
  top: 50%;
  opacity: 0;
}

.dl-travel-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-tint);
  transform: translate(-50%, -50%);
}

.dl-shared-chip {
  padding: 5px 8px;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--paper);
  color: var(--accent);
  font: 650 8px/1 var(--font-geist-mono), monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
  white-space: nowrap;
  transform: translate(-50%, -50%);
}

.dl-destination-card {
  overflow: hidden;
  opacity: .36;
  transform: translateY(8px);
}

.dl-destination-head {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--hairline);
}

.dl-board-state {
  color: var(--ink-faint);
  font: 500 9px/1 var(--font-geist-mono), monospace;
}

.dl-lanes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 14px;
  background: var(--paper-soft);
}

.dl-lanes section {
  min-width: 0;
  min-height: 226px;
  padding: 12px;
  border: 1px solid var(--hairline);
  border-radius: 8px;
  background: var(--paper);
}

.dl-lanes section > p {
  display: flex;
  justify-content: space-between;
  margin: 0 0 11px;
  color: var(--ink-soft);
  font-size: 11px;
  font-weight: 600;
}
.dl-lanes section > p span { color: var(--ink-faint); }

.dl-task-card {
  display: flex;
  gap: 9px;
  margin-top: 8px;
  padding: 11px;
  border: 1px solid var(--hairline);
  border-radius: 7px;
  background: var(--paper);
}
.dl-task-card strong,
.dl-task-card small { display: block; }
.dl-task-card strong { font-size: 11px; line-height: 1.35; }
.dl-task-card small { margin-top: 5px; color: var(--ink-faint); font-size: 9px; }
.dl-task-box {
  flex: none;
  width: 12px;
  height: 12px;
  margin-top: 1px;
  border: 1px solid var(--ink-ghost);
  border-radius: 3px;
}
.dl-task-muted { opacity: .64; }
.dl-task-arrival { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent-tint); }

.dl-status {
  margin: 14px 0 0;
  text-align: center;
  color: var(--ink-faint);
  font: 500 10px/1.4 var(--font-geist-mono), monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.dl-continuity[data-go] .dl-source-card {
  opacity: .62;
  transition: opacity 80ms var(--ease-out);
}

.dl-continuity[data-go] .dl-destination-card {
  opacity: 1;
  transform: none;
}

.dl-continuity[data-variant="1"][data-go] .dl-destination-card {
  transition:
    opacity 80ms var(--ease-out),
    transform 80ms var(--ease-out);
}

.dl-continuity[data-variant="2"][data-go] .dl-travel-dot {
  animation: dl-dot-travel 220ms var(--ease-in-out) both;
}
.dl-continuity[data-variant="2"][data-go] .dl-destination-card {
  transition:
    opacity 220ms var(--ease-out) 120ms,
    transform 220ms var(--ease-out) 120ms;
}

.dl-continuity[data-variant="3"][data-go] .dl-shared-chip {
  animation: dl-chip-travel 400ms var(--ease-in-out) both;
}
.dl-continuity[data-variant="3"][data-go] .dl-destination-card {
  transition:
    opacity 220ms var(--ease-out) 260ms,
    transform 220ms var(--ease-out) 260ms;
}
.dl-continuity[data-variant="3"][data-go] .dl-task-arrival {
  animation: dl-card-receive 220ms var(--ease-out) 300ms both;
}

@keyframes dl-dot-travel {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.7); }
  18% { opacity: 1; }
  82% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(var(--dl-route-travel) - 50%), -50%) scale(1); }
}
@keyframes dl-chip-travel {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(.92); }
  16% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(var(--dl-route-travel) - 50%), -50%) scale(.86); }
}
@keyframes dl-card-receive {
  from { box-shadow: 0 0 0 4px var(--accent-tint); }
  to { box-shadow: 0 0 0 1px var(--accent-tint); }
}

.dl-lineage-wrap {
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 18px;
  background: var(--paper);
  box-shadow: 0 28px 80px color-mix(in srgb, var(--ink) 8%, transparent);
}

.dl-lineage {
  padding: clamp(30px, 5vw, 64px);
}

.dl-lineage-intro h2 {
  max-width: 720px;
  margin: 14px 0 0;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 610;
  letter-spacing: -.045em;
  line-height: 1.02;
}

.dl-lineage-track {
  position: relative;
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 56px;
}

.dl-lineage-rail {
  position: absolute;
  left: 4%;
  right: 4%;
  top: -24px;
  height: 1px;
  background: var(--hairline);
}

.dl-lineage-token {
  position: absolute;
  z-index: 2;
  left: 2%;
  top: -35px;
  padding: 5px 9px;
  border: 1px solid var(--accent);
  border-radius: 999px;
  background: var(--paper);
  color: var(--accent);
  font: 650 8px/1 var(--font-geist-mono), monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: 0;
}

.dl-chapter {
  position: relative;
  min-height: 210px;
  padding: 18px;
  border: 1px solid var(--hairline);
  border-radius: 10px;
  background: var(--paper);
}

.dl-chapter::before {
  content: "";
  position: absolute;
  left: 18px;
  top: -28px;
  width: 7px;
  height: 7px;
  border: 1px solid var(--ink-ghost);
  border-radius: 50%;
  background: var(--paper);
  transform: translateY(-50%);
}

.dl-chapter-top {
  display: flex;
  justify-content: space-between;
  color: var(--ink-faint);
  font: 600 9px/1 var(--font-geist-mono), monospace;
  letter-spacing: .1em;
  text-transform: uppercase;
}
.dl-chapter-top strong { color: var(--ink); }
.dl-chapter > p {
  margin: 46px 0 0;
  font-size: 15px;
  font-weight: 590;
  line-height: 1.45;
}
.dl-chapter > small {
  position: absolute;
  left: 18px;
  bottom: 18px;
  color: var(--ink-faint);
  font: 550 9px/1 var(--font-geist-mono), monospace;
  letter-spacing: .04em;
  text-transform: uppercase;
}

.dl-lineage-verdict {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--hairline);
}
.dl-lineage-verdict p { margin: 0; color: var(--ink-soft); font-size: 13px; }
.dl-lineage-verdict strong { color: var(--ink); }
.dl-lineage-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); }

.dl-lineage[data-variant="1"] .dl-lineage-token { display: none; }
.dl-lineage[data-variant="1"] .dl-chapter::before { border-color: var(--accent); background: var(--accent); }

.dl-lineage[data-variant="2"] .dl-lineage-token {
  animation: dl-lineage-once 3.2s var(--ease-in-out) .5s both;
}
.dl-lineage[data-variant="2"] .dl-chapter {
  animation: dl-chapter-once 400ms var(--ease-out) both;
}
.dl-lineage[data-variant="2"] .dl-chapter:nth-of-type(1) { animation-delay: .55s; }
.dl-lineage[data-variant="2"] .dl-chapter:nth-of-type(2) { animation-delay: 1.3s; }
.dl-lineage[data-variant="2"] .dl-chapter:nth-of-type(3) { animation-delay: 2.05s; }
.dl-lineage[data-variant="2"] .dl-chapter:nth-of-type(4) { animation-delay: 2.8s; }

.dl-lineage[data-variant="3"] .dl-lineage-token {
  animation: dl-lineage-loop 5.2s linear .4s infinite;
}
.dl-lineage[data-variant="3"] .dl-chapter {
  animation: dl-chapter-loop 5.2s var(--ease-out) infinite;
}
.dl-lineage[data-variant="3"] .dl-chapter:nth-of-type(2) { animation-delay: 1.3s; }
.dl-lineage[data-variant="3"] .dl-chapter:nth-of-type(3) { animation-delay: 2.6s; }
.dl-lineage[data-variant="3"] .dl-chapter:nth-of-type(4) { animation-delay: 3.9s; }

@keyframes dl-lineage-once {
  0% { opacity: 0; transform: translateX(0); }
  8% { opacity: 1; }
  92% { opacity: 1; }
  100% { opacity: 0; transform: translateX(76cqw); }
}
@keyframes dl-lineage-loop {
  0% { opacity: 0; transform: translateX(0); }
  8%, 88% { opacity: 1; }
  96%, 100% { opacity: 0; transform: translateX(76cqw); }
}
@keyframes dl-chapter-once {
  from { border-color: var(--hairline); }
  50% { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-tint); }
  to { border-color: var(--hairline); box-shadow: none; }
}
@keyframes dl-chapter-loop {
  0%, 24%, 100% { border-color: var(--hairline); box-shadow: none; }
  10% { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-tint); }
}

.dl-notes {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 28px;
  margin-top: 34px;
  padding-top: 24px;
  border-top: 1px solid var(--hairline);
}
.dl-notes > p {
  margin: 0;
  color: var(--ink-faint);
  font: 650 9px/1.4 var(--font-geist-mono), monospace;
  letter-spacing: .13em;
  text-transform: uppercase;
}
.dl-notes ol { display: grid; gap: 10px; margin: 0; padding-left: 18px; }
.dl-notes li { padding-left: 6px; color: var(--ink-soft); font-size: 13px; line-height: 1.55; }

[data-reduced="true"] .dl-source-card { opacity: .62; }
[data-reduced="true"] .dl-destination-card { opacity: 1; transform: none; }
[data-reduced="true"] .dl-travel-dot,
[data-reduced="true"] .dl-shared-chip { display: none; }
[data-reduced="true"] .dl-lineage-token { display: none; }
[data-reduced="true"] .dl-chapter,
[data-reduced="true"] .dl-chapter::before {
  animation: none !important;
}
[data-reduced="true"] .dl-chapter::before { border-color: var(--accent); background: var(--accent); }

@media (prefers-reduced-motion: reduce) {
  .dl-continuity *,
  .dl-lineage * {
    animation: none !important;
    transition: none !important;
  }
  .dl-destination-card { opacity: 1; transform: none; }
  .dl-travel-dot,
  .dl-shared-chip,
  .dl-lineage-token { display: none; }
  .dl-chapter::before { border-color: var(--accent); background: var(--accent); }
}

@media (max-width: 800px) {
  .dl-page { padding-inline: 16px; }
  .dl-header { align-items: start; flex-direction: column; }
  .dl-browser-bar { grid-template-columns: auto 1fr; gap: 12px; }
  .dl-address { justify-self: end; }
  .dl-secure { display: none; }
  .dl-route-canvas {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  .dl-route-lane {
    --dl-route-travel: 58px;
    width: 1px;
    height: 58px;
    margin: 0 auto;
  }
  .dl-route-rule { inset: 0 auto 0 50%; width: 1px; height: auto; }
  .dl-continuity[data-variant="2"][data-go] .dl-travel-dot {
    animation-name: dl-dot-travel-down;
  }
  .dl-continuity[data-variant="3"][data-go] .dl-shared-chip {
    animation-name: dl-chip-travel-down;
  }
  .dl-lineage-track { grid-template-columns: 1fr; gap: 10px; margin-top: 36px; }
  .dl-lineage-rail { left: 3px; right: auto; top: 0; bottom: 0; width: 1px; height: auto; }
  .dl-lineage-token { display: none; }
  .dl-chapter { min-height: 148px; margin-left: 18px; }
  .dl-chapter::before { left: -22px; top: 26px; }
  .dl-chapter > p { margin-top: 28px; }
  .dl-lineage[data-variant="2"] .dl-chapter,
  .dl-lineage[data-variant="3"] .dl-chapter { animation: none; }
  .dl-notes { grid-template-columns: 1fr; gap: 12px; }
}

@keyframes dl-dot-travel-down {
  0% { top: 0; opacity: 0; transform: translate(-50%, -50%) scale(.7); }
  18%, 82% { opacity: 1; }
  100% { top: 0; opacity: 0; transform: translate(-50%, calc(var(--dl-route-travel) - 50%)) scale(1); }
}
@keyframes dl-chip-travel-down {
  0% { left: 50%; top: 0; opacity: 0; }
  16%, 80% { opacity: 1; }
  100% { left: 50%; top: 0; opacity: 0; transform: translate(-50%, calc(var(--dl-route-travel) - 50%)); }
}
`;
