import type { ReactNode } from "react";
import type { NextAction, OutreachClock } from "@/lib/hq/next-action";

/**
 * HQ Forcing Function — the screen while the outreach clock is inert.
 *
 * Self-contained: depends only on next-action.ts (committed), never on the
 * parallel-session proof-gate module. The strategy review's core finding is
 * that HQ was a thing the operator read and closed while zero sends
 * happened. A dashboard that reports the gate can be scrolled past. This
 * cannot: until the first send is logged, the clock IS the screen, the next
 * physical act is one tap, and everything else — masthead nav aside, the
 * whole stack — collapses behind a single disclosure the operator has to
 * choose to open.
 *
 * It is deliberately worse to linger in. That is the design, and it is the
 * highest application of the brand's restraint, not a lack of design. The
 * moment a send is logged the clock leaves inert and HqPage reverts to the
 * full scroll — dwell is earned then, not before.
 *
 * Same register as the rest of HQ: paper, ink, one indigo, hairlines, the
 * functional red the inert state owns. No new colour, no card chrome, no
 * illustration. Subtraction is the feature.
 */
export function HqForcingFunction({
  clock,
  next,
  children,
}: {
  clock: OutreachClock;
  next: NextAction;
  /** The full stack — rendered, still derived, but behind the fold. */
  children: ReactNode;
}) {
  return (
    <section
      className="hq-ff"
      aria-label="forcing function — the outreach clock is inert"
    >
      <p className="hq-ff-eyebrow">proof gate · the clock is inert</p>

      <h1 className="hq-ff-headline">Zero founder-signed sends logged.</h1>

      <p className="hq-ff-clock">{clock.line}</p>

      {next ? (
        <div className="hq-ff-act">
          <p className="hq-ff-act-eyebrow">
            next physical action · send {next.ordinal} of 5 · Track A ·{" "}
            {next.remaining} unsent
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
          <p className="hq-ff-act-venue">
            All five Track A first-sends logged.
          </p>
          <p className="hq-ff-act-foot">
            The clock should now be running, not inert — if you are still
            seeing this screen the sends are not recorded in the committed
            CRM. Log them.
          </p>
        </div>
      )}

      <p className="hq-ff-deadline" data-missed={clock.startMissed}>
        {clock.startMissed
          ? `Outreach-start deadline (${clock.startDate}) has passed with the gate unmoved. This is not discipline.`
          : `${clock.daysToStart} day${clock.daysToStart === 1 ? "" : "s"} to the outreach-start deadline (${clock.startDate}).`}
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
