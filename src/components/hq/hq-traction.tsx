import { formatEur, type TractionState } from "@/lib/hq/traction";

/**
 * HQ Traction — are we winning?
 *
 * Rebuilt 2026-05-16 for the paid Venue Edition model. The headline is
 * cash actually collected (prepay landed), measured against the ratified
 * €250k/6mo target. Paid venues are the lead metric — the plan judges
 * success on "≥10 paid venues by M3", not on a vanity ARR figure.
 *
 * Honesty contract: cash collected is exact (annual prepay = full year
 * at signature). Signed-but-unpaid venues are pipeline, never money.
 * Couples seeded are distribution. Workspace MRR is the only estimate
 * and is labelled, kept out of the goal %. DB down → the section says so.
 */

export function HqTraction({ state }: { state: TractionState }) {
  if (!state.available) {
    return (
      <section className="hq-trac hq-trac--off" aria-label="traction">
        <div className="hq-trac-header">
          <span className="hq-trac-eyebrow">traction</span>
          <span className="hq-trac-stamp">unread</span>
        </div>
        <p className="hq-trac-off-line">{state.reason}</p>
      </section>
    );
  }

  const noCash = state.cashCollectedEur === 0;

  return (
    <section className="hq-trac" aria-label="traction">
      <div className="hq-trac-header">
        <span className="hq-trac-eyebrow">traction · are we winning</span>
        <span className="hq-trac-stamp">
          goal {formatEur(state.goalEur)} · 6mo · cash
        </span>
      </div>

      {noCash ? (
        <p className="hq-trac-zero">
          No paid venue has put cash in the door yet. The number that decides
          the next six months is still{" "}
          <strong className="hq-trac-strong">zero</strong> — that is the
          signal, not a gap in the dashboard.
          {state.signedUnpaidVenues > 0 ? (
            <>
              {" "}
              <strong className="hq-trac-strong">
                {state.signedUnpaidVenues}
              </strong>{" "}
              signed, not yet paid. Pipeline, not money.
            </>
          ) : null}
        </p>
      ) : (
        <div className="hq-trac-headline">
          <span className="hq-trac-band">
            {formatEur(state.cashCollectedEur)}
          </span>
          <span className="hq-trac-band-label">
            cash collected · {state.goalPct}% of the{" "}
            {formatEur(state.goalEur)} half-year target · workspace adds an
            estimated {formatEur(state.workspaceAnnualisedEur)}/yr on top
          </span>
        </div>
      )}

      <div className="hq-trac-grid">
        <Stat
          n={state.paidVenues}
          label="paid venues"
          note="cash in the door"
          accent
        />
        <Stat
          n={state.foundingVenues}
          label="founding"
          note="€1.5k locked for life"
        />
        <Stat
          n={state.signedUnpaidVenues}
          label="signed, unpaid"
          note="pipeline, not money"
        />
        <Stat
          n={state.couplesSeeded}
          label="couples seeded"
          note="what the money buys"
        />
        <Stat
          n={state.pilotVenues}
          label="free pilots"
          note="pre-conversion"
        />
        <Stat
          n={state.codesRedeemed}
          label="codes redeemed"
          note={`of ${state.codesMinted} minted`}
        />
        <Stat n={state.workspaceSubs} label="workspace subs" note="€12/mo" />
        <Stat
          n={state.activeEntitlements}
          label="entitlements"
          note="active total"
        />
      </div>

      {state.byTier.length > 0 && (
        <p className="hq-trac-tiers">
          paid by tier ·{" "}
          {state.byTier.map((t, i) => (
            <span key={t.tier}>
              {i > 0 ? " · " : ""}
              <strong className="hq-trac-strong">{t.n}</strong> {t.tier}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}

function Stat({
  n,
  label,
  note,
  accent,
}: {
  n: number;
  label: string;
  note: string;
  accent?: boolean;
}) {
  return (
    <div className="hq-trac-stat" data-accent={accent ? "true" : "false"}>
      <span className="hq-trac-stat-num">{n}</span>
      <span className="hq-trac-stat-label">{label}</span>
      <span className="hq-trac-stat-note">{note}</span>
    </div>
  );
}
