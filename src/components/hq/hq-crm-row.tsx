"use client";

import { useTransition } from "react";
import { updateProspectContact, updateProspectStage } from "@/lib/hq/crm-db";
import {
  buildMailtoHref,
  isOverdue,
  isDueToday,
  PIPELINE_STAGES,
  PARKED_STAGES,
  STAGE_COLORS,
  STAGE_LABELS,
} from "@/lib/hq/crm-utils";
import type { DbProspect, ProspectStage } from "@/lib/db/schema";

/**
 * HQ CRM Row, one prospect, interactive.
 *
 * Client island inside the server-rendered list. Three interactions:
 *   1. Stage select, dropdown, fires server action, revalidates.
 *   2. Log contact, marks today as last-contacted, advances to "contacted".
 *   3. Compose, opens mailto: with the ratified subject pre-filled.
 *
 * Overdue follow-ups render the date in --hq-crit red.
 * Due-today follow-ups render in --hq-warn amber.
 *
 * No optimistic UI: the row reflects server state after revalidation.
 * The slight round-trip is intentional, CRM data must not lie.
 */
export function HqCrmRow({ prospect: p }: { prospect: DbProspect }) {
  const [isPending, startTransition] = useTransition();

  const overdue = isOverdue(p.nextFollowUpAt, p.stage);
  const dueToday = isDueToday(p.nextFollowUpAt);
  const mailtoHref = buildMailtoHref(p.email);

  const stageColor = STAGE_COLORS[p.stage];
  const allStages = [...PIPELINE_STAGES, ...PARKED_STAGES] as ProspectStage[];

  function handleStageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStage = e.currentTarget.value as ProspectStage;
    if (newStage === p.stage) return;
    startTransition(async () => {
      await updateProspectStage(p.id, newStage);
    });
  }

  function handleLogContact() {
    const today = new Date().toISOString().slice(0, 10);
    startTransition(async () => {
      await updateProspectContact(p.id, today);
    });
  }

  return (
    <div
      className="hq-crm-row"
      data-pending={isPending ? "true" : undefined}
      role="listitem"
    >
      {/* Organisation + personalisation note */}
      <div className="hq-crm-col-org">
        <span className="hq-crm-org-name">{p.organisation}</span>
        {p.personalisationNote && (
          <span className="hq-crm-org-note">{p.personalisationNote}</span>
        )}
        {p.contactName && (
          <span className="hq-crm-org-contact">
            {p.contactName}{p.role ? ` · ${p.role}` : ""}
          </span>
        )}
      </div>

      {/* Location */}
      <div className="hq-crm-col-loc">
        <span className="hq-crm-location">{p.location || "—"}</span>
      </div>

      {/* Stage select */}
      <div className="hq-crm-col-stage">
        <select
          className="hq-crm-stage-select"
          value={p.stage}
          onChange={handleStageChange}
          disabled={isPending}
          style={{
            background: stageColor.bg,
            color: stageColor.text,
          }}
          aria-label={`stage for ${p.organisation}`}
        >
          {allStages.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Last contacted */}
      <div className="hq-crm-col-contact">
        {p.lastContactedAt ? (
          <span className="hq-crm-date">{p.lastContactedAt}</span>
        ) : (
          <span className="hq-crm-date hq-crm-date--none">—</span>
        )}
      </div>

      {/* Follow-up */}
      <div className="hq-crm-col-follow">
        {p.nextFollowUpAt ? (
          <span
            className="hq-crm-date"
            data-overdue={overdue ? "true" : undefined}
            data-today={dueToday ? "true" : undefined}
          >
            {p.nextFollowUpAt}
            {overdue && <span className="hq-crm-overdue-pip" aria-label="overdue" />}
          </span>
        ) : (
          <span className="hq-crm-date hq-crm-date--none">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="hq-crm-col-action">
        {p.email && (
          <a
            href={mailtoHref}
            className="hq-crm-compose"
            title={`compose to ${p.organisation}`}
            aria-label={`compose email to ${p.organisation}`}
          >
            compose →
          </a>
        )}
        {p.stage === "to_contact" && !p.lastContactedAt && (
          <button
            type="button"
            className="hq-crm-log-contact"
            onClick={handleLogContact}
            disabled={isPending}
            aria-label={`log contact with ${p.organisation}`}
          >
            log sent
          </button>
        )}
      </div>
    </div>
  );
}
