/**
 * Products grid — the two tools Studio makes.
 *
 * Each card carries the product's own wordmark treatment:
 * - Tasks: lowercase "tasks" + the pulsing brand-indigo dot
 * - Roadmap: titlecase "Roadmap" + the hairline/dot-slide SVG
 *
 * No heavy shadows, no hover-glow theatrics. The cards lift 2px.
 * The "Open →" arrow is the only CTA.
 */

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

/* ── Roadmap wordmark (hairline + dot-at-rest) ─────────────── */
function RoadmapWordmark() {
  // Static version of the Roadmap slide-dot — dot rests at 70%.
  // No motion dependency; Studio keeps things lean.
  const lineW = 28;
  const dotR = 2.5;
  const svgW = lineW + dotR * 2;
  const svgH = dotR * 2 + 2;
  const midY = svgH / 2;
  const restX = dotR + lineW * 0.7;

  return (
    <span
      className="inline-flex items-baseline gap-[0.45em] font-semibold"
      style={{ fontSize: "1.125rem" }}
    >
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        aria-hidden
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          transform: "translateY(-1px)",
        }}
      >
        <line
          x1={dotR}
          x2={lineW + dotR}
          y1={midY}
          y2={midY}
          stroke="var(--ink-quiet)"
          strokeWidth={1}
          strokeLinecap="round"
        />
        <circle
          cx={restX}
          cy={midY}
          r={dotR}
          fill="#4f46e5"
        />
      </svg>
      <span
        style={{
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--ink-900)",
        }}
      >
        Roadmap
      </span>
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
  wordmark: React.ReactNode;
  description: string;
  pills: [string, string];
  href: string;
}

function ProductCard({ wordmark, description, pills, href }: ProductCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="lift group flex flex-col justify-between rounded-2xl border border-border bg-bg-elev p-7 no-underline"
      style={{ boxShadow: "var(--shadow-1)" }}
    >
      {/* Top */}
      <div>
        <div>{wordmark}</div>
        <p
          className="mt-4 leading-[1.55] text-ink-soft"
          style={{ fontSize: "0.9375rem" }}
        >
          {description}
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
    </a>
  );
}

/* ── Grid ──────────────────────────────────────────────────── */
export function ProductsGrid() {
  return (
    <section className="mx-auto w-full max-w-[760px] px-6 pb-24">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProductCard
          wordmark={<TasksWordmark />}
          description="Project management for the 80% who don't work in tech."
          pills={["Multi-view", "Real-time"]}
          href="https://tasks-nu-hazel.vercel.app"
        />
        <ProductCard
          wordmark={<RoadmapWordmark />}
          description="Public product roadmaps written in plain English."
          pills={["Multi-tenant", "No jargon"]}
          href="https://roadmap-ebon-eight.vercel.app"
        />
      </div>
    </section>
  );
}
