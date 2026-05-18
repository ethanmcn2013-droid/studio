import type { MetricCell, ProofGate } from "@/lib/hq/proofgate";

/**
 * HQ Proof Gate — has the only thing that matters moved?
 *
 * Built per the 2026-05-18 strategy review, decision #3 (the single
 * permitted measurement build). It sits directly under the masthead,
 * above everything else, because the review's finding is that product
 * work has been functioning as avoidance of this one scoreboard. The
 * operator should see "clock inert, N days to the deadline" before they
 * see anything they could comfortably build instead.
 *
 * Honesty contract: metrics 4 and 5 are shown dark, not zero — they are
 * structurally downstream of a paid pilot and instrumenting them now
 * would itself be the avoidance the review names. Prospect counts read
 * the committed CRM baseline; the label says so.
 */

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
    gate.clock.state === "inert"
      ? "inert · not started"
      : gate.clock.state === "expired"
        ? "expired · §8 due"
        : "running";

  return (
    <section className="hq-pg" aria-label="proof gate" data-state={gate.clock.state}>
      <div className="hq-pg-header">
        <span className="hq-pg-eyebrow">proof gate · has it moved</span>
        <span className="hq-pg-stamp">kill clock · {stateLabel}</span>
      </div>

      <p className="hq-pg-clock">{gate.clock.line}</p>

      <ol className="hq-pg-rail" aria-label="kill-clock milestones">
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

      <ul className="hq-pg-metrics" aria-label="the five metrics">
        <MetricRow name="qualified replies" cell={m.qualifiedReplies} />
        <MetricRow name="booked calls" cell={m.bookedCalls} />
        <MetricRow name="paid pilots" cell={m.paidPilots} />
        <MetricRow name="couples activated" cell={m.couplesActivated} />
        <MetricRow name="shared artifacts" cell={m.sharedArtifacts} />
      </ul>

      <p className="hq-pg-foot">
        Replies and calls read the committed Outbound CRM baseline ({gate.sent}{" "}
        send{gate.sent === 1 ? "" : "s"} logged
        {gate.firstSendDay ? `, first ${gate.firstSendDay}` : ""}). Live edits
        live in the browser CRM. Paid pilots read the real sponsors ledger.
        Metrics four and five are dark by design, not by failure.
      </p>
    </section>
  );
}
