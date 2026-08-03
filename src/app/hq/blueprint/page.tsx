import type { Metadata } from "next";
import Link from "next/link";
import { BlueprintCanvas } from "@/components/hq/blueprint-canvas";
import { CountUp } from "@/components/hq/count-up";
import {
  ABSORBED_BY_SYSTEM,
  BLUEPRINT_META,
  BLUEPRINT_SECTIONS,
  CUSTOMER_SEGMENTS,
  DIRECTOR_REVIEW_CYCLES,
  GROWTH_MACHINE,
  NORTH_STAR,
  OPERATING_CADENCE,
  OPERATING_FUNCTIONS,
  PRODUCT_FLOW,
  PRODUCTS,
  RISK_LOG,
  resolveBlueprintMetrics,
  resolveCrmStageCoverage,
  VEF_STAGE_MAP,
} from "@/lib/hq/blueprint";
import { CLUSTERS, directorsByCluster, formatCadence } from "@/lib/hq/elt";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getTraction } from "@/lib/hq/traction";
import { getProspects } from "@/lib/hq/crm-db";
import { normalizeSegment, PIPELINE_STAGES, STAGE_COLORS } from "@/lib/hq/crm-utils";
import { getProductAnalytics } from "@/lib/hq/product-analytics";
import { getModeledRunway } from "@/lib/hq/financial-model";
import {
  daysBetween,
  getVefRegisters,
  getVefState,
  isoDate,
  type VefGateStatus,
  type VefSnapshot,
} from "@/lib/hq/vef-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "blueprint, signal hq",
  description: "Founder Operating System, the zoomable map of how Signal Studio works.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

/**
 * /hq/blueprint, the Founder Operating System Blueprint.
 *
 * A single zoomable operating map that explains how Signal Studio works,
 * grows, ships, thinks, and stays focused. Content is curated in
 * `src/lib/hq/blueprint.ts`; the AI Director Layer reads the live org from
 * `src/lib/hq/elt.ts`. This page is a *map*, not a system of record, the
 * deep surfaces (CRM, reporting, atlas, org) live at their own routes and
 * are linked from here.
 *
 * Register: a self-contained dark "command-center" theme scoped to
 * `.blueprint-os` (see globals.css). It deliberately inverts the light
 * Signal Studio paper register into ink while keeping the brand grammar —
 * indigo accent, the dot, hairlines, mono eyebrows. Nothing here leaks
 * into the rest of light HQ.
 */
export default async function BlueprintPage() {
  await requireHqAccess();

  const directorClusters = CLUSTERS.filter((c) => c.id !== "apex").map((c) => ({
    cluster: c,
    members: directorsByCluster(c.id),
  }));
  const directorCount = directorClusters.reduce((n, c) => n + c.members.length, 0);

  // ── Live metrics ──────────────────────────────────────────────────────
  // Read the Studio ledger (traction) + CRM (prospects) and overlay the four
  // wired figures onto the metric catalog. Prospects fall back to seed when
  // the table is absent, so venue pipeline is always readable; traction goes
  // `null` (→ honest placeholder) when Studio Turso is unreachable.
  const [traction, prospects, product, vef, registers] = await Promise.all([
    getTraction(),
    getProspects(),
    getProductAnalytics(),
    getVefState(),
    getVefRegisters(),
  ]);
  const venuePipeline = prospects.filter(
    (p) =>
      normalizeSegment(p.segment) === "venue" &&
      PIPELINE_STAGES.includes(p.stage),
  ).length;

  // ── VEF-2026 register ────────────────────────────────────────────────
  // Read-only. This page never writes PROJECT_STATE.json; project state is
  // written by tools/project-control.mjs and by nothing else.
  const today = isoDate(new Date());
  const vefState = vef.read === "ok" ? vef.state : null;
  const daysToRelease = vefState
    ? daysBetween(today, vefState.releaseDate)
    : null;

  const metrics = resolveBlueprintMetrics({
    mrrEur: traction.available ? traction.workspaceSubs * 12 : null,
    activeGrants: traction.available ? traction.activeEntitlements : null,
    venuePipeline,
    studentSignups: traction.available ? traction.studentSignups : null,
    activationPct: product.activationPct,
    retentionPct: product.retentionPct,
    churnPct: product.churnPct,
    onboardingPct: product.onboardingPct,
    modulesActive: product.modulesActive,
    runway: getModeledRunway(traction.available ? traction.cashCollectedEur : null),
    paidVenuesLedger: traction.available ? traction.paidVenues : null,
    vef: vefState
      ? {
          daysToRelease,
          gatesPassed: vefState.gatesPassed,
          gatesTotal: vefState.gatesTotal,
          completionPct: vefState.completion?.value ?? null,
          completionNumerator: vefState.completion?.numerator ?? null,
          completionDenominator: vefState.completion?.denominator ?? null,
          completionBasis: vefState.completion?.basis ?? "unstated",
          completionProvisional: vefState.completion?.provisional ?? false,
          paidTracker:
            vefState.founding25.ladder.find((s) => s.key === "paidAgreements")
              ?.count ?? null,
          foundingTarget: vefState.founding25.target,
        }
      : null,
  });
  const liveCount = metrics.filter((m) => m.live).length;
  const tractionUnread = !traction.available;
  // Product-analytics read health, for an honest line under the metrics.
  const productOk = Object.values(product.reads).filter((r) => r === "ok").length;
  const productUnread = productOk === 0;

  // The CRM's reach against the twelve ratified stages, derived from the
  // shipped PIPELINE_STAGES rather than hard-coded, so it self-corrects.
  const crmCoverage = resolveCrmStageCoverage(PIPELINE_STAGES);
  // The won colour, read straight from the shipped CRM palette. #d1fae5 is
  // the register the brand reserves for shipped, and pilot_active wears it.
  const pilotActiveColor = STAGE_COLORS.pilot_active.bg;

  return (
    <div className="blueprint-os">
      <BlueprintCanvas sections={BLUEPRINT_SECTIONS}>
        {/* ── Masthead ──────────────────────────────────────────────── */}
        <header className="bp-masthead">
          <div className="bp-masthead-eyebrow">
            <span className="bp-pip" aria-hidden="true" />
            Signal HQ · operating map
          </div>
          <h1 className="bp-masthead-title">
            {BLUEPRINT_META.title}
            <span className="bp-dot" aria-hidden="true">.</span>
          </h1>
          <p className="bp-masthead-sub">{BLUEPRINT_META.subtitle}</p>
          <dl className="bp-masthead-meta">
            <div>
              <dt>hard launch</dt>
              <dd>{BLUEPRINT_META.hardLaunch}</dd>
            </div>
            <div>
              <dt>initial wedge</dt>
              <dd>{BLUEPRINT_META.initialWedge}</dd>
            </div>
            <div>
              <dt>then</dt>
              <dd>{BLUEPRINT_META.secondaryWedge}</dd>
            </div>
            <div>
              <dt>expansion</dt>
              <dd>{BLUEPRINT_META.expansion}</dd>
            </div>
          </dl>
          <p className="bp-hint">
            Scroll the map, or use the legend to jump. <kbd>⌘</kbd>/<kbd>ctrl</kbd> + scroll to zoom · <kbd>+</kbd> <kbd>−</kbd> <kbd>0</kbd>
          </p>
        </header>

        {/* ── 1 · NORTH STAR ────────────────────────────────────────── */}
        <Section id="north-star" index={1} label="North Star" title="Why we exist">
          <div className="bp-northstar">
            <div className="bp-card bp-card--feature">
              <span className="bp-kicker">mission</span>
              <p className="bp-lead">{NORTH_STAR.mission}</p>
              <div className="bp-positioning">
                {NORTH_STAR.positioning.map((line) => (
                  <span key={line} className="bp-chip">{line}</span>
                ))}
              </div>
            </div>
            <div className="bp-card">
              <span className="bp-kicker">brand philosophy</span>
              <p className="bp-body">{NORTH_STAR.brandPhilosophy}</p>
            </div>
          </div>

          <div className="bp-subhead">Core principles</div>
          <div className="bp-grid bp-grid--3">
            {NORTH_STAR.principles.map((p) => (
              <div key={p.title} className="bp-card bp-card--tight">
                <h4 className="bp-card-title">{p.title}</h4>
                <p className="bp-body">{p.body}</p>
              </div>
            ))}
          </div>

          <div className="bp-subhead">The flywheel</div>
          <ol className="bp-flywheel">
            {NORTH_STAR.flywheel.map((s, i) => (
              <li key={s.step} className="bp-flywheel-step">
                <span className="bp-flywheel-num">{i + 1}</span>
                <span className="bp-flywheel-name">{s.step}</span>
                <span className="bp-flywheel-detail">{s.detail}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── 2 · PRODUCT SYSTEM ────────────────────────────────────── */}
        <Section id="product-system" index={2} label="Product System" title="How the product works">
          <ol className="bp-flow" aria-label="Product workflow">
            {PRODUCT_FLOW.map((node, i) => (
              <li key={node} className="bp-flow-node" data-terminal={i >= 4 ? "true" : undefined}>
                <span>{node}</span>
                {i < PRODUCT_FLOW.length - 1 ? <span className="bp-flow-arrow" aria-hidden="true">→</span> : null}
              </li>
            ))}
          </ol>

          <div className="bp-grid bp-grid--2">
            {PRODUCTS.map((p) => (
              <article key={p.key} className="bp-card bp-product">
                <header className="bp-product-head">
                  <h4 className="bp-card-title">
                    <a href={p.href} target="_blank" rel="noreferrer">{p.name}</a>
                  </h4>
                  <span className="bp-product-role">{p.role}</span>
                </header>
                <p className="bp-body">{p.purpose}</p>
                <dl className="bp-io">
                  <Field label="inputs" items={p.inputs} />
                  <Field label="outputs" items={p.outputs} />
                  <Field label="key actions" items={p.keyActions} />
                  <Field label="success metrics" items={p.successMetrics} />
                </dl>
                <p className="bp-never"><span>never becomes</span> {p.neverBecome}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ── 3 · CUSTOMERS ─────────────────────────────────────────── */}
        <Section id="customers" index={3} label="Customers" title="Who it's for">
          <div className="bp-grid bp-grid--2">
            {CUSTOMER_SEGMENTS.map((c) => (
              <article key={c.key} className="bp-card bp-segment" data-primary={c.primary ? "true" : undefined}>
                <header className="bp-segment-head">
                  <h4 className="bp-card-title">{c.name}</h4>
                  {c.primary ? <span className="bp-badge">the wedge</span> : null}
                </header>
                <Field label="pain points" items={c.painPoints} />
                <div className="bp-workflow">
                  {c.workflow.map((w, i) => (
                    <span key={w} className="bp-workflow-step">
                      {w}{i < c.workflow.length - 1 ? <span aria-hidden="true"> → </span> : null}
                    </span>
                  ))}
                </div>
                <Field label="templates" items={c.templates} chips />
                <div className="bp-moment">
                  <p><span>activation</span> {c.activationMoment}</p>
                  <p><span>retention</span> {c.retentionDriver}</p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* ── 4 · GROWTH MACHINE ────────────────────────────────────── */}
        <Section id="growth" index={4} label="Growth Machine" title="How it grows">
          <div className="bp-growth">
            {GROWTH_MACHINE.map((g) => (
              <article key={g.title} className="bp-card bp-growth-node" data-status={g.status}>
                <div className="bp-growth-top">
                  <span className="bp-phase">{g.phase}</span>
                  <span className="bp-status" data-status={g.status}>{g.status}</span>
                </div>
                <h4 className="bp-card-title">{g.title}</h4>
                <p className="bp-body">{g.detail}</p>
                <p className="bp-metric-line">{g.metric}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ── 5 · SIGNAL HQ FUNCTIONS ───────────────────────────────── */}
        <Section id="functions" index={5} label="Signal HQ" title="How it operates">
          <div className="bp-grid bp-grid--2">
            {OPERATING_FUNCTIONS.map((f) => (
              <article key={f.key} className="bp-card bp-function">
                <header className="bp-function-head">
                  <h4 className="bp-card-title">{f.name}</h4>
                  <span className="bp-function-owner">{f.owner}</span>
                </header>
                <p className="bp-function-director">{f.director}</p>
                <Field label="tools" items={f.tools} chips />
                <div className="bp-function-rows">
                  <Row label="cadence" value={f.cadence} />
                </div>
                <Field label="key outputs" items={f.outputs} />
                <Field label="key metrics" items={f.metrics} />
                <p className="bp-risk-line"><span>risk</span> {f.risk}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* ── 6 · AI DIRECTOR LAYER (live org) ──────────────────────── */}
        <Section id="directors" index={6} label="AI Directors" title="How it decides">
          <p className="bp-section-note">
            {directorCount} Directors and one Founder run the company as a standing org.
            This is the live chart, open any director at{" "}
            <Link href="/hq/org" className="bp-inline-link">/hq/org</Link>.
          </p>
          <div className="bp-directors">
            {directorClusters.map(({ cluster, members }) => (
              <div key={cluster.id} className="bp-director-cluster">
                <div className="bp-director-cluster-head">
                  <h4 className="bp-card-title">{cluster.label}</h4>
                  <span className="bp-director-count">{members.length}</span>
                </div>
                <p className="bp-director-cluster-sub">{cluster.subtitle}</p>
                <ul className="bp-director-chips">
                  {members.map((d) => (
                    <li key={d.id}>
                      <Link href={`/hq/org/${d.id}`} className="bp-director-chip" title={d.oneLine}>
                        <span className="bp-director-name">{d.shortName}</span>
                        {d.product ? <span className="bp-director-product">{d.product}</span> : null}
                        <span className="bp-director-cadence">{formatCadence(d.cadence)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bp-subhead">Review cycles</div>
          <div className="bp-grid bp-grid--2">
            {DIRECTOR_REVIEW_CYCLES.map((r) => (
              <div key={r.cycle} className="bp-card bp-card--tight">
                <h4 className="bp-card-title">{r.cycle}</h4>
                <p className="bp-body">{r.question}</p>
                <div className="bp-seats">
                  {r.seats.map((s) => <span key={s} className="bp-chip bp-chip--sm">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 7 · AUTOMATION ────────────────────────────────────────── */}
        <Section id="automation" index={7} label="Automation" title="Absorbed by the system">
          <p className="bp-section-note">
            What the system carries so the founder doesn’t. Each item is automated,
            AI-assisted, or held behind a human gate by design.
          </p>
          <div className="bp-grid bp-grid--2">
            {ABSORBED_BY_SYSTEM.map((a) => (
              <div key={a.area} className="bp-card bp-card--tight bp-absorbed" data-mode={a.mode}>
                <div className="bp-absorbed-head">
                  <h4 className="bp-card-title">{a.area}</h4>
                  <span className="bp-mode" data-mode={a.mode}>{a.mode.replace("-", " ")}</span>
                </div>
                <p className="bp-body">{a.what}</p>
                <p className="bp-absorbed-surface">{a.surface}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 8 · METRICS ───────────────────────────────────────────── */}
        <Section id="metrics" index={8} label="Metrics" title="How we measure">
          <p className="bp-section-note">
            Only the numbers that matter. {liveCount} of {metrics.length}{" "}
            are live, from the Studio ledger, the CRM, the four product
            apps&rsquo; analytics and the VEF-2026 register
            {tractionUnread ? "; ledger unread this load" : ""}
            {productUnread ? "; product analytics unread this load" : ""}. Support
            sentiment and runway stay placeholders (no DB source). See{" "}
            <span className="bp-mono">resolveBlueprintMetrics</span> in{" "}
            <span className="bp-mono">blueprint.ts</span>.
          </p>
          <div className="bp-metrics">
            {metrics.map((m) => (
              <div key={m.key} className="bp-metric" data-tone={m.tone} data-live={m.live ? "true" : undefined}>
                <span className="bp-metric-value">
                  <CountUp value={m.display} />
                  {m.live ? <span className="bp-metric-live" title="live from source" aria-label="live" /> : null}
                </span>
                <span className="bp-metric-label">{m.label}</span>
                <span className="bp-metric-target">target · {m.target}</span>
                <span className="bp-metric-source">{m.liveNote ?? m.source}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 9 · VENUE EDITION (VEF-2026 register) ─────────────────── */}
        <Section
          id="venue-edition"
          index={9}
          label="Venue Edition"
          title="The wedge, to the release"
        >
          {vefState == null ? (
            <div className="bp-card bp-log" data-tone="critical">
              <h4 className="bp-card-title bp-log-title">
                VEF register could not be read
              </h4>
              <p className="bp-body">{vef.note}</p>
              <p className="bp-absorbed-surface">
                Read state · <span className="bp-mono">{vef.read}</span>
                {vef.origin ? ` · ${vef.origin.path}` : ""}
              </p>
              <p className="bp-never">
                <span>not shown as zero</span> No programme number is rendered
                on this load. A 0 would be a claim that nothing has happened.
                This says only that the register was not readable.
              </p>
            </div>
          ) : (
            <VenueEditionPanels
              state={vefState}
              today={today}
              daysToRelease={daysToRelease}
              originPath={vef.origin?.path ?? null}
              paidLedger={traction.available ? traction.paidVenues : null}
              signedUnpaidLedger={
                traction.available ? traction.signedUnpaidVenues : null
              }
              pilotLedger={traction.available ? traction.pilotVenues : null}
              crmCoverage={crmCoverage}
              crmVenueFunnel={venuePipeline}
              pilotActiveColor={pilotActiveColor}
              registers={registers}
            />
          )}
        </Section>

        {/* ── 10 · RISK & DECISION LOG ──────────────────────────────── */}
        <Section id="risk" index={10} label="Risk & Decisions" title="How we stay honest">
          <div className="bp-grid bp-grid--2">
            <LogCard title="Current risks" tone="critical" items={RISK_LOG.currentRisks} />
            <LogCard title="Open decisions" tone="warn" items={RISK_LOG.openDecisions} />
            <LogCard title="Decisions made" tone="done" items={RISK_LOG.decisionsMade} />
            <LogCard title="Launch blockers" tone="critical" items={RISK_LOG.launchBlockers} />
          </div>
          <div className="bp-subhead">Dependencies</div>
          <div className="bp-grid bp-grid--3">
            {RISK_LOG.dependencies.map((d) => (
              <div key={d.label} className="bp-card bp-card--tight bp-dependency">
                <h4 className="bp-card-title">{d.label}</h4>
                <p className="bp-body">{d.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 11 · OPERATING CADENCE ────────────────────────────────── */}
        <Section id="cadence" index={11} label="Cadence" title="How we stay in rhythm">
          <div className="bp-cadence">
            {OPERATING_CADENCE.map((b) => (
              <article key={b.name} className="bp-card bp-cadence-beat">
                <span className="bp-rhythm">{b.rhythm}</span>
                <h4 className="bp-card-title">{b.name}</h4>
                <p className="bp-cadence-q">{b.question}</p>
                <p className="bp-cadence-meta">
                  <span>{b.owner}</span>
                  <span className="bp-cadence-out">{b.output}</span>
                </p>
              </article>
            ))}
          </div>

          <footer className="bp-footer">
            <span>Revised {BLUEPRINT_META.revisedOn}</span>
            <span className="bp-footer-dot" aria-hidden="true">·</span>
            <span>Source · <span className="bp-mono">src/lib/hq/blueprint.ts</span></span>
            <span className="bp-footer-dot" aria-hidden="true">·</span>
            <Link href="/hq" className="bp-inline-link">← signal hq</Link>
          </footer>
        </Section>
      </BlueprintCanvas>
    </div>
  );
}

/* ── Venue Edition (VEF-2026) ─────────────────────────────────────────── */

/**
 * Gate status → the three visual registers the blueprint theme already has.
 *
 * Only `passed` gets the green. A waiver is a founder decision to ship
 * without the evidence, and painting it the same colour as passed is the
 * same defect as the CRM painting `pilot_active` green: it launders a
 * decision into an achievement.
 */
function gateTone(status: VefGateStatus): "live" | "building" | "queued" {
  if (status === "passed") return "live";
  if (status === "in_progress" || status === "ready_for_review") return "building";
  return "queued";
}

function VenueEditionPanels({
  state,
  today,
  daysToRelease,
  originPath,
  paidLedger,
  signedUnpaidLedger,
  pilotLedger,
  crmCoverage,
  crmVenueFunnel,
  pilotActiveColor,
  registers,
}: {
  state: VefSnapshot;
  today: string;
  daysToRelease: number | null;
  originPath: string | null;
  paidLedger: number | null;
  signedUnpaidLedger: number | null;
  pilotLedger: number | null;
  crmCoverage: ReturnType<typeof resolveCrmStageCoverage>;
  crmVenueFunnel: number;
  pilotActiveColor: string;
  registers: Awaited<ReturnType<typeof getVefRegisters>>;
}) {
  const paidTracker =
    state.founding25.ladder.find((s) => s.key === "paidAgreements")?.count ??
    null;
  const ledgerDisagrees =
    paidLedger != null && paidTracker != null && paidLedger !== paidTracker;

  return (
    <>
      <p className="bp-section-note">
        Read from the VEF-2026 register, <span className="bp-mono">PROJECT_STATE.json</span>,
        which <span className="bp-mono">tools/project-control.mjs</span> writes and
        this page only reads. Register schema{" "}
        <span className="bp-mono">{state.schemaVersion}</span> · last written{" "}
        {state.lastUpdatedAt?.slice(0, 10) ?? "unknown"} · last validated{" "}
        {state.lastValidatedAt?.slice(0, 10) ?? "never"}
        {originPath ? (
          <>
            {" "}
            · <span className="bp-mono">{originPath.replace(/\\/g, "/")}</span>
          </>
        ) : null}
      </p>

      {/* The condition the whole programme closes on, and the health call. */}
      <div className="bp-northstar">
        <div className="bp-card bp-card--feature">
          <span className="bp-kicker">completion condition</span>
          <p className="bp-lead">{state.completionCondition}</p>
          <div className="bp-positioning">
            <span className="bp-chip">{state.founding25.geography}</span>
            <span className="bp-chip">
              {daysToRelease == null
                ? "release date unreadable"
                : daysToRelease >= 0
                  ? `${daysToRelease} days to ${state.releaseDate}`
                  : `${Math.abs(daysToRelease)} days past ${state.releaseDate}`}
            </span>
            <span className="bp-chip">baseline · {state.baselineState}</span>
          </div>
        </div>
        <div className="bp-card">
          <span className="bp-kicker">
            health · {state.health?.rag ?? "unstated"}
          </span>
          <p className="bp-body">
            {state.health?.reason ?? "No reason recorded on the health rating."}
          </p>
          <p className="bp-absorbed-surface">{state.currentPhase}</p>
        </div>
      </div>

      {/* ── Release gates ─────────────────────────────────────────────── */}
      <div className="bp-subhead">
        Release gates · {state.gatesPassed} of {state.gatesTotal} passed
      </div>
      <div className="bp-grid bp-grid--3">
        {state.gates.map((g) => (
          <div key={g.id} className="bp-card bp-card--tight bp-growth-node" data-status={gateTone(g.status)}>
            <div className="bp-growth-top">
              <span className="bp-phase">{g.owner.replace(/_/g, " ")}</span>
              <span className="bp-status" data-status={gateTone(g.status)}>
                {g.status.replace(/_/g, " ")}
              </span>
            </div>
            <h4 className="bp-card-title">{g.name}</h4>
            <p className="bp-metric-line">
              {g.exitCriteria} exit criteria · {g.evidence} evidence ·{" "}
              {g.blockers} blocker{g.blockers === 1 ? "" : "s"}
            </p>
            {g.waived ? (
              <p className="bp-risk-line">
                <span>waived</span> by the founder, not passed on evidence
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {/* ── The Founding 25 ladder ────────────────────────────────────── */}
      <div className="bp-subhead">
        The Founding 25 ladder · {state.founding25.target} venues ·{" "}
        {state.founding25.placesAvailable ?? "unknown"} places available
      </div>
      <ol className="bp-flywheel">
        {VEF_STAGE_MAP.map((s) => {
          const row = state.founding25.ladder.find((l) => l.key === s.counter);
          return (
            <li key={s.stage} className="bp-flywheel-step">
              <span className="bp-flywheel-num">{s.n}</span>
              <span className="bp-flywheel-name">
                {row?.label ?? s.stage}
                {" · "}
                {row ? row.count : "not tracked"}
              </span>
              <span className="bp-flywheel-detail">
                {s.crmToken
                  ? `CRM · ${s.crmToken.replace(/_/g, " ")}`
                  : "no CRM stage exists"}
                {" · authority: "}
                {s.authority}
              </span>
            </li>
          );
        })}
      </ol>

      {/* ── The founder queue ─────────────────────────────────────────── */}
      <div className="bp-subhead">The queue</div>
      <div className="bp-grid bp-grid--3">
        <QueueCard
          label="Founder review"
          n={state.queue.founderReview}
          detail={
            state.queue.founderReviewIds.length
              ? state.queue.founderReviewIds.join(", ")
              : "Nothing waiting on a founder decision."
          }
          tone={state.queue.founderReview > 0 ? "warn" : "done"}
        />
        <QueueCard
          label="Blocked"
          n={state.queue.blocked}
          detail={
            state.queue.blockedIds.length
              ? state.queue.blockedIds.join(", ")
              : "No task carries a recorded blocker."
          }
          tone={state.queue.blocked > 0 ? "critical" : "done"}
        />
        <QueueCard
          label="In progress"
          n={state.queue.inProgress}
          detail={`${state.queue.internalReview} in internal review · ${state.queue.ready} ready · ${state.queue.backlog} backlog`}
          tone="warn"
        />
      </div>

      {/* ── Freezes ───────────────────────────────────────────────────── */}
      <div className="bp-subhead">Freezes</div>
      <div className="bp-grid bp-grid--3">
        {state.freezes.map((f) => {
          const d = daysBetween(today, f.date);
          return (
            <div key={f.id} className="bp-card bp-card--tight">
              <h4 className="bp-card-title">{f.name}</h4>
              <p className="bp-metric-line">
                {f.date} ·{" "}
                {d == null
                  ? "date unreadable"
                  : d >= 0
                    ? `${d} days away`
                    : `${Math.abs(d)} days past`}{" "}
                · {f.status}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Reconciliation, the part that is supposed to be uncomfortable ─ */}
      <div className="bp-subhead">Reconciliation across the four sources</div>
      <div className="bp-grid bp-grid--2">
        <div
          className="bp-card bp-log"
          data-tone={crmCoverage.reachesCompletionCondition ? "done" : "critical"}
        >
          <h4 className="bp-card-title bp-log-title">
            The CRM cannot reach the completion condition
          </h4>
          <ul className="bp-log-list">
            <li className="bp-log-item">
              <span className="bp-log-label">
                {crmCoverage.expressible} of {crmCoverage.total} stages
              </span>
              <span className="bp-log-detail">
                The shipped CRM has a stage token for {crmCoverage.expressible}{" "}
                of the twelve ratified Venue Edition stages. Missing entirely:{" "}
                {crmCoverage.missing.join(", ")}.
              </span>
            </li>
            <li className="bp-log-item">
              <span className="bp-log-label">
                pilot_active wears the won colour
              </span>
              <span className="bp-log-detail">
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    width: "0.7em",
                    height: "0.7em",
                    borderRadius: "2px",
                    marginRight: "0.4em",
                    verticalAlign: "baseline",
                    background: pilotActiveColor,
                  }}
                />
                <span className="bp-mono">STAGE_COLORS.pilot_active</span> is{" "}
                {pilotActiveColor}, the register the brand reserves for shipped.
                A venue that has paid nothing renders as won on the CRM board.
                The token is also retired vocabulary: there are no pilots in the
                ratified offer, and{" "}
                <span className="bp-mono">computeOutreachSummary</span> counts it
                inside both REPLIED_STAGES and BOOKED_STAGES.
              </span>
            </li>
            <li className="bp-log-item">
              <span className="bp-log-label">no link to a sponsor</span>
              <span className="bp-log-detail">
                The prospects table carries no sponsor or account key, so a paid
                venue in the ledger cannot be attributed back to the prospect
                that converted. The join below is by count, not by row.
              </span>
            </li>
            {crmCoverage.orphanCrmTokens.length ? (
              <li className="bp-log-item">
                <span className="bp-log-label">CRM tokens with no VEF stage</span>
                <span className="bp-log-detail">
                  {crmCoverage.orphanCrmTokens.join(", ")}
                </span>
              </li>
            ) : null}
          </ul>
          <p className="bp-absorbed-surface">
            evidence/E11.01-02-crm-stages.md §3 · schema.ts PROSPECT_STAGES ·
            crm-utils.ts PIPELINE_STAGES
          </p>
        </div>

        <div
          className="bp-card bp-log"
          data-tone={
            ledgerDisagrees || state.countsDrifted || !state.founding25.monotonic
              ? "critical"
              : "done"
          }
        >
          <h4 className="bp-card-title bp-log-title">Tracker against ledger</h4>
          <ul className="bp-log-list">
            <li className="bp-log-item">
              <span className="bp-log-label">paid venues</span>
              <span className="bp-log-detail">
                Ledger {paidLedger ?? "unread"} · tracker{" "}
                {paidTracker ?? "not tracked"}.{" "}
                {paidLedger == null || paidTracker == null
                  ? "One side is unreadable, so the two cannot be compared this load. This is not agreement."
                  : ledgerDisagrees
                    ? "They disagree. The ledger is the record of money received and wins; correct the tracker, never the reverse (E11.01 §5)."
                    : "In agreement."}
              </span>
            </li>
            <li className="bp-log-item">
              <span className="bp-log-label">pipeline, not money</span>
              <span className="bp-log-detail">
                Signed but unpaid: {signedUnpaidLedger ?? "unread"} · free
                pilots: {pilotLedger ?? "unread"} · venue prospects in the CRM
                funnel: {crmVenueFunnel}. None of these is revenue.
              </span>
            </li>
            <li className="bp-log-item">
              <span className="bp-log-label">counter monotonicity</span>
              <span className="bp-log-detail">
                {state.founding25.monotonic
                  ? "Every cumulative counter is at most the one above it."
                  : `Break: ${state.founding25.monotonicBreaks.join("; ")}. A monotonicity break is a data error, not a surprising quarter.`}
              </span>
            </li>
            <li className="bp-log-item">
              <span className="bp-log-label">derived counts</span>
              <span className="bp-log-detail">
                {state.countsDrifted
                  ? "The register’s derived counts disagree with a recount of its own task list. Run project-control validate."
                  : "The register’s derived counts match a recount of its task list."}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Register integrity ────────────────────────────────────────── */}
      <div className="bp-subhead">Register integrity</div>
      <div className="bp-grid bp-grid--2">
        <RegisterCard
          title="Decisions"
          headlineLabel="ratified"
          register={registers.decisions}
          unreadNote="DECISIONS.md could not be read. No decision count is shown."
        />
        <RegisterCard
          title="RAID"
          headlineLabel="open"
          register={registers.raid}
          unreadNote="RAID.md could not be read. No risk count is shown."
        />
      </div>
    </>
  );
}

function QueueCard({
  label,
  n,
  detail,
  tone,
}: {
  label: string;
  n: number;
  detail: string;
  tone: "critical" | "warn" | "done";
}) {
  return (
    <div className="bp-card bp-log" data-tone={tone}>
      <h4 className="bp-card-title bp-log-title">
        {label} · {n}
      </h4>
      <p className="bp-body">{detail}</p>
    </div>
  );
}

function RegisterCard({
  title,
  headlineLabel,
  register,
  unreadNote,
}: {
  title: string;
  headlineLabel: string;
  register: Awaited<ReturnType<typeof getVefRegisters>>["decisions"];
  unreadNote: string;
}) {
  if (register.read !== "ok") {
    return (
      <div className="bp-card bp-log" data-tone="warn">
        <h4 className="bp-card-title bp-log-title">{title}</h4>
        <p className="bp-body">{unreadNote}</p>
      </div>
    );
  }
  const duped = register.duplicates.length > 0;
  return (
    <div className="bp-card bp-log" data-tone={duped ? "critical" : "done"}>
      <h4 className="bp-card-title bp-log-title">
        {title} · {register.headline} {headlineLabel}
      </h4>
      <ul className="bp-log-list">
        <li className="bp-log-item">
          <span className="bp-log-label">entries</span>
          <span className="bp-log-detail">
            {register.entries} headings · {register.distinct} distinct ids
          </span>
        </li>
        <li className="bp-log-item">
          <span className="bp-log-label">duplicate ids</span>
          <span className="bp-log-detail">
            {duped
              ? `${register.duplicates.join(", ")}. Two entries share one id. Renumbering is change-controlled; record it, do not silently fix it.`
              : "None. Every id appears once."}
          </span>
        </li>
      </ul>
    </div>
  );
}

/* ── Local render helpers ─────────────────────────────────────────────── */

function Section({
  id,
  index,
  label,
  title,
  children,
}: {
  id: string;
  index: number;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`bp-${id}`} className="bp-section" aria-labelledby={`bp-${id}-title`}>
      <div className="bp-section-head">
        <span className="bp-section-index">{String(index).padStart(2, "0")}</span>
        <div>
          <span className="bp-section-label">{label}</span>
          <h2 id={`bp-${id}-title`} className="bp-section-title">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, items, chips }: { label: string; items: string[]; chips?: boolean }) {
  return (
    <div className="bp-field">
      <dt className="bp-field-label">{label}</dt>
      <dd className={chips ? "bp-field-chips" : "bp-field-list"}>
        {chips
          ? items.map((it) => <span key={it} className="bp-chip bp-chip--sm">{it}</span>)
          : items.map((it) => <span key={it} className="bp-field-item">{it}</span>)}
      </dd>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="bp-row">
      <span className="bp-row-label">{label}</span>
      <span className="bp-row-value">{value}</span>
    </div>
  );
}

function LogCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "critical" | "warn" | "done";
  items: ReadonlyArray<{ label: string; detail: string }>;
}) {
  return (
    <div className="bp-card bp-log" data-tone={tone}>
      <h4 className="bp-card-title bp-log-title">{title}</h4>
      <ul className="bp-log-list">
        {items.map((it) => (
          <li key={it.label} className="bp-log-item">
            <span className="bp-log-label">{it.label}</span>
            <span className="bp-log-detail">{it.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
