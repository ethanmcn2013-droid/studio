import {
  CHART_COLUMNS,
  FOUNDER_GATES,
  ORG_COUNTS,
  isDiscovery,
} from "./org-intel";
import { DIRECTORS, ELT_SNAPSHOT, getDirector } from "@/lib/hq/elt";
import { roleTitle } from "./org-utils";

/**
 * The one-page investor artifact. Hidden on screen; @media print hides the
 * live deck and shows this instead, so printing from any mode produces the
 * same designed brief. Triggered from Investor mode's print button or Cmd+P.
 */
export function OrgPrintBrief({ syncedLabel }: { syncedLabel: string }) {
  return (
    <section className="orgc-print" aria-hidden="true">
      <header className="orgc-print-head">
        <div className="orgc-print-brand">
          Signal Studio<span className="orgc-print-period" />
        </div>
        <div className="orgc-print-meta">
          the operating org · internal · {syncedLabel}
        </div>
      </header>

      <p className="orgc-print-statement">
        One founder keeps every final call. Seventeen directors hold named
        scope, bounded authority, and a standing cadence. The result is one
        person operating with the coordination of a company.
      </p>

      <div className="orgc-print-metrics">
        <div>
          <b>{ORG_COUNTS.directors}</b>
          <span>directors</span>
        </div>
        <div>
          <b>{ORG_COUNTS.divisions}</b>
          <span>divisions</span>
        </div>
        <div>
          <b>{ORG_COUNTS.councils}</b>
          <span>standing councils</span>
        </div>
        <div>
          <b>{ORG_COUNTS.coordinationPaths}</b>
          <span>coordination paths</span>
        </div>
        <div>
          <b>{ORG_COUNTS.founderGates}</b>
          <span>founder gates</span>
        </div>
        <div>
          <b>{ORG_COUNTS.tools}</b>
          <span>tools and platforms</span>
        </div>
      </div>

      <div className="orgc-print-founder">
        <b>{ELT_SNAPSHOT.founderName}</b> · {ELT_SNAPSHOT.founderRole} · vision,
        strategy, allocation
      </div>

      <div className="orgc-print-divisions">
        {CHART_COLUMNS.map((col) => (
          <div key={col.id} className="orgc-print-division">
            <div className="orgc-print-div-head">
              <b>{col.label}</b>
              <span>{col.members.filter((m) => !isDiscovery(m)).length}</span>
            </div>
            <ul>
              {col.members.map((mid) => {
                if (isDiscovery(mid)) return null;
                const d = getDirector(mid);
                if (!d) return null;
                const index = DIRECTORS.findIndex((item) => item.id === mid) + 1;
                return (
                  <li key={mid}>
                    <em>{String(index).padStart(2, "0")}</em> {roleTitle(d.name)}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="orgc-print-gates">
        <b>Founder gates.</b> {FOUNDER_GATES.join(" · ")}.
      </div>

      <footer className="orgc-print-foot">
        <span>signalstudio.ie/hq/org</span>
        <span>
          mirrors signal-directors · snapshot {ELT_SNAPSHOT.generatedAt}
        </span>
      </footer>
    </section>
  );
}
