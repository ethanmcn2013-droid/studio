import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  buildFinancialModel,
  finEur,
  FIN_META,
  FIN_PRICING,
} from "@/lib/hq/financial-model";
import { getTraction } from "@/lib/hq/traction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Financial model — Signal HQ",
  description:
    "The cash-basis projection behind the ask: revenue build, costs, runway, and unit economics — modeled assumptions with live actuals overlaid.",
  robots: { index: false, follow: false },
};

/**
 * /hq/financial-model — the projection behind the ask. Modeled assumptions
 * (owned in financial-model.ts) with the live ledger overlaid as plan-vs-
 * actual. Cash-basis. Everything is labelled as a projection; the only live
 * reads are the overlay + the cash-collected comparison.
 */
export default async function FinancialModelPage() {
  await requireHqAccess();

  const model = buildFinancialModel();
  const traction = await getTraction();

  // Plan-to-date: cumulative modeled revenue through the current month index.
  // The model starts 2026-06 (index 0); find "this month" against it.
  const now = new Date();
  const startIdx =
    (now.getUTCFullYear() - 2026) * 12 + now.getUTCMonth() - 5; // 2026-06 = 0
  const currentIdx = Math.max(0, Math.min(model.months.length - 1, startIdx));
  const planCashToDate = model.months
    .slice(0, currentIdx + 1)
    .reduce((s, m) => s + m.revenueEur, 0);
  const planPaidVenuesToDate = model.months
    .slice(0, currentIdx + 1)
    .reduce((s, m) => s + m.newPaid + m.newFounding, 0);

  const actualCash = traction.available ? traction.cashCollectedEur : null;
  const actualVenues = traction.available ? traction.paidVenues : null;

  const runwayLabel = model.defaultAlive
    ? `${FIN_META.horizonMonths}+ mo`
    : `${model.runwayMonths} mo`;

  return (
    <main id="main" className="hq-page">
      <header className="hq-page-header">
        <span className="hq-page-eyebrow">Signal HQ · Financial Model</span>
        <h1 className="hq-page-title">The projection behind the ask<span aria-hidden="true">.</span></h1>
        <p className="hq-page-intro">
          A cash-basis model — venue editions are annual prepay, so cash lands
          at signature. Every figure is a <strong>modeled assumption</strong>{" "}
          owned in <span className="hq-fm-mono">src/lib/hq/financial-model.ts</span>;
          the live ledger is overlaid below as plan-vs-actual. This is a
          projection, not actuals — read it as one.
        </p>
      </header>

      {/* Headline reads */}
      <section className="hq-fm-heads" aria-label="model headlines">
        <Head label="Year-1 revenue" value={finEur(model.year1RevenueEur)} note="first 12 months, cash basis" />
        <Head
          label="Runway"
          value={runwayLabel}
          note={model.defaultAlive ? "default-alive across the horizon" : "at trailing burn"}
          tone="accent"
        />
        <Head label="Peak monthly burn" value={finEur(model.peakMonthlyBurnEur)} note="worst modeled month" />
        <Head label="Venues by 2027" value={String(model.totalVenuesHorizon)} note={`+ ${model.workspaceSubsAtHorizon} workspace subs`} />
      </section>

      {/* Unit economics */}
      <section className="hq-fm-unit" aria-label="unit economics">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">unit economics</span>
          <p>High-margin, annual-prepay, founder-led. The numbers a lender checks first.</p>
        </div>
        <div className="hq-fm-unit-grid">
          <Unit label="Blended ACV" value={finEur(model.unit.blendedAcvEur)} />
          <Unit label="CAC" value={finEur(model.unit.cacEur)} />
          <Unit label="LTV" value={finEur(model.unit.ltvEur)} />
          <Unit label="LTV : CAC" value={`${model.unit.ltvCacRatio}×`} tone="accent" />
          <Unit label="Payback" value={model.unit.paybackMonths === 0 ? "< 1 mo" : `${model.unit.paybackMonths} mo`} />
          <Unit label="Gross margin" value={`${model.unit.grossMarginPct}%`} />
        </div>
      </section>

      {/* Plan vs actual */}
      <section className="hq-fm-overlay" aria-label="plan versus actual">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">plan vs actual · to date</span>
          <p>
            Modeled to {model.months[currentIdx]?.label}. Actuals read live from
            the ledger{actualCash == null ? " (unread this load)" : ""}.
          </p>
        </div>
        <div className="hq-fm-overlay-grid">
          <Overlay label="Cash collected" plan={finEur(planCashToDate)} actual={actualCash == null ? "—" : finEur(actualCash)} />
          <Overlay label="Venues signed" plan={String(planPaidVenuesToDate)} actual={actualVenues == null ? "—" : String(actualVenues)} />
        </div>
        <p className="hq-fm-overlay-note">
          A gap here is the honest read, not a failure of the model — the plan
          is the slope; the ledger is the truth. Close it with outreach, the one
          thing the dashboard cannot move.
        </p>
      </section>

      {/* Monthly projection */}
      <section className="hq-fm-table-wrap" aria-label="monthly projection">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">monthly projection · cash basis</span>
          <p>
            Founding cohort front-loaded; paid ramps from launch
            ({FIN_PRICING.foundingVenueEur === 1500 ? "€1,500 founding · " : ""}€{FIN_PRICING.paidVenueAcvEur.toLocaleString("en-IE")} paid ACV).
          </p>
        </div>
        <div className="hq-fm-scroll">
          <table className="hq-fm-table">
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Founding</th>
                <th scope="col">Paid</th>
                <th scope="col">Venues</th>
                <th scope="col">Subs</th>
                <th scope="col">Revenue</th>
                <th scope="col">Costs</th>
                <th scope="col">Net</th>
                <th scope="col">Cash</th>
              </tr>
            </thead>
            <tbody>
              {model.months.map((m) => (
                <tr key={m.index} data-launch={m.isLaunch ? "true" : undefined}>
                  <th scope="row">
                    {m.label}
                    {m.isLaunch ? <span className="hq-fm-launch">launch</span> : null}
                  </th>
                  <td>{m.newFounding || "·"}</td>
                  <td>{m.newPaid || "·"}</td>
                  <td>{m.cumVenues}</td>
                  <td>{m.workspaceSubs || "·"}</td>
                  <td>{m.revenueEur ? finEur(m.revenueEur) : "·"}</td>
                  <td className="hq-fm-cost">{finEur(m.costsEur)}</td>
                  <td data-neg={m.netEur < 0 ? "true" : undefined}>{finEur(m.netEur)}</td>
                  <td className="hq-fm-cash" data-neg={m.cashEndEur < 0 ? "true" : undefined}>{finEur(m.cashEndEur)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="hq-dr-foot">
        <Link href="/hq/data-room" className="hq-dr-back">← back to the data room</Link>
        <span className="hq-dr-source">
          modeled · revised {FIN_META.revisedOn} · source · src/lib/hq/financial-model.ts
        </span>
      </footer>
    </main>
  );
}

function Head({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "accent";
}) {
  return (
    <div className="hq-fm-head" data-tone={tone}>
      <span className="hq-fm-head-value">{value}</span>
      <span className="hq-fm-head-label">{label}</span>
      <span className="hq-fm-head-note">{note}</span>
    </div>
  );
}

function Unit({ label, value, tone }: { label: string; value: string; tone?: "accent" }) {
  return (
    <div className="hq-fm-unit-cell" data-tone={tone}>
      <span className="hq-fm-unit-value">{value}</span>
      <span className="hq-fm-unit-label">{label}</span>
    </div>
  );
}

function Overlay({ label, plan, actual }: { label: string; plan: string; actual: string }) {
  return (
    <div className="hq-fm-overlay-cell">
      <span className="hq-fm-overlay-label">{label}</span>
      <div className="hq-fm-overlay-vals">
        <span className="hq-fm-overlay-plan">plan {plan}</span>
        <span className="hq-fm-overlay-actual">actual {actual}</span>
      </div>
    </div>
  );
}
