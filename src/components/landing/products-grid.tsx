/**
 * Products grid — the three tools Studio makes.
 *
 * Each card carries the product's own wordmark treatment, all
 * inside one shared grammar: lowercase word + indigo dot.
 * - Tasks:     pulsing dot (live signal)
 * - Roadmap:   static dot here; slide-on-mount on its own site
 * - Analytics: static dot (ambient briefing)
 *
 * No heavy shadows, no hover-glow theatrics. The cards lift 2px.
 * The "Open →" arrow is the only CTA.
 */

import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL, NOTES_URL } from "@/lib/product-urls";

/* ── Tasks wordmark (adapated inline, no import needed) ───── */
function TasksWordmark() {
  return (
    <span
      className="inline-flex items-baseline font-semibold"
      style={{ letterSpacing: "-0.05em", fontSize: "1.125rem" }}
    >
      <span
        style={{
          fontWeight: 600,
          color: "var(--ink-900)",
        }}
      >
        tasks
      </span>
      {/* Pulsing dot — Tasks' heartbeat signature */}
      <span className="tasks-dot" aria-hidden />
    </span>
  );
}

/* ── Roadmap wordmark (lowercase + dot, suite family) ──────── */
function RoadmapWordmark() {
  // Matches the live Roadmap mark — lowercase + indigo dot.
  // Static here in Studio's directory context (no slide-on-mount).
  return (
    <span
      className="inline-flex items-baseline font-semibold"
      style={{ letterSpacing: "-0.05em", fontSize: "1.125rem" }}
    >
      <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>
        roadmap
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "5px",
          height: "5px",
          borderRadius: "999px",
          background: "var(--indigo-600)",
          marginLeft: "0.18em",
          transform: "translateY(-1px)",
        }}
      />
    </span>
  );
}

/* ── Notes wordmark (underline-writes-itself, planned product) ──────────── */
function NotesWordmark() {
  return (
    <span
      className="inline-flex items-baseline font-semibold"
      style={{ letterSpacing: "-0.04em", fontSize: "1.125rem" }}
    >
      <span className="notes-mark" style={{ fontWeight: 600, color: "var(--ink-900)" }}>
        notes
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "5px",
          height: "5px",
          borderRadius: "999px",
          background: "var(--indigo-600)",
          marginLeft: "0.18em",
          transform: "translateY(-1px)",
        }}
      />
    </span>
  );
}

/* ── Analytics wordmark (static dot, no pulse) ─────────────── */
function AnalyticsWordmark() {
  return (
    <span
      className="inline-flex items-baseline font-semibold"
      style={{ letterSpacing: "-0.03em", fontSize: "1.125rem" }}
    >
      <span style={{ fontWeight: 600, color: "var(--ink-900)" }}>
        analytics
      </span>
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "5px",
          height: "5px",
          borderRadius: "999px",
          background: "var(--indigo-600)",
          marginLeft: "0.18em",
          transform: "translateY(-1px)",
        }}
      />
    </span>
  );
}

/* ── Stat/feature pill ─────────────────────────────────────── */
function Pill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-border-soft px-3 py-1 text-[11.5px] font-medium tracking-[0.02em] text-ink-quiet"
      style={{ background: "var(--bg-deep)" }}
    >
      {label}
    </span>
  );
}

/* ── Product card ──────────────────────────────────────────── */
interface ProductCardProps {
  label: string;
  wordmark: React.ReactNode;
  proof: React.ReactNode;
  description: string;
  positioning: string;
  pills: [string, string];
  href: string;
}

function ProductCard({ label, wordmark, proof, description, positioning, pills, href }: ProductCardProps) {
  const cardClass =
    "product-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-bg-elev no-underline";
  const cardStyle = { boxShadow: "var(--shadow-1)" };
  const inner = (
    <>
      {/* Proof sliver — the product's signature artifact, in miniature */}
      <div
        className="border-b border-border-soft"
        style={{
          background:
            "linear-gradient(180deg, var(--bg-deep) 0%, color-mix(in srgb, var(--bg-deep) 60%, var(--bg-elev)) 100%)",
          padding: "20px 22px",
          minHeight: 124,
          display: "flex",
          alignItems: "center",
        }}
      >
        {proof}
      </div>

      {/* Textual stack */}
      <div className="flex flex-1 flex-col justify-between p-7">
        <div>
          <div
            className="mb-3 text-[10.5px] font-semibold uppercase text-ink-faint"
            style={{ letterSpacing: "var(--tracking-eyebrow)" }}
          >
            {label}
          </div>
          <div>{wordmark}</div>
          <p
            className="mt-4 leading-[1.55] text-ink-soft"
            style={{ fontSize: "0.9375rem" }}
          >
            {description}
          </p>
          <p
            className="mt-2 leading-[1.5] text-ink-quiet"
            style={{ fontSize: "0.8125rem" }}
          >
            {positioning}
          </p>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex items-end justify-between">
          <div className="flex flex-wrap gap-2">
            <Pill label={pills[0]} />
            <Pill label={pills[1]} />
          </div>
          <span
            className="flex-shrink-0 text-[13.5px] font-medium text-ink-quiet transition-colors group-hover:text-ink"
            style={{ letterSpacing: "0.01em" }}
          >
            Open&nbsp;&rarr;
          </span>
        </div>
      </div>
    </>
  );

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass} style={cardStyle}>
      {inner}
    </a>
  );
}

/* ── Proof slivers — one per product ───────────────────────── */

/** Tasks: three mini-lane stack with a single card in each. */
function TasksProof() {
  const lanes: Array<{ name: string; cardTitle: string; tint: string }> = [
    { name: "To do",       cardTitle: "Sprint planning",        tint: "var(--lane-todo)" },
    { name: "In progress", cardTitle: "Audit conversion funnel", tint: "var(--lane-doing)" },
    { name: "Done",        cardTitle: "Launch demo cut",         tint: "var(--lane-done)" },
  ];
  return (
    <div className="grid w-full grid-cols-3 gap-2">
      {lanes.map((l) => (
        <div
          key={l.name}
          className="rounded-md border border-border-soft p-1.5"
          style={{ background: l.tint }}
        >
          <div
            className="mb-1 text-[8px] font-semibold uppercase text-ink-quiet"
            style={{ letterSpacing: "0.08em" }}
          >
            {l.name}
          </div>
          <div
            className="rounded-sm px-1.5 py-1 text-[9.5px] leading-tight text-ink"
            style={{
              background: "#fefdf9",
              boxShadow: "0 1px 2px rgba(24,24,27,.06)",
            }}
          >
            {l.cardTitle}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Roadmap: two lined-up roadmap items with status pills. */
function RoadmapProof() {
  const items: Array<{ title: string; status: string; statusBg: string; statusFg: string }> = [
    {
      title:    "Public roadmap URL",
      status:   "DONE",
      statusBg: "var(--status-shipped-bg)",
      statusFg: "var(--status-shipped)",
    },
    {
      title:    "Auth-gated comments",
      status:   "DOING",
      statusBg: "var(--status-flight-bg)",
      statusFg: "var(--status-flight)",
    },
  ];
  return (
    <div className="flex w-full flex-col gap-1.5">
      {items.map((i) => (
        <div
          key={i.title}
          className="flex items-center justify-between rounded-md border border-border-soft px-2.5 py-1.5"
          style={{ background: "#fefdf9" }}
        >
          <span className="text-[10.5px] text-ink">{i.title}</span>
          <span
            className="rounded px-1.5 py-px text-[8.5px] font-semibold tracking-[0.08em]"
            style={{ background: i.statusBg, color: i.statusFg }}
          >
            {i.status}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Analytics: a one-bucket briefing fragment. */
function AnalyticsProof() {
  return (
    <div className="w-full">
      <p
        className="text-[8.5px] font-semibold uppercase text-ink-quiet"
        style={{
          letterSpacing: "0.14em",
          fontFamily: "var(--font-mono-stack)",
          marginBottom: 6,
        }}
      >
        Daily Signal · 09:14
      </p>
      <p className="text-[12px] font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>
        Good morning.
      </p>
      <p
        className="mt-2 flex items-center gap-1.5 text-[8.5px] font-semibold uppercase text-ink-quiet"
        style={{ letterSpacing: "0.12em", fontFamily: "var(--font-mono-stack)" }}
      >
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 5,
            height: 5,
            borderRadius: 999,
            background: "var(--status-flight)",
          }}
        />
        Needs attention
      </p>
      <p className="mt-1 text-[10.5px] leading-snug text-ink-soft">
        Website launch is blocked by missing assets
      </p>
    </div>
  );
}

/** Notes: a stack of mock note tabs with one indigo highlight. */
function NotesProof() {
  const notes = [
    { title: "Florist quote — Bloom", tint: "var(--bg-elev)", active: false },
    { title: "Venue walkthrough notes", tint: "var(--bg-elev)", active: true },
    { title: "Save-the-date copy", tint: "var(--bg-elev)", active: false },
  ];
  return (
    <div className="flex w-full flex-col gap-1">
      {notes.map((n) => (
        <div
          key={n.title}
          className="rounded-md border px-2 py-1.5 text-[10px]"
          style={{
            background: n.tint,
            borderColor: n.active
              ? "color-mix(in srgb, var(--indigo-600) 28%, var(--border-soft))"
              : "var(--border-soft)",
            color: n.active ? "var(--ink)" : "var(--ink-quiet)",
            boxShadow: n.active ? "0 1px 2px rgba(79,70,229,.08)" : "none",
          }}
        >
          {n.title}
        </div>
      ))}
    </div>
  );
}

/* ── Grid ──────────────────────────────────────────────────── */
export function ProductsGrid() {
  return (
    <section id="products" className="mx-auto w-full max-w-[1040px] px-6 pb-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProductCard
          label="Signal Tasks"
          wordmark={<TasksWordmark />}
          proof={<TasksProof />}
          description="Execution clarity. A workspace that keeps the right work in view."
          positioning="Run projects without the project-manager energy."
          pills={["Multi-view", "Real-time"]}
          href={TASKS_URL}
        />
        <ProductCard
          label="Signal Roadmap"
          wordmark={<RoadmapWordmark />}
          proof={<RoadmapProof />}
          description="Direction clarity. Public product roadmaps written in plain English."
          positioning="Show your work, not your Jira."
          pills={["Multi-tenant", "No jargon"]}
          href={ROADMAP_URL}
        />
        <ProductCard
          label="Signal Analytics"
          wordmark={<AnalyticsWordmark />}
          proof={<AnalyticsProof />}
          description="Attention clarity. Know what needs your attention before you ask."
          positioning="A briefing, not a dashboard."
          pills={["Daily Signal", "Briefing format"]}
          href={ANALYTICS_URL}
        />
        <ProductCard
          label="Signal Notes"
          wordmark={<NotesWordmark />}
          proof={<NotesProof />}
          description="Capture clarity. The notebook that finds what you wrote down."
          positioning="Fast capture. Quiet recall."
          pills={["Private build", "Flat search"]}
          href={NOTES_URL}
        />
      </div>
    </section>
  );
}
