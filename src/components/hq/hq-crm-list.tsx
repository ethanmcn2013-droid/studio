import { HqCrmRow } from "@/components/hq/hq-crm-row";
import type { DbProspect } from "@/lib/db/schema";
import { STAGE_LABELS } from "@/lib/hq/crm-utils";
import type { ProspectStage } from "@/lib/db/schema";

/**
 * HQ CRM Prospect List, the body below the pipeline rail.
 *
 * Server component: renders a list of `HqCrmRow` items. Each row is
 * a server-rendered table row with a client island (HqCrmRow) for
 * the stage-select interaction and compose button.
 *
 * Empty state is honest, "nothing here" with a suggestion.
 */
export function HqCrmList({
  prospects,
  activeStage,
}: {
  prospects: DbProspect[];
  activeStage: ProspectStage | "all";
}) {
  if (prospects.length === 0) {
    return (
      <div className="hq-crm-empty">
        <p className="hq-crm-empty-line">
          {activeStage === "all"
            ? "no prospects yet, run the seed or add one"
            : `nothing in "${STAGE_LABELS[activeStage as ProspectStage]}" right now`}
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
          <HqCrmRow key={p.id} prospect={p} />
        ))}
      </div>
    </div>
  );
}
