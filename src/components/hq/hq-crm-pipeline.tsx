import Link from "next/link";
import {
  PIPELINE_STAGES,
  STAGE_LABELS,
  type StageCounts,
} from "@/lib/hq/crm-utils";
import type { ProspectStage } from "@/lib/db/schema";

/**
 * HQ CRM Pipeline Rail — the funnel at a glance.
 *
 * Five stage buckets (to_contact → pilot_active) shown as a horizontal
 * rail of tappable pills. Each pill shows the stage label + count.
 * Active stage is highlighted in accent. "all" shows no highlight.
 *
 * The due-today count surfaces as a separate badge above the rail — it
 * cuts across stages (any non-parked, non-pilot prospect with a
 * past-due or today follow-up date).
 *
 * Filter is stateless URL-param: ?stage=<stage>. Clicking the active
 * pill navigates to ?stage=all (clear the filter).
 */
export function HqCrmPipeline({
  stageCounts,
  dueCount,
  activeStage,
}: {
  stageCounts: StageCounts;
  dueCount: number;
  activeStage: ProspectStage | "all";
}) {
  const total = PIPELINE_STAGES.reduce((n, s) => n + stageCounts[s], 0);

  return (
    <nav className="hq-crm-pipeline" aria-label="CRM pipeline filter">
      <div className="hq-crm-pipeline-rail" role="list">
        {/* All pill */}
        <Link
          href="/hq/crm"
          className="hq-crm-stage-pill"
          data-active={activeStage === "all" ? "true" : undefined}
          role="listitem"
          aria-current={activeStage === "all" ? "page" : undefined}
        >
          <span className="hq-crm-stage-label">all</span>
          <span className="hq-crm-stage-count">{total}</span>
        </Link>

        {/* Stage pills — active funnel only */}
        {PIPELINE_STAGES.map((stage) => {
          const isActive = activeStage === stage;
          const href = isActive ? "/hq/crm" : `/hq/crm?stage=${stage}`;
          return (
            <Link
              key={stage}
              href={href}
              className="hq-crm-stage-pill"
              data-active={isActive ? "true" : undefined}
              data-stage={stage}
              role="listitem"
              aria-current={isActive ? "page" : undefined}
            >
              <span className="hq-crm-stage-label">{STAGE_LABELS[stage]}</span>
              <span className="hq-crm-stage-count">{stageCounts[stage]}</span>
            </Link>
          );
        })}
      </div>

      {/* Parked section */}
      <div className="hq-crm-pipeline-parked">
        <Link
          href={activeStage === "not_interested" ? "/hq/crm" : "/hq/crm?stage=not_interested"}
          className="hq-crm-parked-pill"
          data-active={activeStage === "not_interested" ? "true" : undefined}
        >
          not interested · {stageCounts.not_interested}
        </Link>
        <Link
          href={activeStage === "later" ? "/hq/crm" : "/hq/crm?stage=later"}
          className="hq-crm-parked-pill"
          data-active={activeStage === "later" ? "true" : undefined}
        >
          later · {stageCounts.later}
        </Link>
      </div>
    </nav>
  );
}
