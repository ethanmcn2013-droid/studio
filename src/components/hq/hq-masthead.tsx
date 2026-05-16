import Link from "next/link";
import type { Verdict } from "@/lib/hq/verdict";

/**
 * HQ Masthead — the one line you read before anything else.
 *
 * HQ v3 (2026-05-16). The old masthead led with the phase headline and
 * a flat 4-stat strip (four equal-weight numbers, no triage). It now
 * leads with the Verdict: one mechanically-derived sentence + the one
 * action. The phase line (the operator's own words from phase.md) is
 * kept but subordinate — context, not the headline. The stat strip is
 * demoted into a one-click "inputs" disclosure so the verdict is always
 * auditable (strategy non-negotiable #1: derived, never authored).
 *
 * Same register as the atlas: paper white, ink, one indigo, hairlines,
 * no card chrome. On-fire is the only state that earns the functional
 * red; one-thing earns the indigo; calm stays ink.
 */

export function HqMasthead({
  phaseHeadline,
  generatedAt,
  verdict,
}: {
  phaseHeadline: string;
  generatedAt: string;
  verdict: Verdict;
}) {
  const stamp = new Date(generatedAt).toLocaleTimeString("en-IE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="hq-mast" aria-label="signal hq">
      <div className="hq-mast-top">
        <span className="hq-mast-eyebrow">
          signal hq<span className="hq-mast-dot" aria-hidden="true">.</span>{" "}
          mission control
        </span>
        <span className="hq-mast-stamp">derived {stamp}</span>
      </div>

      {phaseHeadline !== "—" && (
        <p className="hq-mast-phase">{phaseHeadline}</p>
      )}

      <h1 className="hq-mast-headline" data-level={verdict.level}>
        {verdict.headline}
      </h1>

      <p className="hq-mast-action">
        <span className="hq-mast-action-arrow" aria-hidden="true">
          →{" "}
        </span>
        {verdict.actionHref ? (
          <Link href={verdict.actionHref} className="hq-mast-action-link">
            {verdict.action}
          </Link>
        ) : (
          verdict.action
        )}
      </p>

      <details className="hq-mast-audit">
        <summary className="hq-mast-audit-summary">
          show the inputs
        </summary>
        <ul className="hq-mast-audit-list" role="list">
          {verdict.inputs.map((row) => (
            <li key={row.label} className="hq-mast-audit-row">
              <span className="hq-mast-audit-label">{row.label}</span>
              <span className="hq-mast-audit-value">{row.value}</span>
            </li>
          ))}
        </ul>
      </details>

      <nav className="hq-mast-nav" aria-label="hq surfaces">
        <Link href="/hq/atlas" className="hq-mast-link">
          atlas
        </Link>
        <Link href="/hq/health" className="hq-mast-link">
          health
        </Link>
        <Link href="/hq/entitlements" className="hq-mast-link">
          entitlements
        </Link>
        <Link href="/hq/partners" className="hq-mast-link">
          partners
        </Link>
        <Link href="/hq/plan" className="hq-mast-link">
          marketing plan
        </Link>
      </nav>
    </header>
  );
}
