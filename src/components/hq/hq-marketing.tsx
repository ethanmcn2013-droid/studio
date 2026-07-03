"use client";

import { useEffect, useMemo, useState } from "react";
import type { Bucket, Approach, BucketKey } from "@/lib/hq/marketing";

/**
 * HQ Marketing hub, the operating surface for the six-month plan.
 *
 * Not a library: a tool. Every approach holds state; the hub drives the
 * founder's actual weekly rhythm (Monday brief → Tue–Thu publish → Friday
 * retro) and closes the loop against the real venue engine.
 *
 * Five modes, each earning its place against the plan:
 *   ideas      the 100, filterable, each with a status control
 *   this week  the Monday queue, never exceeds seven, by the plan
 *   timeline   the M1–M6 sequence, as a board
 *   engine     the live Venue Edition funnel + the concentration guardrail
 *   ledger     what shipped or died, and what it taught, the memory
 *
 * State is localStorage (the established HQ operator-surface pattern:
 * prospects/feedback/nextActions live the same way), per-browser, no
 * other source of truth, write-optimised. The relational approach→
 * prospect→close-rate join that would need Turso is deliberately not
 * faked: the engine funnel is read live, the outcome is operator-logged.
 *
 * Same register as the atlas and the masthead: paper, ink, one indigo,
 * hairlines, no card chrome. Status is read from a restrained dot, never
 * a stoplight.
 */

type ApproachStatus =
  | "idea"
  | "queued"
  | "in-flight"
  | "shipped"
  | "parked"
  | "killed";

type ApproachState = { status: ApproachStatus; note?: string; updated?: string };
type HubState = Record<string, ApproachState>;

const STORAGE_KEY = "signal-mkt-hub-v1";

const STATUSES: ApproachStatus[] = [
  "idea",
  "queued",
  "in-flight",
  "shipped",
  "parked",
  "killed",
];

const STATUS_LABEL: Record<ApproachStatus, string> = {
  idea: "idea",
  queued: "queued",
  "in-flight": "in flight",
  shipped: "shipped",
  parked: "parked",
  killed: "killed",
};

/** Active = it counts toward effort and the concentration guardrail. */
const ACTIVE: ApproachStatus[] = ["queued", "in-flight", "shipped"];
/** Closed = it belongs in the ledger. */
const CLOSED: ApproachStatus[] = ["shipped", "parked", "killed"];

type Flat = Approach & { bucketKey: BucketKey; bucketLabel: string };

type EngineSummary = {
  sponsors: number;
  issued: number;
  redeemed: number;
  reachedBoard: number;
  redeemed30d: number;
  error: string | null;
} | null;

type View = "ideas" | "this-week" | "timeline" | "engine" | "ledger";

export function HqMarketing({
  buckets,
  engine,
}: {
  buckets: Bucket[];
  engine: EngineSummary;
}) {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<HubState>({});
  const [view, setView] = useState<View>("ideas");
  const [activeBucket, setActiveBucket] = useState<string>(
    buckets[0]?.key ?? "",
  );
  const [fStatus, setFStatus] = useState<string>("all");
  const [fImpact, setFImpact] = useState<string>("all");
  const [fEffort, setFEffort] = useState<string>("all");
  const [fMonth, setFMonth] = useState<string>("all");

  // Load once on mount, server render and first client paint both use the
  // empty default, so there is no hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as HubState);
    } catch {
      /* corrupt or unavailable, start clean */
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota or unavailable, non-fatal */
    }
  }, [state, mounted]);

  const flat: Flat[] = useMemo(
    () =>
      buckets.flatMap((b) =>
        b.approaches.map((a) => ({
          ...a,
          bucketKey: b.key,
          bucketLabel: b.label,
        })),
      ),
    [buckets],
  );

  const statusOf = (id: string): ApproachStatus =>
    state[id]?.status ?? "idea";

  function setStatus(id: string, status: ApproachStatus) {
    setState((s) => ({
      ...s,
      [id]: {
        ...s[id],
        status,
        updated: new Date().toISOString().slice(0, 10),
      },
    }));
  }
  function setNote(id: string, note: string) {
    setState((s) => ({ ...s, [id]: { ...s[id], status: statusOf(id), note } }));
  }

  const counts = useMemo(() => {
    const c: Record<ApproachStatus, number> = {
      idea: 0,
      queued: 0,
      "in-flight": 0,
      shipped: 0,
      parked: 0,
      killed: 0,
    };
    for (const a of flat) c[statusOf(a.id)]++;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flat, state]);

  return (
    <section className="mkt" aria-label="marketing hub">
      <div className="mkt-views" role="tablist" aria-label="hub views">
        {(
          [
            ["ideas", "ideas"],
            ["this-week", `this week · ${counts.queued}`],
            ["timeline", "timeline"],
            ["engine", "engine"],
            ["ledger", `ledger · ${counts.shipped + counts.parked + counts.killed}`],
          ] as [View, string][]
        ).map(([v, label]) => (
          <button
            key={v}
            role="tab"
            type="button"
            aria-selected={view === v}
            data-active={view === v}
            className="mkt-view-tab"
            onClick={() => setView(v)}
          >
            {label}
          </button>
        ))}
        {!mounted && (
          <span className="mkt-hydrate" aria-hidden="true">
            loading state…
          </span>
        )}
      </div>

      {view === "ideas" && (
        <IdeasView
          buckets={buckets}
          activeBucket={activeBucket}
          setActiveBucket={setActiveBucket}
          statusOf={statusOf}
          setStatus={setStatus}
          setNote={setNote}
          noteOf={(id) => state[id]?.note ?? ""}
          filters={{ fStatus, fImpact, fEffort, fMonth }}
          setFilters={{ setFStatus, setFImpact, setFEffort, setFMonth }}
        />
      )}

      {view === "this-week" && (
        <ThisWeekView
          flat={flat}
          statusOf={statusOf}
          setStatus={setStatus}
          setNote={setNote}
          noteOf={(id) => state[id]?.note ?? ""}
        />
      )}

      {view === "timeline" && (
        <TimelineView flat={flat} statusOf={statusOf} />
      )}

      {view === "engine" && (
        <EngineView
          buckets={buckets}
          engine={engine}
          flat={flat}
          statusOf={statusOf}
          setStatus={setStatus}
        />
      )}

      {view === "ledger" && (
        <LedgerView
          flat={flat}
          statusOf={statusOf}
          noteOf={(id) => state[id]?.note ?? ""}
        />
      )}
    </section>
  );
}

/* ── shared row controls ─────────────────────────────────────────────── */

function StatusSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: ApproachStatus;
  onChange: (s: ApproachStatus) => void;
}) {
  return (
    <select
      className="mkt-status-select"
      data-status={value}
      aria-label={`status for ${id}`}
      value={value}
      onChange={(e) => onChange(e.target.value as ApproachStatus)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}

function NoteField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(Boolean(value));
  if (!open) {
    return (
      <button
        type="button"
        className="mkt-note-add"
        onClick={() => setOpen(true)}
      >
        + outcome / note
      </button>
    );
  }
  return (
    <textarea
      className="mkt-note"
      aria-label={`outcome note for ${id}`}
      placeholder="What happened. What it taught. Keep or kill."
      value={value}
      rows={2}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/* ── ideas ───────────────────────────────────────────────────────────── */

function IdeasView({
  buckets,
  activeBucket,
  setActiveBucket,
  statusOf,
  setStatus,
  setNote,
  noteOf,
  filters,
  setFilters,
}: {
  buckets: Bucket[];
  activeBucket: string;
  setActiveBucket: (k: string) => void;
  statusOf: (id: string) => ApproachStatus;
  setStatus: (id: string, s: ApproachStatus) => void;
  setNote: (id: string, v: string) => void;
  noteOf: (id: string) => string;
  filters: { fStatus: string; fImpact: string; fEffort: string; fMonth: string };
  setFilters: {
    setFStatus: (v: string) => void;
    setFImpact: (v: string) => void;
    setFEffort: (v: string) => void;
    setFMonth: (v: string) => void;
  };
}) {
  const current =
    buckets.find((b) => b.key === activeBucket) ?? buckets[0];
  const { fStatus, fImpact, fEffort, fMonth } = filters;

  const rows = (current?.approaches ?? []).filter((a) => {
    if (fStatus !== "all" && statusOf(a.id) !== fStatus) return false;
    if (fImpact !== "all" && a.impact !== fImpact) return false;
    if (fEffort !== "all" && a.effort !== fEffort) return false;
    if (fMonth !== "all" && !a.month.includes(fMonth)) return false;
    return true;
  });

  return (
    <div>
      <div className="mkt-tabs" role="tablist" aria-label="marketing buckets">
        {buckets.map((b) => (
          <button
            key={b.key}
            role="tab"
            type="button"
            aria-selected={b.key === activeBucket}
            data-active={b.key === activeBucket}
            className="mkt-tab"
            onClick={() => setActiveBucket(b.key)}
          >
            {b.label}
            <span className="mkt-tab-count">{b.approaches.length}</span>
          </button>
        ))}
      </div>

      <div className="mkt-filters" aria-label="filters">
        <Filter
          label="status"
          value={fStatus}
          onChange={setFilters.setFStatus}
          options={["all", ...STATUSES]}
        />
        <Filter
          label="impact"
          value={fImpact}
          onChange={setFilters.setFImpact}
          options={["all", "Engine", "High", "Medium"]}
        />
        <Filter
          label="effort"
          value={fEffort}
          onChange={setFilters.setFEffort}
          options={["all", "Low", "Medium"]}
        />
        <Filter
          label="month"
          value={fMonth}
          onChange={setFilters.setFMonth}
          options={["all", "M1", "M2", "M3", "M4", "M5", "M6"]}
        />
        <span className="mkt-filter-count">
          {rows.length} / {current?.approaches.length ?? 0}
        </span>
      </div>

      {current && (
        <>
          <div className="mkt-bucket-head">
            <p className="mkt-bucket-role">{current.role}</p>
            <p className="mkt-bucket-rationale">{current.rationale}</p>
          </div>

          {rows.length === 0 ? (
            <p className="mkt-empty">No approaches match these filters.</p>
          ) : (
            <ol className="mkt-list">
              {rows.map((a) => (
                <li className="mkt-row" key={a.id}>
                  <span className="mkt-rank" aria-hidden="true">
                    {String(a.rank).padStart(2, "0")}
                  </span>
                  <div className="mkt-body">
                    <h3 className="mkt-title">{a.title}</h3>
                    <p className="mkt-what">{a.what}</p>
                    <p className="mkt-edge">{a.edge}</p>
                    <div className="mkt-row-controls">
                      <StatusSelect
                        id={a.id}
                        value={statusOf(a.id)}
                        onChange={(s) => setStatus(a.id, s)}
                      />
                      <NoteField
                        id={a.id}
                        value={noteOf(a.id)}
                        onChange={(v) => setNote(a.id, v)}
                      />
                    </div>
                  </div>
                  <div className="mkt-meta">
                    <span className="mkt-tag" data-impact={a.impact}>
                      {a.impact}
                    </span>
                    <span className="mkt-attr">{a.effort} effort</span>
                    <span className="mkt-attr">{a.month}</span>
                    <span
                      className="mkt-dot"
                      data-status={statusOf(a.id)}
                      title={STATUS_LABEL[statusOf(a.id)]}
                    >
                      {STATUS_LABEL[statusOf(a.id)]}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="mkt-filter">
      <span className="mkt-filter-label">{label}</span>
      <select
        className="mkt-filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "all" ? "all" : STATUS_LABEL[o as ApproachStatus] ?? o}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── this week ───────────────────────────────────────────────────────── */

function ThisWeekView({
  flat,
  statusOf,
  setStatus,
  setNote,
  noteOf,
}: {
  flat: Flat[];
  statusOf: (id: string) => ApproachStatus;
  setStatus: (id: string, s: ApproachStatus) => void;
  setNote: (id: string, v: string) => void;
  noteOf: (id: string) => string;
}) {
  const queued = flat.filter((a) => statusOf(a.id) === "queued");
  const over = queued.length - 7;

  return (
    <div className="mkt-week">
      <div className="mkt-rhythm" aria-label="founder rhythm">
        <RhythmRow when="Monday · 60m" what="clear the queue · write the brief · one venue email" />
        <RhythmRow when="Tue–Thu · 30m" what="same-day venue replies · publish one approved asset" />
        <RhythmRow when="Friday · 30m" what="what shipped · one retro line · fix one factory miss" />
      </div>

      {queued.length === 0 ? (
        <p className="mkt-empty">
          The queue is empty. Set an approach to{" "}
          <span style={{ color: "var(--ink)" }}>queued</span> in Ideas to pull
          it into this week.
        </p>
      ) : (
        <>
          <p
            className="mkt-queue-caption"
            data-over={over > 0 ? "true" : "false"}
          >
            {queued.length} queued ·{" "}
            {over > 0
              ? `the queue never exceeds seven on a Monday, ${over} over`
              : "within the seven-item Monday limit"}
          </p>
          <ol className="mkt-list">
            {queued.map((a) => (
              <li className="mkt-row" key={a.id}>
                <span className="mkt-rank" aria-hidden="true">
                  {a.id}
                </span>
                <div className="mkt-body">
                  <h3 className="mkt-title">{a.title}</h3>
                  <p className="mkt-what">{a.what}</p>
                  <div className="mkt-row-controls">
                    <button
                      type="button"
                      className="mkt-quick"
                      onClick={() => setStatus(a.id, "in-flight")}
                    >
                      → in flight
                    </button>
                    <button
                      type="button"
                      className="mkt-quick"
                      onClick={() => setStatus(a.id, "shipped")}
                    >
                      → shipped
                    </button>
                    <NoteField
                      id={a.id}
                      value={noteOf(a.id)}
                      onChange={(v) => setNote(a.id, v)}
                    />
                  </div>
                </div>
                <div className="mkt-meta">
                  <span className="mkt-tag" data-impact={a.impact}>
                    {a.impact}
                  </span>
                  <span className="mkt-attr">{a.bucketLabel}</span>
                  <span className="mkt-attr">{a.month}</span>
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  );
}

function RhythmRow({ when, what }: { when: string; what: string }) {
  return (
    <div className="mkt-rhythm-row">
      <span className="mkt-rhythm-when">{when}</span>
      <span className="mkt-rhythm-what">{what}</span>
    </div>
  );
}

/* ── timeline ────────────────────────────────────────────────────────── */

function TimelineView({
  flat,
  statusOf,
}: {
  flat: Flat[];
  statusOf: (id: string) => ApproachStatus;
}) {
  const months = ["M1", "M2", "M3", "M4", "M5", "M6"];
  const col = (m: string) =>
    flat.filter((a) => {
      const first = a.month.match(/M[1-6]/)?.[0];
      return first === m;
    });

  return (
    <div className="mkt-timeline" aria-label="M1–M6 sequence">
      {months.map((m) => {
        const items = col(m);
        return (
          <div className="mkt-tl-col" key={m}>
            <div className="mkt-tl-head">
              {m}
              <span className="mkt-tl-count">{items.length}</span>
            </div>
            <ul className="mkt-tl-list">
              {items.map((a) => (
                <li className="mkt-tl-item" key={a.id}>
                  <span
                    className="mkt-tl-dot"
                    data-status={statusOf(a.id)}
                    aria-hidden="true"
                  />
                  <span
                    className="mkt-tl-title"
                    data-status={statusOf(a.id)}
                  >
                    {a.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ── engine ──────────────────────────────────────────────────────────── */

function EngineView({
  buckets,
  engine,
  flat,
  statusOf,
  setStatus,
}: {
  buckets: Bucket[];
  engine: EngineSummary;
  flat: Flat[];
  statusOf: (id: string) => ApproachStatus;
  setStatus: (id: string, s: ApproachStatus) => void;
}) {
  const active = flat.filter((a) => ACTIVE.includes(statusOf(a.id)));
  const venueActive = active.filter((a) => a.bucketKey === "venue-engine");
  const pct =
    active.length === 0
      ? 0
      : Math.round((venueActive.length / active.length) * 100);
  const band = pct > 75 ? "breach" : pct >= 60 ? "watch" : "ok";

  const venueBucket = buckets.find((b) => b.key === "venue-engine");

  return (
    <div className="mkt-engine">
      <div className="mkt-engine-funnel" aria-label="venue edition funnel">
        {engine && !engine.error ? (
          <>
            <FunnelStat n={engine.sponsors} label="venues / sponsors" />
            <FunnelStat n={engine.issued} label="codes issued" />
            <FunnelStat n={engine.redeemed} label="redeemed" />
            <FunnelStat n={engine.reachedBoard} label="reached board" />
            <FunnelStat n={engine.redeemed30d} label="redeemed · 30d" />
          </>
        ) : (
          <p className="mkt-empty">
            Live partner funnel unavailable
            {engine?.error ? `, ${engine.error}` : ""}. The numbers read from
            studio&rsquo;s license_codes audit and Tasks; nothing is
            fabricated to fill the gap.
          </p>
        )}
      </div>

      <div className="mkt-guard" data-band={band}>
        <div className="mkt-guard-top">
          <span className="mkt-guard-pct">{pct}%</span>
          <span className="mkt-guard-label">
            of active effort is the venue engine
          </span>
        </div>
        <div className="mkt-guard-track" aria-hidden="true">
          <span className="mkt-guard-fill" style={{ width: `${pct}%` }} />
          <span className="mkt-guard-trigger" />
        </div>
        <p className="mkt-guard-caption">
          {band === "breach"
            ? "Concentration kill-trigger breached: over 75% on one buyer. The search & comparison leg is the hedge, move effort there."
            : band === "watch"
              ? "Approaching the 75% single-buyer kill-trigger. Watch the mix."
              : "Within the concentration limit. The engine is the engine; the 75% line is the kill-trigger."}{" "}
          {active.length} active approaches · {venueActive.length} on the
          engine.
        </p>
      </div>

      {venueBucket && (
        <ol className="mkt-list">
          {venueBucket.approaches.map((a) => (
            <li className="mkt-row" key={a.id}>
              <span className="mkt-rank" aria-hidden="true">
                {String(a.rank).padStart(2, "0")}
              </span>
              <div className="mkt-body">
                <h3 className="mkt-title">{a.title}</h3>
                <p className="mkt-what">{a.what}</p>
                <div className="mkt-row-controls">
                  <StatusSelect
                    id={a.id}
                    value={statusOf(a.id)}
                    onChange={(s) => setStatus(a.id, s)}
                  />
                </div>
              </div>
              <div className="mkt-meta">
                <span className="mkt-tag" data-impact={a.impact}>
                  {a.impact}
                </span>
                <span className="mkt-attr">{a.effort} effort</span>
                <span className="mkt-attr">{a.month}</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function FunnelStat({ n, label }: { n: number; label: string }) {
  return (
    <div className="mkt-stat">
      <span className="mkt-stat-n">{n}</span>
      <span className="mkt-stat-label">{label}</span>
    </div>
  );
}

/* ── ledger ──────────────────────────────────────────────────────────── */

function LedgerView({
  flat,
  statusOf,
  noteOf,
}: {
  flat: Flat[];
  statusOf: (id: string) => ApproachStatus;
  noteOf: (id: string) => string;
}) {
  const closed = flat.filter((a) => CLOSED.includes(statusOf(a.id)));

  if (closed.length === 0) {
    return (
      <p className="mkt-empty">
        Nothing closed yet. The ledger fills as approaches ship, park, or get
        killed, and it keeps the reason. An approach with no outcome is just
        an opinion.
      </p>
    );
  }

  return (
    <ol className="mkt-list">
      {closed.map((a) => (
        <li className="mkt-row" key={a.id}>
          <span className="mkt-rank" aria-hidden="true">
            {a.id}
          </span>
          <div className="mkt-body">
            <h3 className="mkt-title">{a.title}</h3>
            <p className="mkt-what">{a.what}</p>
            {noteOf(a.id) ? (
              <p className="mkt-ledger-note">{noteOf(a.id)}</p>
            ) : (
              <p className="mkt-ledger-empty">
                Closed without a recorded outcome, the reason is missing.
              </p>
            )}
          </div>
          <div className="mkt-meta">
            <span className="mkt-dot" data-status={statusOf(a.id)}>
              {STATUS_LABEL[statusOf(a.id)]}
            </span>
            <span className="mkt-attr">{a.bucketLabel}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
