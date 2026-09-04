import type { MetricCell, ProofGate } from "@/lib/hq/proofgate";

/** January proof: payment, access distribution and useful work stay distinct. */

function MetricRow({ name, cell }: { name: string; cell: MetricCell }) {
  if (cell.kind === "dark") {
    return (
      <li className="hq-pg-metric hq-pg-metric--dark">
        <span className="hq-pg-metric-name">{name}</span>
        <span className="hq-pg-metric-dark">{cell.reason}</span>
      </li>
    );
  }
  if (cell.kind === "unread") {
    return (
      <li className="hq-pg-metric hq-pg-metric--dark">
        <span className="hq-pg-metric-name">{name}</span>
        <span className="hq-pg-metric-dark">{cell.reason}</span>
      </li>
    );
  }
  return (
    <li className="hq-pg-metric" data-met={cell.met}>
      <span className="hq-pg-metric-name">{name}</span>
      <span className="hq-pg-metric-num">
        {cell.n}
        {cell.target > 0 ? (
          <span className="hq-pg-metric-target"> / {cell.target}</span>
        ) : null}
      </span>
      <span className="hq-pg-metric-note">{cell.note}</span>
    </li>
  );
}

export function HqProofGate({ gate }: { gate: ProofGate }) {
  const m = gate.metrics;
  const stateLabel =
    gate.clock.state === "prelaunch"
      ? "internal testing"
      : gate.clock.state === "inert"
      ? "inert · not started"
      : gate.clock.state === "expired"
        ? "expired · §8 due"
        : "running";

  return (
    <section className="hq-pg" aria-label="proof gate" data-state={gate.clock.state}>
      <div className="hq-pg-header">
        <span className="hq-pg-eyebrow">proof gate · has it moved</span>
        <span className="hq-pg-stamp">January programme · {stateLabel}</span>
      </div>

      <p className="hq-pg-clock">{gate.clock.line}</p>

      <ol className="hq-pg-rail" aria-label="programme milestones">
        {gate.clock.milestones.map((ms) => (
          <li
            key={ms.label}
            className="hq-pg-rail-item"
            data-done={ms.done}
            data-missed={ms.missed}
          >
            <span className="hq-pg-rail-dot" aria-hidden />
            <span className="hq-pg-rail-label">{ms.label}</span>
            <span className="hq-pg-rail-date">
              {ms.date}
              {" · "}
              {ms.done
                ? "met"
                : ms.missed
                  ? "missed"
                  : ms.daysAway >= 0
                    ? `${ms.daysAway}d`
                    : `${-ms.daysAway}d ago`}
            </span>
          </li>
        ))}
      </ol>

      <ul className="hq-pg-metrics" aria-label="commercial proof and access distribution">
        <MetricRow name="qualified replies" cell={m.qualifiedReplies} />
        <MetricRow name="booked calls" cell={m.bookedCalls} />
        <MetricRow name="recorded paid venues" cell={m.paidPilots} />
        <MetricRow name="codes redeemed" cell={m.codesRedeemed} />
        <MetricRow name="useful activation" cell={m.couplesActivated} />
        <MetricRow name="shared artifacts" cell={m.sharedArtifacts} />
      </ul>

      <p className="hq-pg-foot">
        Replies and calls use eligible live venue CRM records ({gate.sent}{" "}
        contact{gate.sent === 1 ? "" : "s"} recorded
        {gate.firstSendDay ? `, earliest ${gate.firstSendDay}` : ""}).
        Paid venues read the sponsor ledger. Code redemptions describe access;
        useful activation and actual sharing need separate verified evidence.
      </p>
    </section>
  );
}
