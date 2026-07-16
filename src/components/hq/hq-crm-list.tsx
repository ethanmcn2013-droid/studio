import { HqCrmRow } from "@/components/hq/hq-crm-row";
import type { DbProspect } from "@/lib/db/schema";
import {
  getStageLabel,
  SEGMENT_CONFIG,
  type ProspectSegment,
} from "@/lib/hq/crm-utils";
import type { ProspectStage } from "@/lib/db/schema";

/**
 * HQ CRM Prospect List, the body below the pipeline rail — per book.
 *
 * Server component: renders a list of `HqCrmRow` items. Each row is
 * a server-rendered table row with a client island (HqCrmRow) for
 * the stage-select, dossier, and lock-down interactions.
 *
 * Empty state is honest per book — the smb book is empty by design,
 * the student and school books point at the lock-down plan.
 */
export function HqCrmList({
  prospects,
  segment,
  activeStage,
}: {
  prospects: DbProspect[];
  segment: ProspectSegment;
  activeStage: ProspectStage | "all";
}) {
  if (prospects.length === 0) {
    return (
      <div className="hq-crm-empty">
        <p className="hq-crm-empty-line">
          {activeStage === "all"
            ? SEGMENT_CONFIG[segment].emptyBookLine
            : `nothing in "${getStageLabel(segment, activeStage as ProspectStage)}" right now`}
        </p>
      </div>
    );
  }

  return (
    <div className="hq-crm-list">
      {/* Table header */}
      <div className="hq-crm-list-head" role="row" aria-hidden="true">
        <span className="hq-crm-col-org">organisation</span>
        <span className="hq-crm-col-loc">location</span>
        <span className="hq-crm-col-stage">stage</span>
        <span className="hq-crm-col-contact">last contacted</span>
        <span className="hq-crm-col-follow">follow-up</span>
        <span className="hq-crm-col-action">action</span>
      </div>

      <div className="hq-crm-list-body" role="list">
        {prospects.map((p) => (
          <HqCrmRow key={p.id} prospect={p} segment={segment} />
        ))}
      </div>
    </div>
  );
}
