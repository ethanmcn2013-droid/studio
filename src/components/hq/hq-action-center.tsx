"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ActionCenter, ActionItem, ActionPriority } from "@/lib/hq/action-center";
import { PRIORITY_LABEL } from "@/lib/hq/action-center";

const FILTERS: Array<{ key: "all" | ActionPriority; label: string }> = [
  { key: "all", label: "All" },
  { key: "due", label: "High" },
  { key: "stale", label: "Attention" },
  { key: "queued", label: "Review" },
];

function Row({ item }: { item: ActionItem }) {
  const body = (
    <>
      <span className="hqx-row-lead">
        <span className="hqx-row-marker" />
      </span>
      <span className="hqx-row-body">
        <span className="hqx-row-title">{item.title}</span>
        <span className="hqx-row-why">{item.why}</span>
      </span>
      <span className="hqx-row-meta">
        <span className="hqx-ac-ws">{item.workspace}</span>
        {item.meta ? <span className="hqx-ac-metatext">{item.meta}</span> : null}
        {item.href ? <span className="hqx-row-arrow" aria-hidden="true">→</span> : null}
      </span>
    </>
  );
  return item.href ? (
    <Link href={item.href} className="hqx-row" data-priority={item.priority}>
      {body}
    </Link>
  ) : (
    <div className="hqx-row" data-priority={item.priority}>
      {body}
    </div>
  );
}

export function HqActionCenter({ data, trackerHref }: { data: ActionCenter; trackerHref: string }) {
  const [filter, setFilter] = useState<"all" | ActionPriority>("all");
  const [workspace, setWorkspace] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);

  const workspaces = useMemo(
    () => Array.from(new Set(data.items.map((i) => i.workspace))).sort(),
    [data.items],
  );

  const filtered = useMemo(() => {
    return data.items.filter(
      (i) =>
        (filter === "all" || i.priority === filter) &&
        (workspace === "all" || i.workspace === workspace),
    );
  }, [data.items, filter, workspace]);

  const COLLAPSE_AT = 6;
  const visible = showAll ? filtered : filtered.slice(0, COLLAPSE_AT);
  const hidden = filtered.length - visible.length;

  return (
    <div className="hqx-page">
      <header className="hqx-page-header">
        <span className="hqx-eyebrow">Source ledger</span>
        <div className="hqx-page-header-row">
          <h1 className="hqx-title">What the source files are signalling</h1>
          <span className="hqx-status" data-tone="quiet">
            <span className="hqx-dot" />
            {data.total} signals
          </span>
        </div>
        <p className="hqx-lede">
          This view reads risks, reviews, follow-ups, and operational checks from HQ sources. It preserves
          context; current priority, assignee, workflow status, and next proof live in the delivery tracker.
        </p>
        <a href={trackerHref} className="hqx-section-action" target="_blank" rel="noreferrer">
          Open delivery tracker ↗
        </a>
      </header>

      {data.critical.length > 0 ? (
        <section className="hqx-section" aria-label="Critical">
          {data.critical.slice(0, 3).map((item) => (
            <div key={item.id} className="hqx-banner" data-tone="critical">
              <span className="hqx-banner-mark" />
              <div className="hqx-banner-body">
                <span className="hqx-banner-kicker">Critical · {item.workspace}</span>
                <span className="hqx-banner-title">{item.title}</span>
                <span className="hqx-banner-text">{item.why}</span>
              </div>
              {item.href ? (
                <Link href={item.href} className="hqx-btn hqx-btn--primary">Open</Link>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      <section className="hqx-section">
        <div className="hqx-ac-controls">
          <div className="hqx-segmented" role="tablist" aria-label="Filter by priority">
            {FILTERS.map((f) => {
              const count = f.key === "all" ? data.total : data.counts[f.key];
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.key}
                  className="hqx-segmented-btn"
                  data-active={filter === f.key || undefined}
                  onClick={() => { setFilter(f.key); setShowAll(false); }}
                >
                  {f.label}
                  <span className="hqx-seg-count">{count}</span>
                </button>
              );
            })}
          </div>
          <label className="hqx-select-wrap">
            <span className="hqx-select-label">Workspace</span>
            <select
              className="hqx-select"
              value={workspace}
              onChange={(e) => { setWorkspace(e.target.value); setShowAll(false); }}
            >
              <option value="all">All workspaces</option>
              {workspaces.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="hqx-empty">
            <span className="hqx-empty-title">No matching source signals</span>
            <span>No {filter === "all" ? "" : PRIORITY_LABEL[filter as ActionPriority].toLowerCase() + " "}records{workspace === "all" ? "" : ` in ${workspace}`}.</span>
          </div>
        ) : (
          <>
            <div className="hqx-rows">
              {visible.map((item) => <Row key={item.id} item={item} />)}
            </div>
            {hidden > 0 ? (
              <button type="button" className="hqx-showmore" onClick={() => setShowAll(true)}>
                Show {hidden} more
              </button>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
