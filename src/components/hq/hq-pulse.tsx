import Link from "next/link";
import type { PulseSignal, PulseState } from "@/lib/hq/pulse";

/**
 * HQ Pulse, is anything on fire or quietly rotting?
 *
 * Sits below the Inbox. Inbox = things that owe you an answer. Pulse =
 * things that are degrading whether or not you answer them: a dead
 * cron, a repo gone dark, a high-impact risk biting, the atlas map
 * drifting out of date. Severity is the whole point, critical first,
 * then watch, then the calm clear state. Same atlas register.
 */

function Row({ s }: { s: PulseSignal }) {
  const inner = (
    <>
      <span
        className="hq-pulse-tier"
        data-level={s.level}
        aria-hidden="true"
      />
      <span className="hq-pulse-label">{s.label}</span>
      <span className="hq-pulse-detail">{s.detail}</span>
    </>
  );
  return (
    <li className="hq-pulse-row-wrap">
      {s.href ? (
        <Link href={s.href} className="hq-pulse-row hq-pulse-row--linked">
          {inner}
        </Link>
      ) : (
        <div className="hq-pulse-row">{inner}</div>
      )}
    </li>
  );
}

export function HqPulse({ state }: { state: PulseState }) {
  if (state.level === "clear" || state.signals.length === 0) {
    return (
      <section className="hq-pulse hq-pulse--clear" aria-label="pulse">
        <div className="hq-pulse-header">
          <span className="hq-pulse-eyebrow">pulse</span>
          <span className="hq-pulse-stamp">clear</span>
        </div>
        <p className="hq-pulse-clear-line">
          Nothing is on fire and nothing is rotting. Crons green, repos
          warm, the map current. Quiet is a valid state.
        </p>
      </section>
    );
  }

  return (
    <section className="hq-pulse" aria-label="pulse">
      <div className="hq-pulse-header">
        <span className="hq-pulse-eyebrow">pulse · on fire or rotting</span>
        <span className="hq-pulse-counts">
          {state.counts.critical > 0 && (
            <span className="hq-pulse-count" data-level="critical">
              {state.counts.critical} critical
            </span>
          )}
          {state.counts.critical > 0 && state.counts.watch > 0 && " · "}
          {state.counts.watch > 0 && (
            <span className="hq-pulse-count" data-level="watch">
              {state.counts.watch} watch
            </span>
          )}
        </span>
      </div>
      <ul className="hq-pulse-list">
        {state.signals.map((s) => (
          <Row key={s.id} s={s} />
        ))}
      </ul>
    </section>
  );
}
