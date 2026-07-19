import type { DbProspect } from "@/lib/db/schema";
import {
  SEGMENT_CONFIG,
  type LockdownSummary,
  type ProspectSegment,
} from "@/lib/hq/crm-utils";

/**
 * HQ CRM Intelligence Strip — the book's operating truth in one band.
 *
 * Left: the playbook — who the buyer is, what the offer costs, and the
 * channel line from the market-entry deck. The founder should never have
 * to re-derive "how do I work this list" from memory.
 *
 * Right: the lock-down meter — of the book's leads, how many have a named
 * human, an email that opens the buying door, a phone number, a postal
 * address, and how many are fully locked (all four). This is the research
 * scoreboard the lead lock-down plan moves.
 *
 * Below: the next best actions — due follow-ups first, then the
 * best-locked untouched leads. Three names, not a report.
 */
export function HqCrmIntel({
  segment,
  lockdown,
  nextActions,
}: {
  segment: ProspectSegment;
  lockdown: LockdownSummary;
  nextActions: DbProspect[];
}) {
  const config = SEGMENT_CONFIG[segment];
  const meters: Array<{ label: string; value: number }> = [
    { label: "named contact", value: lockdown.named },
    { label: "right-door email", value: lockdown.rightDoor },
    { label: "phone", value: lockdown.phone },
    { label: "address", value: lockdown.address },
  ];

  return (
    <section className="hq-crm-intel" aria-label="Book intelligence">
      <div className="hq-crm-intel-playbook">
        <p className="hq-crm-intel-offer">
          {config.offer} · {config.price}
        </p>
        <p className="hq-crm-intel-line">{config.playbook}</p>
        <p className="hq-crm-intel-buyer">buyer: {config.buyer}</p>
      </div>

      <div className="hq-crm-intel-lockdown">
        <div className="hq-crm-intel-locked">
          <span className="hq-crm-intel-locked-count">
            {lockdown.locked}
            <span className="hq-crm-intel-locked-total">/{lockdown.total}</span>
          </span>
          <span className="hq-crm-intel-locked-label">locked down</span>
        </div>
        <dl className="hq-crm-intel-meters">
          {meters.map((m) => (
            <div key={m.label} className="hq-crm-intel-meter">
              <dt>{m.label}</dt>
              <dd>
                <span
                  className="hq-crm-intel-meter-bar"
                  aria-hidden="true"
                >
                  <span
                    className="hq-crm-intel-meter-fill"
                    style={{
                      width: lockdown.total
                        ? `${Math.round((m.value / lockdown.total) * 100)}%`
                        : "0%",
                    }}
                  />
                </span>
                <span className="hq-crm-intel-meter-count">
                  {m.value}/{lockdown.total}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {nextActions.length > 0 && (
        <p className="hq-crm-intel-next">
          next:{" "}
          {nextActions.map((p, i) => (
            <span key={p.id} className="hq-crm-intel-next-org">
              {i > 0 && " · "}
              {p.organisation}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
