import Link from "next/link";
import {
  getStageLabel,
  PIPELINE_STAGES,
  type ProspectSegment,
  type StageCounts,
} from "@/lib/hq/crm-utils";
import type { ProspectStage } from "@/lib/db/schema";

/**
 * HQ CRM Pipeline Rail, the funnel at a glance — per book.
 *
 * Five stage buckets (to_contact → pilot_active) shown as a horizontal
 * rail of tappable pills. Stage labels speak the book's language
 * ("cell active" in the student book, "school signed" in the school book).
 *
 * Filter is stateless URL-param: ?book=<segment>&stage=<stage>. Clicking
 * the active pill clears the stage filter but keeps the book.
 */
export function HqCrmPipeline({
  segment,
  stageCounts,
  activeStage,
}: {
  segment: ProspectSegment;
  stageCounts: StageCounts;
  activeStage: ProspectStage | "all";
}) {
  const total = PIPELINE_STAGES.reduce((n, s) => n + stageCounts[s], 0);
  const bookHref = `/hq/crm?book=${segment}`;
  const stageHref = (stage: ProspectStage) => `${bookHref}&stage=${stage}`;

  return (
    <nav className="hq-crm-pipeline" aria-label="CRM pipeline filter">
      <div className="hq-crm-pipeline-rail" role="list">
        {/* All pill */}
        <Link
          href={bookHref}
          className="hq-crm-stage-pill"
          data-active={activeStage === "all" ? "true" : undefined}
          role="listitem"
          aria-current={activeStage === "all" ? "page" : undefined}
        >
          <span className="hq-crm-stage-label">all</span>
          <span className="hq-crm-stage-count">{total}</span>
        </Link>

        {/* Stage pills, active funnel only */}
        {PIPELINE_STAGES.map((stage) => {
          const isActive = activeStage === stage;
          const href = isActive ? bookHref : stageHref(stage);
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
              <span className="hq-crm-stage-label">
                {getStageLabel(segment, stage)}
              </span>
              <span className="hq-crm-stage-count">{stageCounts[stage]}</span>
            </Link>
          );
        })}
      </div>

      {/* Parked section */}
      <div className="hq-crm-pipeline-parked">
        <Link
          href={activeStage === "not_interested" ? bookHref : stageHref("not_interested")}
          className="hq-crm-parked-pill"
          data-active={activeStage === "not_interested" ? "true" : undefined}
        >
          not interested · {stageCounts.not_interested}
        </Link>
        <Link
          href={activeStage === "later" ? bookHref : stageHref("later")}
          className="hq-crm-parked-pill"
          data-active={activeStage === "later" ? "true" : undefined}
        >
          later · {stageCounts.later}
        </Link>
      </div>
    </nav>
  );
}
