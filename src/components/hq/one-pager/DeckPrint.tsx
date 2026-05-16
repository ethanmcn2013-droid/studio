"use client";

import Link from "next/link";
import { DECK, T, type Slide } from "@/components/hq/marketing-deck";
import { ExportButton } from "./ExportButton";

// ───────────────────────────────────────────────────────────────
// Marketing-plan deck · PDF export (docs/ONE_PAGER_SPEC.md §4)
//
// The deck content is single-sourced: this maps the SAME `DECK`
// array the live deck renders, so the PDF can never drift from the
// presentation. The on-screen deck is one interactive 16:9 slide at
// a time; print needs every slide as its own A4-landscape page.
//
// Translation, not redesign: three palettes (paper / ink / indigo),
// four-corner chrome, the settled indigo dot, Roman-numeral
// dividers. Motion → its final state. Presenter UI → gone.
// Vector text via the browser print path (no headless Chromium).
// ───────────────────────────────────────────────────────────────

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

const DECK_PRINT_CSS = `
.dp-root{
  --paper:#ffffff; --ink:#0b0b0f; --indigo:#4f46e5;
  --quiet:#71717a; --hair:rgba(17,17,17,0.10);
  --sans:var(--font-geist-sans),"Geist",system-ui,sans-serif;
  --mono:var(--font-geist-mono),"Geist Mono",ui-monospace,monospace;
  background:#0b0b0f; min-height:100vh; padding:40px 16px 80px;
  display:flex; flex-direction:column; align-items:center; gap:18px;
}
.dp-toolbar{ width:297mm; max-width:100%; display:flex;
  align-items:center; justify-content:space-between; gap:16px; }
.dp-toolbar a{ font-family:var(--mono); font-size:11px; font-weight:500;
  letter-spacing:.12em; text-transform:uppercase; color:#a1a1aa;
  text-decoration:none; }
.dp-toolbar a:hover{ color:#fff; }

.dp-slide{
  width:297mm; height:210mm; box-sizing:border-box; position:relative;
  background:var(--paper); color:var(--ink); font-family:var(--sans);
  padding:14mm 16mm; display:flex; flex-direction:column;
  overflow:hidden; box-shadow:0 24px 60px -24px rgba(0,0,0,.6);
  print-color-adjust:exact; -webkit-print-color-adjust:exact;
}
.dp-slide.k-divider{ background:var(--ink); color:var(--paper); }
.dp-slide.k-closing{ background:var(--indigo); color:var(--paper); }

/* four-corner chrome */
.dp-c{ position:absolute; font-family:var(--mono); font-size:7pt;
  font-weight:500; letter-spacing:.14em; text-transform:uppercase;
  color:var(--quiet); }
.k-divider .dp-c,.k-closing .dp-c{ color:rgba(255,255,255,.55); }
.dp-tl{ top:11mm; left:16mm; } .dp-tr{ top:11mm; right:16mm; }
.dp-bl{ bottom:11mm; left:16mm; } .dp-br{ bottom:11mm; right:16mm;
  font-variant-numeric:tabular-nums; }
.dp-bl .dot{ color:var(--indigo); }
.k-divider .dp-bl .dot,.k-closing .dp-bl .dot{ color:#fff; }

.dp-area{ flex:1 1 auto; display:flex; flex-direction:column;
  min-height:0; }

/* kicker / titles */
.dp-kick{ font-family:var(--mono); font-size:7.5pt; font-weight:500;
  letter-spacing:.12em; text-transform:uppercase; color:var(--quiet);
  margin-bottom:6mm; }
.k-divider .dp-kick,.k-closing .dp-kick{ color:rgba(255,255,255,.6); }
.dp-h{ font-family:var(--sans); font-weight:600; color:inherit;
  letter-spacing:-.035em; margin:0; }
.dp-h .mdk-period{ color:var(--indigo); }
.k-closing .dp-h .mdk-period{ color:#fff; }

.k-title .dp-area{ justify-content:flex-end; }
.k-title .dp-h{ font-weight:500; font-size:54pt; line-height:1.02;
  letter-spacing:-.03em; text-transform:lowercase; }
.k-title .dp-say{ margin-top:7mm; font-size:13pt; line-height:1.5;
  color:var(--quiet); max-width:160mm; }

.k-statement .dp-area{ justify-content:center; }
.k-statement .dp-h{ font-size:40pt; line-height:1.08; max-width:230mm; }
.k-statement .dp-say{ margin-top:8mm; font-size:13pt; color:var(--quiet);
  max-width:170mm; line-height:1.5; }

.k-divider .dp-area{ justify-content:center; }
.dp-num{ font-family:var(--mono); font-weight:500; font-size:96pt;
  line-height:1; color:var(--indigo); letter-spacing:-.02em; }
.k-divider .dp-h{ font-size:30pt; margin-top:6mm;
  color:var(--paper); }

.k-content .dp-h,.k-metrics .dp-h{ font-size:26pt; line-height:1.1;
  margin-bottom:7mm; }
.k-closing .dp-h{ font-size:40pt; line-height:1.1; }
.k-closing .dp-area{ justify-content:center; }

/* body primitives — single-sourced from the deck, restyled for print */
.dp-body{ font-family:var(--sans); font-size:12pt; line-height:1.5;
  color:inherit; }
.dp-body .mdk-lead{ font-size:15pt; line-height:1.45; margin:0 0 5mm; }
.dp-body .mdk-note{ font-size:10.5pt; color:var(--quiet);
  margin:5mm 0 0; }
.dp-body .mdk-pull{ font-size:15pt; line-height:1.4;
  padding-left:8mm; border-left:2pt solid var(--indigo); margin:5mm 0; }
.dp-body .mdk-defs{ display:flex; flex-direction:column;
  border-top:.5pt solid var(--hair); }
.dp-body .mdk-def{ display:flex; gap:10mm; padding:3.5mm 0;
  border-bottom:.5pt solid var(--hair); }
.dp-body .mdk-def > :first-child{ flex:0 0 64mm;
  font-family:var(--mono); font-size:9.5pt; text-transform:uppercase;
  letter-spacing:.06em; }
.dp-body .mdk-def > :last-child{ font-size:11.5pt; line-height:1.45; }
.dp-body .mdk-ledger{ width:100%; border-collapse:collapse;
  font-size:11pt; }
.dp-body .mdk-ledger td,.dp-body .mdk-ledger th{
  padding:3mm 4mm; border-bottom:.5pt solid var(--hair);
  text-align:left; }
.dp-body .mdk-lr-on{ font-weight:600; }
.dp-body .mdk-lr-on td:last-child{ color:var(--indigo); }
.dp-body .mdk-figs{ display:flex; gap:14mm; margin-top:4mm; }
.dp-body .mdk-fig{ display:flex; flex-direction:column; gap:2mm; }
.dp-body .mdk-fig > :first-child{ font-size:30pt; font-weight:600;
  letter-spacing:-.03em; }
.dp-body .mdk-fig > :last-child{ font-family:var(--mono);
  font-size:8pt; text-transform:uppercase; letter-spacing:.1em;
  color:var(--quiet); }
.dp-body .mdk-kick-pip{ display:inline-block; width:4pt; height:4pt;
  border-radius:50%; background:var(--indigo); margin-right:3mm;
  vertical-align:middle; }
.dp-body .mdk-period{ color:var(--indigo); }

@page{ size:A4 landscape; margin:0; }
@media print{
  .dp-root{ background:#fff; padding:0; display:block; gap:0; }
  .dp-noprint{ display:none !important; }
  .dp-slide{ box-shadow:none; break-after:page; page-break-after:always; }
  .dp-slide:last-child{ break-after:auto; page-break-after:auto; }
  html,body{ background:#fff; }
}
`;

function Chrome({
  slide,
  index,
  total,
}: {
  slide: Slide;
  index: number;
  total: number;
}) {
  const tl =
    slide.kicker?.toUpperCase() ??
    (slide.section ? slide.section.toUpperCase() : "SIGNAL STUDIO · PLAN");
  return (
    <>
      <span className="dp-c dp-tl">{tl}</span>
      <span className="dp-c dp-tr">2026.05 · Private</span>
      <span className="dp-c dp-bl">
        signal studio<span className="dot">.</span>
      </span>
      <span className="dp-c dp-br">
        {String(index + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </span>
    </>
  );
}

function SlidePage({
  slide,
  index,
  total,
  roman,
}: {
  slide: Slide;
  index: number;
  total: number;
  roman?: string;
}) {
  const dark = slide.kind === "divider" || slide.kind === "closing";
  return (
    <article className={`dp-slide k-${slide.kind}`}>
      <Chrome slide={slide} index={index} total={total} />
      <div className="dp-area">
        {slide.kicker && slide.kind !== "divider" && (
          <div className="dp-kick">{slide.kicker}</div>
        )}

        {slide.kind === "divider" && (
          <div className="dp-num">{roman}</div>
        )}

        <h2 className="dp-h">
          {dark ? slide.title : <T>{slide.title}</T>}
        </h2>

        {slide.say && <p className="dp-say">{slide.say}</p>}

        {slide.body && <div className="dp-body">{slide.body}</div>}
      </div>
    </article>
  );
}

export function DeckPrint() {
  const total = DECK.length;
  let dividerCount = 0;
  return (
    <div className="dp-root">
      <style dangerouslySetInnerHTML={{ __html: DECK_PRINT_CSS }} />
      <div className="dp-toolbar dp-noprint">
        <span style={{ display: "flex", gap: "20px" }}>
          <Link href="/hq/plan">← Back to deck</Link>
          <Link href="/hq/one-pagers">One-pagers</Link>
        </span>
        <ExportButton label="Export PDF · A4 landscape" />
      </div>
      {DECK.map((slide, i) => {
        const roman =
          slide.kind === "divider" ? ROMAN[++dividerCount] : undefined;
        return (
          <SlidePage
            key={i}
            slide={slide}
            index={i}
            total={total}
            roman={roman}
          />
        );
      })}
    </div>
  );
}
