import Link from "next/link";
import type { LaunchReadiness } from "@/lib/hq/launch";

/**
 * HqLaunchReadiness — the countdown to the hard launch + the gates between
 * here and there. Calm, light register: one big number, three honest gate
 * states, no chrome. A gate is green only when a live signal says so.
 *
 * Server component (no interactivity) — the page computes readiness from
 * getLaunchReadiness(paidVenues) and hands it in.
 */
export function HqLaunchReadiness({ readiness }: { readiness: LaunchReadiness }) {
  const { daysRemaining, weeksRemaining, launchLabel, gates, cleared, total, launched } =
    readiness;

  return (
    <section className="hq-launch" aria-labelledby="hq-launch-title">
      <div className="hq-launch-clock">
        <span className="hq-os-eyebrow">launch readiness</span>
        {launched ? (
          <span className="hq-launch-days" id="hq-launch-title">live</span>
        ) : (
          <span className="hq-launch-days" id="hq-launch-title">
            {daysRemaining}
            <span className="hq-launch-days-unit"> days</span>
          </span>
        )}
        <span className="hq-launch-sub">
          {launched ? (
            <>shipped · {launchLabel}</>
          ) : (
            <>
              to {launchLabel} · ~{weeksRemaining} week{weeksRemaining === 1 ? "" : "s"}
            </>
          )}
        </span>
        <span className="hq-launch-gatecount" data-all-clear={cleared === total ? "true" : undefined}>
          {cleared} of {total} gates clear
        </span>
      </div>

      <ul className="hq-launch-gates" role="list">
        {gates.map((g) => {
          const body = (
            <>
              <span className="hq-launch-gate-dot" data-state={g.state} aria-hidden="true" />
              <span className="hq-launch-gate-label">
                {g.label}
                {!g.live ? <span className="hq-launch-gate-manual" title="operator-confirmed, not live-read"> · manual</span> : null}
              </span>
              <span className="hq-launch-gate-detail">{g.detail}</span>
            </>
          );
          return (
            <li key={g.key} className="hq-launch-gate" data-state={g.state}>
              {g.href ? (
                <Link href={g.href} className="hq-launch-gate-link">
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
