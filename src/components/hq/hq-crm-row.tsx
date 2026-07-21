"use client";

import { useState, useTransition } from "react";
import {
  updateProspectContact,
  updateProspectContactInfo,
  updateProspectFollowUp,
  updateProspectNotes,
  updateProspectStage,
} from "@/lib/hq/crm-db";
import {
  buildMailtoHref,
  computeLockdown,
  EMAIL_QUALITY_LABELS,
  getEmailQuality,
  getStageLabel,
  isOverdue,
  isDueToday,
  parseFlags,
  PIPELINE_STAGES,
  PARKED_STAGES,
  STAGE_COLORS,
  type ProspectSegment,
} from "@/lib/hq/crm-utils";
import type { DbProspect, ProspectStage } from "@/lib/db/schema";

/**
 * HQ CRM Row, one prospect, interactive — book-aware.
 *
 * Client island inside the server-rendered list. Interactions:
 *   1. Stage select, dropdown in the book's vocabulary, fires server action.
 *   2. Log contact, marks today as last-contacted, advances to "contacted".
 *   3. Compose, opens mailto: with the book's ratified offer as subject.
 *   4. Dossier, expands the full record: every locked-down fact, the email
 *      quality verdict, and an edit mode to record what a call surfaced.
 *
 * The four lock-down marks (name · door · phone · address) render on every
 * row — the list doubles as the research scoreboard.
 *
 * No optimistic UI: the row reflects server state after revalidation.
 * The slight round-trip is intentional, CRM data must not lie.
 */
export function HqCrmRow({
  prospect: p,
  segment,
}: {
  prospect: DbProspect;
  segment: ProspectSegment;
}) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    contactName: p.contactName,
    role: p.role,
    email: p.email,
    phone: p.phone,
    address: p.address,
    notes: p.notes,
    nextFollowUpAt: p.nextFollowUpAt ?? "",
  });

  const overdue = isOverdue(p.nextFollowUpAt, p.stage);
  const dueToday = isDueToday(p.nextFollowUpAt);
  const mailtoHref = buildMailtoHref(p.email, segment);
  const lockdown = computeLockdown(p);
  const emailQuality = getEmailQuality(p);

  const stageColor = STAGE_COLORS[p.stage];
  const allStages = [...PIPELINE_STAGES, ...PARKED_STAGES] as ProspectStage[];

  const lockMarks: Array<{ key: string; ok: boolean; label: string }> = [
    { key: "name", ok: lockdown.named, label: "named contact" },
    { key: "door", ok: lockdown.rightDoor, label: "right-door email" },
    { key: "phone", ok: lockdown.phone, label: "phone" },
    { key: "address", ok: lockdown.address, label: "address" },
  ];

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

  function handleSaveDossier() {
    startTransition(async () => {
      await updateProspectContactInfo(p.id, {
        contactName: draft.contactName,
        role: draft.role,
        email: draft.email,
        phone: draft.phone,
        address: draft.address,
      });
      if (draft.notes !== p.notes) {
        await updateProspectNotes(p.id, draft.notes);
      }
      if ((draft.nextFollowUpAt || null) !== p.nextFollowUpAt) {
        await updateProspectFollowUp(p.id, draft.nextFollowUpAt || null);
      }
      setEditing(false);
    });
  }

  function openEdit() {
    setDraft({
      contactName: p.contactName,
      role: p.role,
      email: p.email,
      phone: p.phone,
      address: p.address,
      notes: p.notes,
      nextFollowUpAt: p.nextFollowUpAt ?? "",
    });
    setEditing(true);
  }

  const facts: Array<{ label: string; value: string }> = [
    { label: "contact", value: p.contactName ? `${p.contactName}${p.role ? ` · ${p.role}` : ""}` : p.role || "" },
    { label: "email", value: p.email ? `${p.email} · ${EMAIL_QUALITY_LABELS[emailQuality]}` : "" },
    { label: "phone", value: p.phone },
    { label: "address", value: p.address },
    { label: "group", value: p.orgGroup },
    { label: "tier", value: p.tier },
    { label: "website", value: p.website },
    { label: "source", value: p.source },
    { label: "offer", value: p.offerSent },
    { label: "outcome", value: p.outcome },
  ];

  return (
    <div
      className="hq-crm-row"
      data-pending={isPending ? "true" : undefined}
      data-open={open ? "true" : undefined}
      role="listitem"
    >
      {/* Organisation + lock-down marks + personalisation note */}
      <div className="hq-crm-col-org">
        <span className="hq-crm-org-name">{p.organisation}</span>
        <span className="hq-crm-locks" aria-label={`locked down ${lockdown.score} of 4`}>
          {lockMarks.map((m) => (
            <span
              key={m.key}
              className="hq-crm-lock"
              data-ok={m.ok ? "true" : undefined}
              title={`${m.label}: ${m.ok ? "held" : "missing"}`}
            >
              {m.key}
            </span>
          ))}
        </span>
        {(p.category || p.flags) && (
          <span className="hq-crm-badges">
            {p.category && (
              <span className="hq-crm-badge hq-crm-badge--type">{p.category}</span>
            )}
            {parseFlags(p.flags ?? "").map((f) => (
              <span key={f} className="hq-crm-badge" data-flag={f}>
                {f}
              </span>
            ))}
          </span>
        )}
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
              {getStageLabel(segment, s)}
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
        <button
          type="button"
          className="hq-crm-dossier-toggle"
          onClick={() => {
            setOpen((v) => !v);
            if (open) setEditing(false);
          }}
          aria-expanded={open}
          aria-label={`dossier for ${p.organisation}`}
        >
          {open ? "close" : "dossier"}
        </button>
      </div>

      {/* Dossier */}
      {open && (
        <div className="hq-crm-dossier">
          {!editing ? (
            <>
              <dl className="hq-crm-dossier-facts">
                {facts
                  .filter((f) => f.value)
                  .map((f) => (
                    <div key={f.label} className="hq-crm-dossier-fact">
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
              </dl>
              {p.notes && <p className="hq-crm-dossier-notes">{p.notes}</p>}
              <button
                type="button"
                className="hq-crm-log-contact"
                onClick={openEdit}
                disabled={isPending}
              >
                edit record
              </button>
            </>
          ) : (
            <div className="hq-crm-dossier-form">
              {(
                [
                  ["contact name", "contactName", "text"],
                  ["role", "role", "text"],
                  ["email", "email", "email"],
                  ["phone", "phone", "text"],
                  ["address", "address", "text"],
                  ["follow-up", "nextFollowUpAt", "date"],
                ] as const
              ).map(([label, field, type]) => (
                <label key={field} className="hq-crm-dossier-field">
                  <span>{label}</span>
                  <input
                    type={type}
                    value={draft[field]}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [field]: e.target.value }))
                    }
                    disabled={isPending}
                  />
                </label>
              ))}
              <label className="hq-crm-dossier-field hq-crm-dossier-field--wide">
                <span>notes</span>
                <textarea
                  value={draft.notes}
                  rows={3}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, notes: e.target.value }))
                  }
                  disabled={isPending}
                />
              </label>
              <div className="hq-crm-dossier-form-actions">
                <button
                  type="button"
                  className="hq-crm-log-contact"
                  onClick={handleSaveDossier}
                  disabled={isPending}
                >
                  save
                </button>
                <button
                  type="button"
                  className="hq-crm-dossier-toggle"
                  onClick={() => setEditing(false)}
                  disabled={isPending}
                >
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
