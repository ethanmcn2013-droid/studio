/**
 * CRM pure utilities — no server dependencies, safe for client import.
 *
 * Sync functions and constants that both server and client components need.
 * Server actions and DB reads live in crm-db.ts ("use server").
 */

import type { ProspectStage } from "@/lib/db/schema";

export type { ProspectStage };

// ── Stage display labels ────────────────────────────────────────────────────

export const STAGE_LABELS: Record<ProspectStage, string> = {
  to_contact: "to contact",
  contacted: "contacted",
  replied: "replied",
  demo_booked: "demo booked",
  pilot_active: "pilot active",
  not_interested: "not interested",
  later: "later",
};

/** Stages shown in the pipeline rail (active funnel only). */
export const PIPELINE_STAGES: ProspectStage[] = [
  "to_contact",
  "contacted",
  "replied",
  "demo_booked",
  "pilot_active",
];

/** Stages considered "parked" — shown separately. */
export const PARKED_STAGES: ProspectStage[] = ["not_interested", "later"];

// ── Stage colours ────────────────────────────────────────────────────────────

export const STAGE_COLORS: Record<ProspectStage, { bg: string; text: string }> = {
  to_contact:     { bg: "var(--paper-deep)", text: "var(--ink-quiet)" },
  contacted:      { bg: "var(--accent-soft)", text: "var(--accent-deep)" },
  replied:        { bg: "#fef3c7", text: "#92400e" },
  demo_booked:    { bg: "#fef3c7", text: "#92400e" },
  pilot_active:   { bg: "#d1fae5", text: "#065f46" },
  not_interested: { bg: "var(--paper-deep)", text: "var(--ink-ghost)" },
  later:          { bg: "var(--paper-deep)", text: "var(--ink-ghost)" },
};

// ── Date helpers ─────────────────────────────────────────────────────────────

export function isOverdue(
  nextFollowUpAt: string | null,
  stage: ProspectStage,
): boolean {
  if (!nextFollowUpAt) return false;
  if (PARKED_STAGES.includes(stage)) return false;
  const today = new Date().toISOString().slice(0, 10);
  return nextFollowUpAt < today;
}

export function isDueToday(nextFollowUpAt: string | null): boolean {
  if (!nextFollowUpAt) return false;
  const today = new Date().toISOString().slice(0, 10);
  return nextFollowUpAt === today;
}

// ── Stage count helpers ───────────────────────────────────────────────────────

import type { DbProspect } from "@/lib/db/schema";
import { PROSPECT_STAGES } from "@/lib/db/schema";

export type StageCounts = Record<ProspectStage, number>;

export function computeStageCounts(prospects: DbProspect[]): StageCounts {
  const counts = Object.fromEntries(
    PROSPECT_STAGES.map((s) => [s, 0]),
  ) as StageCounts;
  for (const p of prospects) {
    if (p.stage in counts) counts[p.stage]++;
  }
  return counts;
}

export function getDueToday(prospects: DbProspect[]): DbProspect[] {
  const today = new Date().toISOString().slice(0, 10);
  return prospects.filter(
    (p) =>
      p.nextFollowUpAt &&
      p.nextFollowUpAt <= today &&
      !PARKED_STAGES.includes(p.stage) &&
      p.stage !== "pilot_active",
  );
}

// ── Proof-gate summary ────────────────────────────────────────────────────────

export type OutreachSummary = {
  sent: number;
  firstSendDay: string | null;
  qualifiedReplies: number;
  bookedCalls: number;
};

const REPLIED_STAGES = new Set<ProspectStage>(["replied", "demo_booked", "pilot_active"]);
const BOOKED_STAGES = new Set<ProspectStage>(["demo_booked", "pilot_active"]);

export function computeOutreachSummary(prospects: DbProspect[]): OutreachSummary {
  let sent = 0;
  let qualifiedReplies = 0;
  let bookedCalls = 0;
  const sendDays: string[] = [];

  for (const p of prospects) {
    if (p.lastContactedAt) {
      sent++;
      sendDays.push(p.lastContactedAt);
    }
    if (REPLIED_STAGES.has(p.stage)) qualifiedReplies++;
    if (BOOKED_STAGES.has(p.stage)) bookedCalls++;
  }

  const firstSendDay = sendDays.length ? sendDays.sort()[0] : null;
  return { sent, firstSendDay, qualifiedReplies, bookedCalls };
}

// ── Mailto builder ────────────────────────────────────────────────────────────

const RATIFIED_SUBJECT = "Founding Venue Programme";

export function buildMailtoHref(email: string): string {
  const subject = encodeURIComponent(RATIFIED_SUBJECT);
  return `mailto:${email}?subject=${subject}`;
}
