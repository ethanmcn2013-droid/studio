import { formatEur, type TractionState } from "@/lib/hq/traction";

/**
 * HQ Traction — are we winning?
 *
 * The single section a founder dashboard cannot omit and HQ used to.
 * Reads Studio's own Turso DB (same one cron_runs uses — zero new
 * wiring) and counts the only things that prove the business is
 * converting: paid entitlements, Venue Edition seats, redeemed codes,
 * sponsors. Framed against the ratified €250k/6mo target.
 *
 * Honesty contract: zero is shown as zero, in plain language. The
 * annualised figure is an explicit estimate band, never invoiced
 * revenue. If the DB is unreachable the section says so.
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

  const noPaid = state.activePaid === 0;

  return (
    <section className="hq-trac" aria-label="traction">
      <div className="hq-trac-header">
        <span className="hq-trac-eyebrow">traction · are we winning</span>
        <span className="hq-trac-stamp">
          goal {formatEur(state.goalEur)} · 6mo
        </span>
      </div>

      {noPaid ? (
        <p className="hq-trac-zero">
          No paid conversions yet. The number that decides the next six
          months is still <strong className="hq-trac-strong">zero</strong> —
          that is the signal, not a gap in the dashboard.
        </p>
      ) : (
        <div className="hq-trac-headline">
          <span className="hq-trac-band">
            {formatEur(state.arrLowEur)} – {formatEur(state.arrHighEur)}
          </span>
          <span className="hq-trac-band-label">
            annualised estimate · {state.goalPctLow}–{state.goalPctHigh}% of
            the {formatEur(state.goalEur)} half-year target
          </span>
        </div>
      )}

      <div className="hq-trac-grid">
        <Stat
          n={state.venueEditions}
          label="venue editions"
          note="the paid product"
          accent
        />
        <Stat n={state.activePaid} label="active paid" note="tier ≠ free" />
        <Stat
          n={state.redemptionsTotal}
          label="redemptions"
          note="codes used"
        />
        <Stat
          n={state.codesRedeemed}
          label="codes redeemed"
          note={`of ${state.codesMinted} minted`}
        />
        <Stat n={state.sponsors} label="sponsors" note="venue partners" />
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
