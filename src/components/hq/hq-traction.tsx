import { formatEur, type TractionState } from "@/lib/hq/traction";

/** Current shared payment receipts, legacy claims and access counts stay distinct. */

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
          historical {formatEur(state.goalEur)} reference · no current deadline
        </span>
      </div>

      {noCash ? (
        <p className="hq-trac-zero">
          No current venue payment is verified here. Legacy paid claims and
          plan selections do not prove cleared cash.
        </p>
      ) : (
        <div className="hq-trac-headline">
          <span className="hq-trac-band">
            {formatEur(state.cashCollectedEur)}
          </span>
          <span className="hq-trac-band-label">
            cash with matching receipts · {state.goalPct}% of the historical{" "}
            {formatEur(state.goalEur)} reference, not a new January target
          </span>
        </div>
      )}

      <p className="hq-trac-burn-caption" aria-label="commercial clock">
        {state.burndown.line}
      </p>
      <p className="hq-trac-tiers">
        {state.unverifiedPaidVenues} legacy or unmatched paid claims excluded.
        Cash is the current annual amount per receipt-matched venue, not a lifetime payment total.
        Workspace annualised estimate: {formatEur(state.workspaceAnnualisedEur)}, excluded from cash proof.
      </p>

      <div className="hq-trac-grid">
        <Stat
          n={state.paidVenues}
          label="receipt-matched venues"
          note="current shared payment"
          accent
        />
        <Stat
          n={state.foundingVenues}
          label="founding"
          note="€1k, held on renewal"
        />
        <Stat
          n={state.selectedUnpaidVenues}
          label="plan selected, unpaid"
          note="no signature or cash proof"
        />
        <Stat
          n={state.couplesSeeded}
          label="venue access grants"
          note="access, not useful work"
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
        <Stat n={state.workspaceSubs} label="subscription grants" note="billing unverified" />
        <Stat
          n={state.activeEntitlements}
          label="entitlements"
          note="active total"
        />
      </div>

      {state.byTier.length > 0 && (
        <p className="hq-trac-tiers">
          non-free access by tier ·{" "}
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
