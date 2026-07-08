"use client";

import { useEffect, useRef } from "react";

const INDIGO = "#4f46e5";
const INK = "#111111";

type ProductSlug = "notes" | "tasks" | "timeline" | "signal";

function waitlistHref(product: ProductSlug): string {
  return `/waitlist?source=products_panel&campaign=pre_access_waitlist&product=${product}&artifact=mega_panel_${product}&touch=site`;
}

const PRODUCTS = [
  { slug: "notes"    as ProductSlug, name: "notes",    tagline: "Capture clarity",   description: "A quiet surface to think before you act.", url: waitlistHref("notes")    },
  { slug: "tasks"    as ProductSlug, name: "tasks",    tagline: "Execution clarity", description: "Track what matters without the noise.",    url: waitlistHref("tasks")    },
  { slug: "timeline" as ProductSlug, name: "timeline", tagline: "Direction clarity", description: "Show the plan. Keep everyone aligned.",    url: waitlistHref("timeline") },
  { slug: "signal"   as ProductSlug, name: "signal",   tagline: "Attention clarity", description: "Surface what's working, simply.",          url: waitlistHref("signal")   },
] as const;

/* ── Embedded stylesheet ──────────────────────────────────────────
   Self-contained so it works regardless of Turbopack/PostCSS cache.
   Injected once via <style> at render time.
   ─────────────────────────────────────────────────────────────── */
const PANEL_CSS = `
/* Panel shell, absolute below sticky nav, full-width backdrop */
.mpanel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid rgba(17,17,17,0.08);
  box-shadow: 0 20px 48px -16px rgba(17,17,17,0.10), 0 4px 12px -4px rgba(17,17,17,0.05);
  animation: mpanel-enter 220ms cubic-bezier(0,0,0.2,1) both;
}
@keyframes mpanel-enter {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Inner content, centred, matches nav max-width */
.mpanel-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 24px 28px;
}

/* Header label */
.mpanel-label {
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #71717a;
  margin: 0 0 16px 2px;
  line-height: 1;
}

/* 4-column grid */
.mpanel-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

/* Card */
.mpanel-card {
  display: block;
  padding: 18px 16px 16px;
  border-radius: 10px;
  border: 1px solid transparent;
  text-decoration: none;
  color: #111111;
  background: transparent;
  cursor: pointer;
  animation: mpanel-card-enter 280ms cubic-bezier(0,0,0.2,1) both;
  transition: background 180ms ease-out, border-color 180ms ease-out;
}
@keyframes mpanel-card-enter {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.mpanel-card:hover {
  background: rgba(79,70,229,0.05);
  border-color: rgba(79,70,229,0.18);
}
.mpanel-card:hover .mpanel-cta { opacity: 1; }

/* Visual stage */
.mpanel-stage {
  height: 68px;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  overflow: hidden;
}

/* Product name */
.mpanel-name {
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: #111111;
  margin-bottom: 3px;
}
.mpanel-dot { color: #4f46e5; }

/* Tagline */
.mpanel-tagline {
  font-size: 11.5px;
  color: #71717a;
  letter-spacing: 0.005em;
  margin-bottom: 8px;
  line-height: 1.4;
}

/* Description */
.mpanel-desc {
  font-size: 11px;
  color: #d4d4d8;
  line-height: 1.55;
  margin-bottom: 12px;
}

/* CTA */
.mpanel-cta {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;
  color: #4f46e5;
  opacity: 0;
  transition: opacity 160ms ease-out;
}

/* ── Gesture animations ──────────────────────────────────────── */

/* notes · caret blink */
.mnotes-cursor {
  animation: mnotes-caret 1.1s steps(1,end) infinite;
}
@keyframes mnotes-caret {
  0%,49% { opacity: 1; }
  50%,100% { opacity: 0; }
}

/* tasks · pulse, staggered across 3 dots */
.mtasks-dot { transform-box: fill-box; transform-origin: center; }
.mtasks-dot-1 { animation: mtasks-pulse 2.6s ease-in-out infinite 0s; }
.mtasks-dot-2 { animation: mtasks-pulse 2.6s ease-in-out infinite 0.4s; }
.mtasks-dot-3 { animation: mtasks-pulse 2.6s ease-in-out infinite 0.8s; }
@keyframes mtasks-pulse {
  0%,30%,100% { transform: scale(1); }
  10%         { transform: scale(1.28); }
  20%         { transform: scale(1); }
  40%         { transform: scale(1.14); }
  50%         { transform: scale(1); }
}

/* roadmap · sweep */
.mroadmap-dot {
  transform-box: fill-box;
  transform-origin: center;
  animation: mroadmap-sweep 5.4s cubic-bezier(.22,.7,.2,1) infinite;
}
@keyframes mroadmap-sweep {
  0%   { transform: translateX(0);    opacity: 1; }
  60%  { transform: translateX(79px); opacity: 1; }
  62%  { transform: translateX(79px); opacity: 0; }
  70%  { transform: translateX(0);    opacity: 0; }
  78%  { transform: translateX(0);    opacity: 1; }
  100% { transform: translateX(0);    opacity: 1; }
}

/* analytics · tick */
.manalytics-bar { transform-box: fill-box; transform-origin: bottom; }
.manalytics-bar-1 { animation: mbar1 3.6s steps(1,end) infinite 0s; }
.manalytics-bar-2 { animation: mbar2 3.6s steps(1,end) infinite 0.9s; }
.manalytics-bar-3 { animation: mbar3 3.6s steps(1,end) infinite 1.8s; }
.manalytics-bar-4 { animation: mbar4 3.6s steps(1,end) infinite 0.45s; }
@keyframes mbar1 {
  0%  { transform: scaleY(0.55); } 25% { transform: scaleY(0.85); }
  50% { transform: scaleY(0.35); } 75% { transform: scaleY(1.00); }
}
@keyframes mbar2 {
  0%  { transform: scaleY(0.90); } 25% { transform: scaleY(0.45); }
  50% { transform: scaleY(1.00); } 75% { transform: scaleY(0.60); }
}
@keyframes mbar3 {
  0%  { transform: scaleY(0.40); } 25% { transform: scaleY(0.75); }
  50% { transform: scaleY(0.55); } 75% { transform: scaleY(0.25); }
}
@keyframes mbar4 {
  0%  { transform: scaleY(1.00); } 25% { transform: scaleY(0.55); }
  50% { transform: scaleY(0.80); } 75% { transform: scaleY(0.40); }
}

/* Footer row, quiet link to the design system */
.mpanel-foot {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid var(--hairline);
  font-size: 12px;
  letter-spacing: 0.01em;
  color: var(--ink-quiet);
  text-decoration: none;
  transition: color 160ms ease;
}
.mpanel-foot:hover { color: var(--ink); }
.mpanel-foot svg { opacity: 0.7; }

/* Mobile, 2×2 grid */
@media (max-width: 640px) {
  .mpanel-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
  .mpanel-inner { padding: 20px 16px 24px; }
  .mpanel-stage { height: 56px; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .mpanel, .mpanel-card { animation: none !important; }
  .mnotes-cursor, .mtasks-dot, .mroadmap-dot, .manalytics-bar { animation: none !important; }
  .mnotes-cursor { opacity: 1; }
  .mroadmap-dot  { transform: none; }
  .manalytics-bar { transform: scaleY(0.7); }
}
`;

/* ── Per-product gesture visuals ─────────────────────────────── */

function NotesVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <rect x="0" y="4"  width="72" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="0" y="14" width="84" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="0" y="24" width="60" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="0" y="34" width="44" height="2" rx="1" fill={INK} opacity="0.10" />
      <rect x="47" y="30" width="1.5" height="10" rx="0.75" fill={INDIGO} className="mnotes-cursor" />
    </svg>
  );
}

function TasksVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <circle cx="5" cy="9"  r="4" fill={INDIGO} className="mtasks-dot mtasks-dot-1" />
      <rect x="16" y="7"  width="64" height="2" rx="1" fill={INK} opacity="0.12" />
      <circle cx="5" cy="25" r="4" fill={INDIGO} className="mtasks-dot mtasks-dot-2" />
      <rect x="16" y="23" width="50" height="2" rx="1" fill={INK} opacity="0.12" />
      <circle cx="5" cy="41" r="4" fill={INDIGO} className="mtasks-dot mtasks-dot-3" />
      <rect x="16" y="39" width="58" height="2" rx="1" fill={INK} opacity="0.12" />
    </svg>
  );
}

function RoadmapVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <rect x="2" y="26" width="82" height="1.5" rx="0.75" fill={INK} opacity="0.09" />
      <rect x="2"  y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <rect x="30" y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <rect x="57" y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <rect x="83" y="20" width="1.5" height="12" rx="0.75" fill={INK} opacity="0.18" />
      <circle cx="4" cy="26.75" r="5" fill={INDIGO} className="mroadmap-dot" />
    </svg>
  );
}

function AnalyticsVisual() {
  return (
    <svg width="88" height="52" viewBox="0 0 88 52" fill="none" aria-hidden>
      <rect x="0" y="48" width="88" height="1" rx="0.5" fill={INK} opacity="0.07" />
      <rect x="6"  y="8" width="14" height="40" rx="2" fill={INDIGO} opacity="0.9" className="manalytics-bar manalytics-bar-1" />
      <rect x="27" y="8" width="14" height="40" rx="2" fill={INDIGO} opacity="0.9" className="manalytics-bar manalytics-bar-2" />
      <rect x="48" y="8" width="14" height="40" rx="2" fill={INDIGO} opacity="0.9" className="manalytics-bar manalytics-bar-3" />
      <rect x="69" y="8" width="14" height="40" rx="2" fill={INDIGO} opacity="0.9" className="manalytics-bar manalytics-bar-4" />
    </svg>
  );
}

const VISUAL_MAP: Record<ProductSlug, () => React.ReactElement> = {
  notes:    NotesVisual,
  tasks:    TasksVisual,
  timeline: RoadmapVisual,
  signal:   AnalyticsVisual,
};

/* ── Component ───────────────────────────────────────────────── */

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProductsMegaPanel({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Embedded stylesheet, self-contained, no build-cache dependency */}
      <style dangerouslySetInnerHTML={{ __html: PANEL_CSS }} />

      <div
        ref={panelRef}
        id="products-mega-panel"
        role="dialog"
        aria-label="Signal Studio products"
        aria-modal="false"
        className="mpanel"
      >
        <div className="mpanel-inner">
          <p className="mpanel-label">Four products, one studio.</p>

          <div className="mpanel-grid">
            {PRODUCTS.map((product, i) => {
              const Visual = VISUAL_MAP[product.slug];
              return (
                <a
                  key={product.slug}
                  href={product.url}
                  onClick={onClose}
                  className="mpanel-card"
                  data-slug={product.slug}
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <div className="mpanel-stage" aria-hidden>
                    <Visual />
                  </div>

                  <div className="mpanel-name">
                    {product.name}<span className="mpanel-dot">·</span>
                  </div>

                  <div className="mpanel-tagline">{product.tagline}</div>

                  <div className="mpanel-desc">{product.description}</div>

                  <div className="mpanel-cta" aria-hidden>
                    Join waitlist
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.4"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </div>
                </a>
              );
            })}
          </div>

          <a href="/design" onClick={onClose} className="mpanel-foot">
            <span>One system behind all four, see the design</span>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.4"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
