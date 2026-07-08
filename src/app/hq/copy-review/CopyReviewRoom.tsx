"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  reviewCopyItemAction,
  toggleCopyHallAction,
} from "./actions";
import type {
  CopyGuidanceRule,
  CopyReviewHeatmapCell,
  CopyReviewItem,
  CopyReviewSnapshot,
  CopyReviewStatus,
  CopyReviewType,
} from "@/lib/hq/copy-review-types";

type ViewKey =
  | "needs_review"
  | "weekly"
  | "approved"
  | "rejected"
  | "needs_work"
  | "deferred"
  | "high_risk"
  | "legal_pricing"
  | "public"
  | "search"
  | "heatmap"
  | "guidance"
  | "hall";

const REVIEW_ACTIONS: Array<{
  status: Exclude<CopyReviewStatus, "needs_review">;
  label: string;
  key: string;
}> = [
  { status: "approved", label: "Approve", key: "A" },
  { status: "needs_work", label: "Needs work", key: "W" },
  { status: "rejected", label: "Reject", key: "R" },
  { status: "deferred", label: "Defer", key: "D" },
];

const VIEW_LABELS: Array<{ key: ViewKey; label: string; hint: string }> = [
  { key: "needs_review", label: "Needs review", hint: "New and changed copy" },
  { key: "weekly", label: "Weekly mode", hint: "The focused session" },
  { key: "approved", label: "Approved", hint: "Exact hashes cleared" },
  { key: "rejected", label: "Rejected", hint: "No, with reasons" },
  { key: "needs_work", label: "Needs work", hint: "Rewrite queue" },
  { key: "deferred", label: "Deferred", hint: "Not blocking ship" },
  { key: "high_risk", label: "High risk", hint: "Claims, money, legal" },
  { key: "legal_pricing", label: "Legal and pricing", hint: "Founder only" },
  { key: "public", label: "Public-facing", hint: "External surfaces" },
  { key: "search", label: "Search", hint: "Every phrase" },
  { key: "heatmap", label: "Coverage", hint: "Where review is thin" },
  { key: "guidance", label: "Guidance", hint: "Editorial memory" },
  { key: "hall", label: "Hall of fame", hint: "Approved examples" },
];

export function CopyReviewRoom({ snapshot }: { snapshot: CopyReviewSnapshot }) {
  const [items, setItems] = useState(snapshot.items);
  const [view, setView] = useState<ViewKey>("needs_review");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<CopyReviewType | "all">("all");
  const [selectedId, setSelectedId] = useState(snapshot.items[0]?.id ?? "");
  const [comment, setComment] = useState("");
  const [saveAsGuidance, setSaveAsGuidance] = useState(true);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  const filteredItems = useMemo(
    () => filterItems(items, view, query, typeFilter, snapshot.weeklyReview.items.map((item) => item.id)),
    [items, query, snapshot.weeklyReview.items, typeFilter, view],
  );
  const visibleQueueItems = filteredItems.slice(0, 120);

  useEffect(() => {
    if (!selected && filteredItems[0]) setSelectedId(filteredItems[0].id);
    if (selected && !filteredItems.some((item) => item.id === selected.id) && filteredItems[0]) {
      setSelectedId(filteredItems[0].id);
    }
  }, [filteredItems, selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable) return;
      if (!selected) return;

      const key = event.key.toLowerCase();
      if (key === "j") {
        event.preventDefault();
        moveSelection(1);
      } else if (key === "k") {
        event.preventDefault();
        moveSelection(-1);
      } else if (key === "c") {
        event.preventDefault();
        commentRef.current?.focus();
      } else if (key === "a") {
        event.preventDefault();
        submitReview("approved");
      } else if (key === "r") {
        event.preventDefault();
        submitReview("rejected");
      } else if (key === "w") {
        event.preventDefault();
        submitReview("needs_work");
      } else if (key === "d") {
        event.preventDefault();
        submitReview("deferred");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function moveSelection(delta: number) {
    if (filteredItems.length === 0) return;
    const currentIndex = Math.max(0, filteredItems.findIndex((item) => item.id === selectedId));
    const nextIndex = Math.min(filteredItems.length - 1, Math.max(0, currentIndex + delta));
    setSelectedId(filteredItems[nextIndex].id);
    setComment("");
  }

  function submitReview(status: Exclude<CopyReviewStatus, "needs_review">) {
    if (!selected || isPending) return;
    const submittedComment = comment.trim();
    const now = new Date().toISOString();
    setMessage("");
    setItems((current) =>
      current.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              status,
              approvedHash: status === "approved" ? item.hash : item.approvedHash,
              previousApprovedText: status === "approved" ? item.text : item.previousApprovedText,
              lastReviewedAt: now,
              founderComments: submittedComment
                ? [...item.founderComments, submittedComment]
                : item.founderComments,
              reviewHistory: [
                ...item.reviewHistory,
                {
                  hash: item.hash,
                  status,
                  reviewedAt: now,
                  comment: submittedComment || undefined,
                  reviewer: "founder",
                },
              ],
            }
          : item,
      ),
    );
    setComment("");
    startTransition(async () => {
      try {
        await reviewCopyItemAction({
          itemId: selected.id,
          hash: selected.hash,
          status,
          comment: submittedComment,
          saveAsGuidance,
        });
        setMessage(`${selected.id} saved as ${status.replace("_", " ")}.`);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Review update failed.");
      }
    });
  }

  function toggleHall(item: CopyReviewItem) {
    const next = !item.isHallOfFame;
    setItems((current) =>
      current.map((candidate) =>
        candidate.id === item.id
          ? {
              ...candidate,
              isHallOfFame: next,
              hallCategory: next ? candidate.copyType : undefined,
            }
          : candidate,
      ),
    );
    startTransition(async () => {
      try {
        await toggleCopyHallAction({
          itemId: item.id,
          hash: item.hash,
          hallOfFame: next,
          hallCategory: item.copyType,
        });
        setMessage(next ? "Saved to Hall of Fame." : "Removed from Hall of Fame.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Hall update failed.");
      }
    });
  }

  async function batchApprove() {
    const candidates = filteredItems.filter(canBatchApprove);
    if (candidates.length === 0 || isPending) return;
    const now = new Date().toISOString();
    setItems((current) =>
      current.map((item) =>
        candidates.some((candidate) => candidate.id === item.id)
          ? {
              ...item,
              status: "approved",
              approvedHash: item.hash,
              previousApprovedText: item.text,
              lastReviewedAt: now,
            }
          : item,
      ),
    );
    startTransition(async () => {
      for (const item of candidates) {
        await reviewCopyItemAction({
          itemId: item.id,
          hash: item.hash,
          status: "approved",
          comment: "Batch-approved: unchanged, low risk, and clean pre-review.",
          saveAsGuidance: false,
        });
      }
      setMessage(`${candidates.length} low-risk unchanged items approved.`);
    });
  }

  const counts = countByStatus(items);

  return (
    <div className="hq-copy-shell">
      <header className="hq-copy-hero">
        <div>
          <span className="hq-copy-kicker">Founder Copy Review</span>
          <h1 id="copy-review-title">
            Approve the words, not the slot<span aria-hidden="true">.</span>
          </h1>
          <p>
            Each approval belongs to the exact text hash. Change one character and the item returns to
            review. Shipping keeps moving, the queue keeps the memory.
          </p>
        </div>
        <div className="hq-copy-files" aria-label="copy review files">
          <span>inventory</span>
          <code>{snapshot.inventoryPath}</code>
          <span>founder state</span>
          <code>{snapshot.statePath}</code>
        </div>
      </header>

      <section className="hq-copy-metrics" aria-label="copy approval metrics">
        {snapshot.metrics.map((metric) => (
          <div key={metric.label} className="hq-copy-metric" data-tone={metric.tone}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </div>
        ))}
      </section>

      <div className="hq-copy-workbench">
        <aside className="hq-copy-sidebar" aria-label="copy review views">
          <div className="hq-copy-sidebar-head">
            <span>views</span>
            <small>{items.length} items</small>
          </div>
          {VIEW_LABELS.map((entry) => (
            <button
              key={entry.key}
              type="button"
              className="hq-copy-view"
              data-active={view === entry.key}
              onClick={() => setView(entry.key)}
            >
              <span>{entry.label}</span>
              <small>{entry.hint}</small>
              <b>{viewCount(entry.key, items, snapshot.weeklyReview.items)}</b>
            </button>
          ))}
        </aside>

        <section className="hq-copy-main">
          <div className="hq-copy-toolbar">
            <label>
              <span>Search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="copy, route, audience, note"
              />
            </label>
            <label>
              <span>Type</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as CopyReviewType | "all")}
              >
                <option value="all">all types</option>
                {copyTypes(items).map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <div className="hq-copy-toolbar-actions">
              <button type="button" onClick={batchApprove} disabled={isPending}>
                Batch approve clean
              </button>
              <span>{filteredItems.length} shown</span>
            </div>
          </div>

          <PresetRail
            presets={snapshot.searchPresets}
            onPick={(preset) => {
              setView("search");
              setQuery(preset.query);
              setTypeFilter(preset.type ?? "all");
            }}
          />

          {view === "heatmap" ? (
            <HeatmapView heatmap={snapshot.heatmap} />
          ) : view === "guidance" ? (
            <GuidanceView guidance={snapshot.guidance} items={items} />
          ) : view === "hall" ? (
            <HallView items={items.filter((item) => item.isHallOfFame || snapshot.hallOfFame.some((hall) => hall.id === item.id))} onToggle={toggleHall} />
          ) : (
            <div className="hq-copy-review-grid">
              <div className="hq-copy-queue" aria-label="copy queue">
                <div className="hq-copy-queue-head">
                  <span>{viewLabel(view)}</span>
                  <small>
                    {counts.needs_review} need review, {counts.approved} approved
                  </small>
                </div>
                {filteredItems.length === 0 ? (
                  <div className="hq-copy-empty">
                    <strong>Nothing in this view.</strong>
                    <span>The queue is clean for this filter.</span>
                  </div>
                ) : (
                  <>
                    {filteredItems.length > visibleQueueItems.length ? (
                      <div className="hq-copy-truncated">
                        Showing the first {visibleQueueItems.length} matches. Search or filter to narrow the queue.
                      </div>
                    ) : null}
                    {visibleQueueItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="hq-copy-card"
                      data-active={selected?.id === item.id}
                      data-status={item.status}
                      onClick={() => {
                        setSelectedId(item.id);
                        setComment("");
                      }}
                    >
                      <span className="hq-copy-card-meta">
                        <b>{item.copyType.replace("_", " ")}</b>
                        <small>{item.productArea}</small>
                      </span>
                      <span className="hq-copy-card-text">{item.text}</span>
                      <span className="hq-copy-card-foot">
                        <small>{item.route ?? item.location}</small>
                        <RiskBadge item={item} />
                      </span>
                    </button>
                    ))}
                  </>
                )}
              </div>

              {selected ? (
                <article className="hq-copy-detail" aria-live="polite">
                  <div className="hq-copy-detail-head">
                    <div>
                      <span className="hq-copy-kicker">{selected.status.replace("_", " ")}</span>
                      <h2>{selected.copyType.replace("_", " ")}</h2>
                    </div>
                    <button type="button" className="hq-copy-hall" onClick={() => toggleHall(selected)}>
                      {selected.isHallOfFame ? "In Hall" : "Save to Hall"}
                    </button>
                  </div>

                  <blockquote className="hq-copy-current">{selected.text}</blockquote>

                  <DiffView item={selected} />

                  <div className="hq-copy-actions" aria-label="review actions">
                    {REVIEW_ACTIONS.map((action) => (
                      <button
                        key={action.status}
                        type="button"
                        data-action={action.status}
                        disabled={isPending}
                        onClick={() => submitReview(action.status)}
                      >
                        <span>{action.label}</span>
                        <kbd>{action.key}</kbd>
                      </button>
                    ))}
                  </div>

                  <label className="hq-copy-comment">
                    <span>Founder comment</span>
                    <textarea
                      ref={commentRef}
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Capture the reason. It becomes reusable editorial memory."
                    />
                  </label>
                  <label className="hq-copy-check">
                    <input
                      type="checkbox"
                      checked={saveAsGuidance}
                      onChange={(event) => setSaveAsGuidance(event.target.checked)}
                    />
                    <span>Promote this comment into Founder Guidance</span>
                  </label>
                  <p className="hq-copy-sync">{message || (isPending ? "Saving review state..." : "Shortcuts: A approve, W needs work, R reject, D defer, C comment, J/K move.")}</p>
                </article>
              ) : null}

              {selected ? <MetadataPanel item={selected} /> : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PresetRail({
  presets,
  onPick,
}: {
  presets: CopyReviewSnapshot["searchPresets"];
  onPick: (preset: CopyReviewSnapshot["searchPresets"][number]) => void;
}) {
  return (
    <div className="hq-copy-presets" aria-label="search presets">
      {presets.map((preset) => (
        <button key={preset.label} type="button" onClick={() => onPick(preset)}>
          {preset.label}
        </button>
      ))}
    </div>
  );
}

function DiffView({ item }: { item: CopyReviewItem }) {
  const previous = item.previousApprovedText ?? item.previousText;
  if (!previous || previous === item.text) {
    return (
      <section className="hq-copy-diff" aria-label="copy version comparison">
        <span>Previous approved copy</span>
        <p>No previous approved version for this exact item.</p>
      </section>
    );
  }
  const diff = wordDiff(previous, item.text);
  return (
    <section className="hq-copy-diff" aria-label="copy version comparison">
      <span>Diff</span>
      <p>
        {diff.map((part, index) => (
          <mark key={`${part.kind}-${index}`} data-kind={part.kind}>
            {part.word}
            {index < diff.length - 1 ? " " : ""}
          </mark>
        ))}
      </p>
    </section>
  );
}

function MetadataPanel({ item }: { item: CopyReviewItem }) {
  return (
    <aside className="hq-copy-meta" aria-label="copy metadata">
      <section>
        <h3>Metadata</h3>
        <dl>
          <dt>ID</dt>
          <dd><code>{item.id}</code></dd>
          <dt>Hash</dt>
          <dd><code>{item.hash.slice(0, 12)}</code></dd>
          <dt>Location</dt>
          <dd>{item.location}:{item.line}</dd>
          <dt>Route</dt>
          <dd>{item.route ?? "not routed"}</dd>
          <dt>Area</dt>
          <dd>{item.productArea}</dd>
          <dt>Audience</dt>
          <dd>{item.audience ?? "unassigned"}</dd>
          <dt>Exposure</dt>
          <dd>{item.exposure}</dd>
          <dt>Last modified</dt>
          <dd>{dateLabel(item.lastModified)}</dd>
          <dt>Last reviewed</dt>
          <dd>{item.lastReviewedAt ? dateLabel(item.lastReviewedAt) : "not reviewed"}</dd>
        </dl>
      </section>
      <section>
        <h3>Pre-review</h3>
        <RiskBadge item={item} />
        <ul>
          {item.aiNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Founder memory</h3>
        {item.founderComments.length === 0 ? (
          <p>No founder comments yet.</p>
        ) : (
          <ul>
            {item.founderComments.map((note, index) => (
              <li key={`${note}-${index}`}>{note}</li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h3>History</h3>
        {item.reviewHistory.length === 0 ? (
          <p>No review history yet.</p>
        ) : (
          <ol>
            {item.reviewHistory.slice().reverse().map((entry) => (
              <li key={`${entry.hash}-${entry.reviewedAt}`}>
                <span>{entry.status.replace("_", " ")}</span>
                <small>{dateLabel(entry.reviewedAt)} on {entry.hash.slice(0, 8)}</small>
              </li>
            ))}
          </ol>
        )}
      </section>
    </aside>
  );
}

function HeatmapView({ heatmap }: { heatmap: CopyReviewSnapshot["heatmap"] }) {
  return (
    <div className="hq-copy-heatmap">
      {Object.entries(heatmap).map(([label, cells]) => (
        <section key={label}>
          <div className="hq-copy-section-head">
            <span>{label}</span>
            <small>approval coverage</small>
          </div>
          <div className="hq-copy-heatgrid">
            {(cells as CopyReviewHeatmapCell[]).map((cell) => (
              <article key={cell.key} className="hq-copy-heatcell">
                <div>
                  <strong>{cell.label}</strong>
                  <span>{cell.approvedPct}% approved</span>
                </div>
                <div className="hq-copy-bar" aria-hidden="true">
                  <i style={{ width: `${cell.approvedPct}%` }} />
                </div>
                <small>
                  {cell.needsReview} review, {cell.needsWork + cell.rejected} rewrite, {cell.total} total
                </small>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GuidanceView({
  guidance,
  items,
}: {
  guidance: CopyGuidanceRule[];
  items: CopyReviewItem[];
}) {
  return (
    <div className="hq-copy-guidance">
      <div className="hq-copy-section-head">
        <span>Founder Guidance</span>
        <small>{guidance.length} reusable notes</small>
      </div>
      {guidance.length === 0 ? (
        <div className="hq-copy-empty">
          <strong>No guidance yet.</strong>
          <span>Reject, approve, or mark copy as needs work with comments to build the editorial memory.</span>
        </div>
      ) : (
        guidance.map((rule) => {
          const item = items.find((candidate) => candidate.id === rule.sourceItemId);
          return (
            <article key={rule.id} className="hq-copy-guidance-card" data-sentiment={rule.sentiment}>
              <p>{rule.text}</p>
              <div>
                {rule.tags.map((tag) => (
                  <span key={tag}>{tag.replace("_", " ")}</span>
                ))}
              </div>
              <small>
                {item ? `${item.location}:${item.line}` : "manual guidance"} / {dateLabel(rule.createdAt)}
              </small>
            </article>
          );
        })
      )}
    </div>
  );
}

function HallView({
  items,
  onToggle,
}: {
  items: CopyReviewItem[];
  onToggle: (item: CopyReviewItem) => void;
}) {
  const approved = items.filter((item) => item.status === "approved");
  return (
    <div className="hq-copy-hall-view">
      <div className="hq-copy-section-head">
        <span>Hall of Fame</span>
        <small>{approved.length} approved examples and candidates</small>
      </div>
      {approved.length === 0 ? (
        <div className="hq-copy-empty">
          <strong>No approved examples yet.</strong>
          <span>Approve copy, then save the strongest lines here for future writing retrieval.</span>
        </div>
      ) : (
        <div className="hq-copy-hall-grid">
          {approved.map((item) => (
            <article key={item.id} className="hq-copy-hall-card" data-saved={item.isHallOfFame}>
              <span>{item.hallCategory ?? item.copyType}</span>
              <p>{item.text}</p>
              <small>{item.productArea} / {item.route ?? item.location}</small>
              <button type="button" onClick={() => onToggle(item)}>
                {item.isHallOfFame ? "Remove" : "Save"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ item }: { item: CopyReviewItem }) {
  return (
    <span className="hq-copy-risk" data-risk={item.riskLevel}>
      {item.riskLevel} / {item.riskScore}
    </span>
  );
}

function filterItems(
  items: CopyReviewItem[],
  view: ViewKey,
  query: string,
  typeFilter: CopyReviewType | "all",
  weeklyIds: string[],
): CopyReviewItem[] {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    const viewMatch =
      view === "needs_review"
        ? item.status === "needs_review"
        : view === "weekly"
          ? weeklyIds.includes(item.id)
          : view === "approved"
            ? item.status === "approved"
            : view === "rejected"
              ? item.status === "rejected"
              : view === "needs_work"
                ? item.status === "needs_work"
                : view === "deferred"
                  ? item.status === "deferred"
                  : view === "high_risk"
                    ? item.riskLevel === "high"
                    : view === "legal_pricing"
                      ? item.copyType === "pricing" || item.copyType === "legal" || item.exposure === "legal"
                      : view === "public"
                        ? item.exposure === "public" || item.exposure === "marketing"
                        : true;
    if (!viewMatch) return false;
    if (typeFilter !== "all" && item.copyType !== typeFilter) return false;
    if (!q) return true;
    const hay = [
      item.text,
      item.location,
      item.route ?? "",
      item.productArea,
      item.audience ?? "",
      item.copyType,
      item.status,
      item.exposure,
      item.aiNotes.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((token) => hay.includes(token));
  });
}

function canBatchApprove(item: CopyReviewItem): boolean {
  return (
    item.status === "needs_review" &&
    item.riskLevel === "low" &&
    !item.isChanged &&
    item.exposure !== "legal" &&
    item.copyType !== "pricing" &&
    item.copyType !== "legal" &&
    item.aiNotes.every((note) => note.startsWith("No obvious"))
  );
}

function viewCount(view: ViewKey, items: CopyReviewItem[], weeklyItems: CopyReviewItem[]): number {
  return filterItems(items, view, "", "all", weeklyItems.map((item) => item.id)).length;
}

function viewLabel(view: ViewKey): string {
  return VIEW_LABELS.find((entry) => entry.key === view)?.label ?? "Queue";
}

function countByStatus(items: CopyReviewItem[]) {
  return items.reduce(
    (acc, item) => {
      acc[item.status] += 1;
      return acc;
    },
    {
      approved: 0,
      needs_review: 0,
      rejected: 0,
      needs_work: 0,
      deferred: 0,
    } satisfies Record<CopyReviewStatus, number>,
  );
}

function copyTypes(items: CopyReviewItem[]): CopyReviewType[] {
  return Array.from(new Set(items.map((item) => item.copyType))).sort();
}

function dateLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function wordDiff(previous: string, current: string): Array<{ word: string; kind: "same" | "add" | "remove" }> {
  const a = previous.split(/\s+/).filter(Boolean);
  const b = current.split(/\s+/).filter(Boolean);
  const dp = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const parts: Array<{ word: string; kind: "same" | "add" | "remove" }> = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      parts.push({ word: a[i], kind: "same" });
      i += 1;
      j += 1;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      parts.push({ word: a[i], kind: "remove" });
      i += 1;
    } else {
      parts.push({ word: b[j], kind: "add" });
      j += 1;
    }
  }
  while (i < a.length) {
    parts.push({ word: a[i], kind: "remove" });
    i += 1;
  }
  while (j < b.length) {
    parts.push({ word: b[j], kind: "add" });
    j += 1;
  }
  return parts;
}
