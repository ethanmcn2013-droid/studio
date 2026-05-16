"use client";

import { useState } from "react";
import type { Bucket, Approach } from "@/lib/hq/marketing";

/**
 * HQ Marketing hub — the working surface for the six-month plan.
 *
 * One section, six tabs (the strategic buckets). Every approach shown
 * has already cleared the three-director panel (Brand · Marketing ·
 * Feasibility) with no reservation — the panel is the gate, not the
 * decoration, so it's stated once per row in the restrained
 * dot+mono register, never as a stoplight.
 *
 * Same register as the atlas and the masthead: paper white, ink, one
 * indigo, hairlines, no card chrome. The active tab earns the indigo
 * edge; the leverage signal is rank + impact + effort + month, not
 * colour.
 */
export function HqMarketing({ buckets }: { buckets: Bucket[] }) {
  const [active, setActive] = useState<string>(buckets[0]?.key ?? "");
  const current = buckets.find((b) => b.key === active) ?? buckets[0];

  return (
    <section className="mkt" aria-label="marketing hub">
      <div
        className="mkt-tabs"
        role="tablist"
        aria-label="marketing buckets"
      >
        {buckets.map((b) => {
          const isActive = b.key === active;
          return (
            <button
              key={b.key}
              role="tab"
              type="button"
              id={`mkt-tab-${b.key}`}
              aria-selected={isActive}
              aria-controls={`mkt-panel-${b.key}`}
              tabIndex={isActive ? 0 : -1}
              data-active={isActive}
              className="mkt-tab"
              onClick={() => setActive(b.key)}
            >
              {b.label}
              <span className="mkt-tab-count">{b.approaches.length}</span>
            </button>
          );
        })}
      </div>

      {current && (
        <div
          role="tabpanel"
          id={`mkt-panel-${current.key}`}
          aria-labelledby={`mkt-tab-${current.key}`}
          className="mkt-panel"
        >
          <div className="mkt-bucket-head">
            <p className="mkt-bucket-role">{current.role}</p>
            <p className="mkt-bucket-rationale">{current.rationale}</p>
          </div>

          <ol className="mkt-list" aria-label={`${current.label} approaches`}>
            {current.approaches.map((a) => (
              <ApproachRow key={a.id} a={a} />
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function ApproachRow({ a }: { a: Approach }) {
  return (
    <li className="mkt-row">
      <span className="mkt-rank" aria-hidden="true">
        {String(a.rank).padStart(2, "0")}
      </span>
      <div className="mkt-body">
        <h3 className="mkt-title">{a.title}</h3>
        <p className="mkt-what">{a.what}</p>
        <p className="mkt-edge">{a.edge}</p>
      </div>
      <div className="mkt-meta">
        <span className="mkt-tag" data-impact={a.impact}>
          {a.impact}
        </span>
        <span className="mkt-attr">{a.effort} effort</span>
        <span className="mkt-attr">{a.month}</span>
        <span
          className="mkt-panel-mark"
          title="Cleared Brand, Marketing and Feasibility directors"
        >
          panel <b>B</b>·<b>M</b>·<b>F</b>
        </span>
      </div>
    </li>
  );
}
