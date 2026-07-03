"use client";

import { useMemo } from "react";
import {
  TemplatePills,
  type TemplateAudience,
  type TemplatePill,
} from "@/components/marketing/template-pills";
import type { FeaturedTemplate } from "@/lib/templates/featured";

/**
 * Templates browser, client wrapper around <TemplatePills> + the
 * filtered card grid. Holds the full FEATURED_TEMPLATES list in memory
 * so filter swaps are instant (no server round-trip).
 *
 * Cross-fade: on `current` change we remount the grid via `key={current}`,
 * which re-runs the keyframe fade-in (150ms opacity 0 → 1). One motion
 * per filter swap, the indigo dot on the pill is the secondary cue.
 * Reduced-motion users get instant swap (animation:none).
 *
 * Depth label is composed here (count + audience noun) and passed into
 * TemplatePills so honest-count discipline lives in one place.
 */

const DEPTH_NOUN: Record<TemplateAudience, { one: string; many: string }> = {
  wedding: { one: "wedding template", many: "wedding templates" },
  trades: { one: "trades template", many: "trades templates" },
  freelance: { one: "freelance template", many: "freelance templates" },
  marketing: {
    one: "small-business template",
    many: "small-business templates",
  },
};

const SCOPED_CSS = `
.tbrowse-shell{display:flex;flex-direction:column;gap:24px;padding:8px 0 32px}
.tbrowse-grid{display:grid;grid-template-columns:1fr;gap:14px;
 animation:tbrowse-fadein 150ms ease both}
@media (min-width:700px){.tbrowse-grid{grid-template-columns:repeat(2,1fr);gap:16px}}
@media (min-width:980px){.tbrowse-grid{grid-template-columns:repeat(3,1fr)}}
.tbrowse-card{display:flex;flex-direction:column;gap:10px;padding:18px 18px 16px;
 border-radius:16px;border:1px solid var(--hairline,rgba(17,17,17,0.10));
 background:var(--paper-elev,#fff);
 transition:box-shadow 220ms cubic-bezier(0.2,0,0,1),
            transform 220ms cubic-bezier(0.2,0,0,1),
            border-color 220ms cubic-bezier(0.2,0,0,1)}
.tbrowse-card:hover{transform:translateY(-2px);
 box-shadow:0 18px 42px -22px rgba(17,17,17,0.18);
 border-color:rgba(79,70,229,0.20)}
.tbrowse-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.tbrowse-card-title{font-size:15px;font-weight:600;letter-spacing:-0.01em;
 color:var(--ink,#111);line-height:1.35;margin:0}
.tbrowse-card-badge{flex-shrink:0;display:inline-flex;align-items:center;gap:5px;
 font-size:10.5px;letter-spacing:0.06em;text-transform:uppercase;
 padding:3px 8px 3px 7px;border-radius:9999px;line-height:1;font-weight:600}
.tbrowse-card-badge--anchor{
 color:#4f46e5;background:color-mix(in srgb,#4f46e5 9%,transparent)}
.tbrowse-card-badge--anchor::before{content:"";display:inline-block;
 width:4px;height:4px;border-radius:50%;background:#4f46e5}
.tbrowse-card-badge--spec{
 color:var(--ink-faint,#71717a);background:var(--paper-deep,#f4f4f5)}
.tbrowse-card-body{font-size:13.5px;line-height:1.55;color:var(--ink-soft,#3f3f46);
 margin:0;flex:1}
.tbrowse-card-foot{display:flex;align-items:center;justify-content:space-between;
 margin-top:4px;padding-top:10px;border-top:1px solid var(--hairline-2,rgba(17,17,17,0.06))}
.tbrowse-card-count{font-size:11.5px;color:var(--ink-faint,#71717a);
 font-variant-numeric:tabular-nums;letter-spacing:0}
.tbrowse-card-cta{display:inline-flex;align-items:center;gap:6px;
 font-size:12.5px;font-weight:500;color:var(--ink,#111);text-decoration:none;
 padding:6px 10px;border-radius:9999px;
 transition:background-color 140ms ease,color 140ms ease}
.tbrowse-card-cta:hover{background:color-mix(in srgb,#4f46e5 10%,transparent);
 color:#4338ca}
.tbrowse-card-cta-arrow{transition:transform 200ms cubic-bezier(0.2,0,0,1)}
.tbrowse-card-cta:hover .tbrowse-card-cta-arrow{transform:translateX(2px)}
.tbrowse-empty{padding:24px 16px;border-radius:16px;
 border:1px dashed var(--hairline,rgba(17,17,17,0.10));
 color:var(--ink-faint,#71717a);font-size:13.5px;text-align:center;line-height:1.55}
@keyframes tbrowse-fadein{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion: reduce){
 .tbrowse-grid{animation:none}
 .tbrowse-card{transition:none}
}
`;

export function TemplatesBrowser({
  templates,
  pills,
  current,
}: {
  templates: FeaturedTemplate[];
  pills: TemplatePill[];
  current: TemplateAudience;
}) {
  const filtered = useMemo(
    () => templates.filter((t) => t.audience === current),
    [templates, current],
  );

  const noun =
    filtered.length === 1 ? DEPTH_NOUN[current].one : DEPTH_NOUN[current].many;
  const depthLabel = `${filtered.length} ${noun}`;

  return (
    <div className="tbrowse-shell">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />
      <TemplatePills pills={pills} current={current} depthLabel={depthLabel} />
      <div
        key={current}
        className="tbrowse-grid"
        data-audience={current}
        role="list"
      >
        {filtered.length === 0 ? (
          <div className="tbrowse-empty" role="listitem">
            No templates for this audience yet. Tell us what would help —{" "}
            <a
              href="/contact"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              hello@signalstudio.ie
            </a>
            .
          </div>
        ) : (
          filtered.map((t) => (
            <article key={t.id} className="tbrowse-card" role="listitem">
              <div className="tbrowse-card-head">
                <h3 className="tbrowse-card-title">{t.name}</h3>
                {t.shape === "anchor" ? (
                  <span
                    className="tbrowse-card-badge tbrowse-card-badge--anchor"
                    title="Seeds Tasks, Notes, Timeline, and Signal in one go"
                  >
                    All 4 products
                  </span>
                ) : (
                  <span className="tbrowse-card-badge tbrowse-card-badge--spec">
                    Tasks only
                  </span>
                )}
              </div>
              <p className="tbrowse-card-body">{t.description}</p>
              <div className="tbrowse-card-foot">
                <span className="tbrowse-card-count">
                  {t.taskCount} tasks
                </span>
                <a
                  href={t.applyHref}
                  className="tbrowse-card-cta"
                  aria-label={`Apply ${t.name}, opens in Signal Tasks`}
                >
                  Apply in Tasks
                  <svg
                    className="tbrowse-card-cta-arrow"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
