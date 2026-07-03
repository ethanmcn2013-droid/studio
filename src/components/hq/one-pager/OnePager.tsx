import Link from "next/link";
import type { ReactNode } from "react";
import type { OnePagerGesture } from "@/lib/hq/one-pagers";
import { ExportButton } from "./ExportButton";

// ───────────────────────────────────────────────────────────────
// Signal Studio · one-pager shared print system
// Encodes docs/ONE_PAGER_SPEC.md §1 in full. Every one-pager inherits
// this frame: one A4 portrait page, white, one indigo period, the
// per-product gesture as a typographic mark. Scoped to `.op-root` the
// same way the deck scopes `.mdk-root`.
//
// Export path: client window.print() → browser "Save as PDF". Vector
// text, embedded Geist, flat true indigo. No headless Chromium (the
// dissent is recorded in the spec + ExportButton).
// ───────────────────────────────────────────────────────────────

const PRINT_CSS = `
.op-root {
  --paper:#ffffff; --ink:#111111; --indigo:#4f46e5;
  --quiet:#71717a; --hair:rgba(17,17,17,0.10);
  --sans:var(--font-geist-sans),"Geist",system-ui,sans-serif;
  --mono:var(--font-geist-mono),"Geist Mono",ui-monospace,monospace;
  background:#0b0b0f; min-height:100vh; padding:40px 16px 80px;
  display:flex; flex-direction:column; align-items:center; gap:22px;
}
.op-toolbar{
  width:210mm; max-width:100%; display:flex; align-items:center;
  justify-content:space-between; gap:16px;
}
.op-toolbar a{
  font-family:var(--mono); font-size:11px; font-weight:500;
  letter-spacing:0.12em; text-transform:uppercase; color:#a1a1aa;
  text-decoration:none;
}
.op-toolbar a:hover{ color:#fff; }
.op-export{
  font-family:var(--mono); font-size:11px; font-weight:600;
  letter-spacing:0.12em; text-transform:uppercase;
  color:#0b0b0f; background:#fff; border:0; cursor:pointer;
  padding:9px 16px; border-radius:6px;
}
.op-export:hover{ background:#e4e4e7; }

/* The sheet. On screen it reads as a document on a dark desk;
   in print it IS the page. */
.op-page{
  width:210mm; min-height:297mm; background:var(--paper);
  color:var(--ink); font-family:var(--sans);
  padding:18mm 20mm 14mm; box-sizing:border-box;
  display:flex; flex-direction:column;
  box-shadow:0 24px 60px -24px rgba(0,0,0,0.6);
  print-color-adjust:exact; -webkit-print-color-adjust:exact;
}

/* ── Masthead, one left-aligned identity stack ───────────── */
.op-mast{ display:flex; flex-direction:column; gap:6pt; }
.op-mark{
  font-family:var(--sans); font-size:11pt; font-weight:500;
  letter-spacing:-0.015em; color:var(--ink); line-height:1;
}
.op-mark .op-dot{ color:var(--indigo); }
.op-eyebrow{
  font-family:var(--mono); font-size:7pt;
  font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
  color:var(--quiet); line-height:1;
}
/* The gesture is bound to the identity block, an elaboration of
   the one indigo mark (spec §1.9), not an orphaned corner speck.
   Placement reads under the eyebrow: legible + print-robust over
   literal 8pt micro-placement. */
.op-gesture{ height:5pt; display:flex; align-items:center;
  align-self:flex-start; margin-top:1pt; }

/* gesture marks, typographic, never icons (spec §1.8) */
.g-pulse{ width:3pt; height:3pt; border-radius:50%; background:var(--indigo); }
.g-sweep{ width:14mm; height:0.6pt; background:var(--indigo); }
.g-tick{ display:flex; align-items:center; gap:2.4mm; }
.g-tick i{ width:3pt; height:3pt; border-radius:50%; background:var(--indigo); display:block; }
.g-tick i:nth-child(1),.g-tick i:nth-child(2){ opacity:0.32; }
.g-caret{ width:1pt; height:9pt; background:var(--indigo); }
.g-broadcast{ position:relative; width:11pt; height:11pt; display:flex; align-items:center; justify-content:center; }
.g-broadcast .r{ position:absolute; border-radius:50%; border:0.5pt solid var(--indigo); }
.g-broadcast .r1{ width:11pt; height:11pt; opacity:0.18; }
.g-broadcast .r2{ width:6.5pt; height:6.5pt; opacity:0.34; }
.g-broadcast .c{ width:3pt; height:3pt; border-radius:50%; background:var(--indigo); }

/* ── Body ─────────────────────────────────────────────────── */
.op-rule{ height:0.25pt; background:var(--hair); margin:14pt 0; }
.op-body{ flex:1 1 auto; display:flex; flex-direction:column;
  justify-content:center; padding:10mm 0; }

.op-headline{
  font-family:var(--sans); font-size:36pt; font-weight:600;
  letter-spacing:-0.045em; line-height:38pt; color:var(--ink);
  margin:0;
}
.op-headline .op-mk{
  background:linear-gradient(180deg,transparent 0 14%,
    rgba(79,70,229,0.28) 14% 92%,transparent 92%);
}
.op-whatis{
  font-family:var(--sans); font-size:10.5pt; font-weight:400;
  line-height:16pt; color:var(--ink); margin:16pt 0 0; max-width:150mm;
}
.op-purpose{
  font-family:var(--sans); font-size:10pt; font-weight:400;
  line-height:15.5pt; color:var(--ink); margin:12pt 0 0; max-width:155mm;
}
.op-kicker{
  font-family:var(--mono); font-size:7pt; font-weight:600;
  letter-spacing:0.14em; text-transform:uppercase; color:var(--quiet);
  margin:18pt 0 9pt;
}
.op-subs{ list-style:none; margin:0; padding:0; display:flex;
  flex-direction:column; gap:9pt; }
.op-subs li{
  position:relative; padding-left:7mm; font-family:var(--sans);
  font-size:10pt; font-weight:400; line-height:15.5pt; color:var(--ink);
}
.op-subs li::before{
  content:""; position:absolute; left:0; top:1.5pt;
  width:2mm; height:12pt; background:var(--indigo);
}
.op-pull{
  font-family:var(--sans); font-size:10.5pt; font-weight:400;
  line-height:16pt; color:var(--ink); margin:16pt 0 0;
  padding-left:14mm; position:relative; max-width:150mm;
}
.op-pull::before{
  content:""; position:absolute; left:0; top:2pt; bottom:2pt;
  width:2pt; background:var(--indigo);
}
.op-section{
  font-family:var(--sans); font-size:18pt; font-weight:600;
  letter-spacing:-0.030em; line-height:21pt; color:var(--ink);
  margin:16pt 0 0;
}
.op-defs{ margin:16pt 0 0; border-top:0.25pt solid var(--hair); }
.op-def{ display:flex; gap:8mm; padding:9pt 0;
  border-bottom:0.25pt solid var(--hair); }
.op-def dt{
  flex:0 0 46mm; font-family:var(--mono); font-size:7.5pt;
  font-weight:500; letter-spacing:0.08em; text-transform:uppercase;
  color:var(--ink); padding-top:1pt;
}
.op-def dd{ margin:0; font-family:var(--sans); font-size:10pt;
  line-height:15.5pt; color:var(--ink); }
.op-eyeline{
  margin-top:14pt; font-family:var(--mono); font-size:7pt;
  font-weight:500; letter-spacing:0.12em; text-transform:uppercase;
  color:var(--quiet);
}

/* ── Footer ───────────────────────────────────────────────── */
.op-foot{
  margin-top:auto; padding-top:8pt; border-top:0.25pt solid var(--hair);
  display:flex; align-items:baseline; justify-content:space-between;
  font-family:var(--mono); font-size:7pt; font-weight:500;
  letter-spacing:0.12em; text-transform:uppercase; color:var(--quiet);
}
.op-foot .op-pg{ font-variant-numeric:tabular-nums; }

/* ── Print ────────────────────────────────────────────────── */
@page{ size:A4 portrait; margin:0; }
@media print{
  .op-root{ background:#fff; padding:0; display:block; }
  .op-noprint{ display:none !important; }
  .op-page{ box-shadow:none; width:auto; min-height:auto; }
  html,body{ background:#fff; }
}
`;

function Gesture({ kind }: { kind: OnePagerGesture }) {
  if (kind === "pulse") return <span className="op-gesture"><span className="g-pulse" /></span>;
  if (kind === "sweep") return <span className="op-gesture"><span className="g-sweep" /></span>;
  if (kind === "tick")
    return (
      <span className="op-gesture">
        <span className="g-tick"><i /><i /><i /></span>
      </span>
    );
  if (kind === "caret") return <span className="op-gesture"><span className="g-caret" /></span>;
  return (
    <span className="op-gesture">
      <span className="g-broadcast">
        <span className="r r1" />
        <span className="r r2" />
        <span className="c" />
      </span>
    </span>
  );
}

/** Splits a wordmark so its trailing period renders indigo. */
function Wordmark({ text }: { text: string }) {
  const dot = text.endsWith(".");
  const head = dot ? text.slice(0, -1) : text;
  return (
    <div className="op-mark">
      {head}
      {dot && <span className="op-dot">.</span>}
    </div>
  );
}

export function OnePager({
  wordmark,
  eyebrow,
  gesture,
  date = "May 2026",
  backHref = "/hq/one-pagers",
  children,
}: {
  wordmark: string;
  eyebrow: string;
  gesture: OnePagerGesture;
  date?: string;
  backHref?: string;
  children: ReactNode;
}) {
  return (
    <div className="op-root">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="op-toolbar op-noprint">
        <Link href={backHref}>← One-pagers</Link>
        <ExportButton />
      </div>

      <article className="op-page">
        <header className="op-mast">
          <Wordmark text={wordmark} />
          <div className="op-eyebrow">{eyebrow}</div>
          <Gesture kind={gesture} />
        </header>
        <div className="op-rule" />

        <div className="op-body">{children}</div>

        <footer className="op-foot">
          <span>signalstudio.ie</span>
          <span className="op-pg">{date} · 01 / 01</span>
        </footer>
      </article>
    </div>
  );
}

// ── Body primitives, enforce the "one family" structure ──────

export function OPHeadline({ children }: { children: ReactNode }) {
  return <h1 className="op-headline">{children}</h1>;
}
/** Wrap a span in the single permitted marker (brand one-pager 80% only). */
export function OPMark({ children }: { children: ReactNode }) {
  return <span className="op-mk">{children}</span>;
}
export function OPWhatIs({ children }: { children: ReactNode }) {
  return <p className="op-whatis">{children}</p>;
}
export function OPPurpose({ children }: { children: ReactNode }) {
  return <p className="op-purpose">{children}</p>;
}
export function OPKicker({ children }: { children: ReactNode }) {
  return <p className="op-kicker">{children}</p>;
}
export function OPSubstance({ items }: { items: ReactNode[] }) {
  return (
    <ul className="op-subs">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
export function OPPull({ children }: { children: ReactNode }) {
  return <p className="op-pull">{children}</p>;
}
export function OPSection({ children }: { children: ReactNode }) {
  return <p className="op-section">{children}</p>;
}
export function OPDefs({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl className="op-defs">
      {rows.map((r) => (
        <div className="op-def" key={r.k}>
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
export function OPEyeline({ children }: { children: ReactNode }) {
  return <p className="op-eyeline">{children}</p>;
}
