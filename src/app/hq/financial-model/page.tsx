import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  buildFinancialModel,
  finEur,
  FIN_META,
  FIN_PRICING,
} from "@/lib/hq/financial-model";
import { getTraction, formatEur } from "@/lib/hq/traction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Financial model · Signal HQ",
  description:
    "The cash-basis projection behind the ask: revenue build, costs, runway, and unit economics, modeled assumptions with live actuals overlaid.",
  robots: { index: false, follow: false },
};

/**
 * /hq/financial-model, the projection behind the ask. Modeled assumptions
 * (owned in financial-model.ts) with the live ledger overlaid as plan-vs-
 * actual. Cash-basis. Everything is labelled as a projection; the only live
 * reads are the overlay + the cash-collected comparison.
 */
export default async function FinancialModelPage() {
  await requireHqAccess();

  const model = buildFinancialModel();
  const traction = await getTraction();

  const actualCash = traction.available ? traction.cashCollectedEur : null;
  const actualVenues = traction.available ? traction.paidVenues : null;

  // Founder top-ups keep company cash at or above zero, so "runway" is months
  // the company carries itself, not months before it hits zero.
  const runwayLabel = model.defaultAlive
    ? `${model.runwayMonths} mo`
    : "needs funding";
  const founderNote = model.founderFundingEndsAt
    ? `founder cash in, through ${model.founderFundingEndsAt}`
    : "none needed";

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="financial-model"
        title="The projection behind the ask."
        standfirst="Historical financial assumptions, retained for reference. January has no newly ratified cash target or active commercial clock."
        meta={
          <span className="hq-page-head-note">
            modeled · revised {FIN_META.revisedOn}
          </span>
        }
      />

      {/* Headline reads */}
      <section className="hq-fm-heads" aria-label="model headlines">
        <Head label="Year-1 revenue" value={finEur(model.year1RevenueEur)} note="first 12 months, cash basis" />
        <Head
          label="Runway"
          value={runwayLabel}
          note={
            model.defaultAlive
              ? "months the company carries itself"
              : "still needs founder cash at the horizon"
          }
          tone="accent"
        />
        <Head
          label="Founder capital"
          value={finEur(model.founderCapitalEur)}
          note={founderNote}
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

      <section className="hq-fm-overlay" aria-label="current payment evidence">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">current payment evidence</span>
          <p>Shared payment receipts matched to current venue records. The historical model below is not a January pace or deadline.</p>
        </div>
        <div className="hq-fm-overlay-grid">
          <Head label="Cash with matching receipts" value={actualCash == null ? "unread" : formatEur(actualCash)} note="current annual amounts, not lifetime cash" />
          <Head label="Receipt-matched venues" value={actualVenues == null ? "unread" : String(actualVenues)} note="plan choices and unaudited paid dates excluded" />
        </div>
        <p className="hq-fm-overlay-note">{traction.available ? traction.burndown.line : "Payment evidence is unavailable. Missing evidence cannot start the commercial clock."}</p>
      </section>

      {/* Monthly projection */}
      <section className="hq-fm-table-wrap" aria-label="monthly projection">
        <div className="hq-fm-unit-head">
          <span className="hq-os-eyebrow">monthly projection · cash basis</span>
          <p>
            Founding cohort front-loaded; paid ramps from launch at a fixed
            €{FIN_PRICING.paidVenueAcvEur.toLocaleString("en-IE")} venue ACV.
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
