import type { ReactNode } from "react";
import type { NextAction } from "@/lib/hq/next-action";
import type { ProofGate } from "@/lib/hq/proofgate";

/**
 * HQ Forcing Function — the screen while the clock is inert.
 *
 * Replaces the v3 scroll *only* in the inert state. The strategy review's
 * core finding is that HQ was a thing the operator read and closed while
 * zero sends happened. A dashboard that reports the gate can be scrolled
 * past. This cannot: until the first send is logged, the proof gate IS
 * the screen, the next physical act is one tap, and everything else —
 * inbox, pulse, traction — collapses behind a single disclosure the
 * operator has to choose to open.
 *
 * It is deliberately worse to linger in. That is the design. The moment
 * a send is logged the clock leaves "inert" and the page reverts to the
 * full v3 scroll (HqPage branches on proofGate.clock.state) — dwell is
 * earned then, not before.
 *
 * Same register as the rest of HQ: paper, ink, one indigo, hairlines,
 * the functional red the proof gate already owns for the inert state.
 * No new colour, no card chrome, no illustration.
 */
export function HqForcingFunction({
  gate,
  next,
  children,
}: {
  gate: ProofGate;
  next: NextAction;
  /** The full v3 stack — rendered, still derived, but behind the fold. */
  children: ReactNode;
}) {
  const startMs = gate.clock.milestones.find((m) =>
    m.label.startsWith("outreach-start"),
  );

  return (
    <section
      className="hq-ff"
      aria-label="forcing function — the clock is inert"
    >
      <p className="hq-ff-eyebrow">proof gate · the clock is inert</p>

      <h1 className="hq-ff-headline">
        Zero founder-signed sends logged.
      </h1>

      <p className="hq-ff-clock">{gate.clock.line}</p>

      {next ? (
        <div className="hq-ff-act">
          <p className="hq-ff-act-eyebrow">
            next physical action · send {next.ordinal} of 5 · Track A
          </p>
          <p className="hq-ff-act-venue">
            {next.organisation}
            <span className="hq-ff-act-loc"> · {next.location}</span>
          </p>
          <p className="hq-ff-act-to">{next.email}</p>
          <div className="hq-ff-act-row">
            <a className="hq-ff-act-go" href={next.mailtoHref}>
              Open the pre-addressed email →
            </a>
            <span className="hq-ff-act-then">
              then log the send in the Outbound CRM — that is the event
              the 60-day clock hangs on
            </span>
          </div>
          <p className="hq-ff-act-foot">
            The load-bearing sentence is yours to write, per send. It is
            not in this dashboard — it is in{" "}
            <span className="hq-ff-mono">{next.draftDoc}</span>. If it
            could go to a different venue unedited it is the wrong
            sentence.
          </p>
        </div>
      ) : (
        <div className="hq-ff-act">
          <p className="hq-ff-act-venue">All five Track A first-sends logged.</p>
          <p className="hq-ff-act-foot">
            The clock should now be running, not inert — if you are still
            seeing this screen the sends are not recorded in the committed
            CRM. Log them.
          </p>
        </div>
      )}

      <p className="hq-ff-deadline" data-missed={startMs?.missed ?? false}>
        {startMs
          ? startMs.missed
            ? `Outreach-start deadline (${startMs.date}) has passed with the gate unmoved. This is not discipline.`
            : `${startMs.daysAway} day${startMs.daysAway === 1 ? "" : "s"} to the outreach-start deadline (${startMs.date}).`
          : null}
      </p>

      <details className="hq-ff-rest">
        <summary className="hq-ff-rest-summary">
          everything else — inbox, pulse, traction
        </summary>
        <p className="hq-ff-rest-note">
          Still here, still derived. It is behind this fold on purpose:
          none of it is the thing that moves the gate. Open it when the
          send is done, not instead of it.
        </p>
        <div className="hq-ff-rest-body">{children}</div>
      </details>
    </section>
  );
}
