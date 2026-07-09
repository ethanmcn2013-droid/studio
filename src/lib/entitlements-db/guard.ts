import "server-only";
import { and, count, eq, gt } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { entitlementEvents } from "./schema";

/**
 * Blast-radius + actor safety envelope for ALL entitlement mutations.
 *
 * These controls live at the WRITER layer, not in the React UI, so the
 * STUDIO_OPS_SECRET curl routes and the reconcile cron pass through the
 * same gate a console button does — nothing can bypass them. The UI
 * friction (dry-run, type-to-confirm, deferred-commit undo) is an extra
 * layer ON TOP of this, not a replacement for it.
 *
 * Four controls:
 *  - identified actor    — every mutation records a real actor (the ledger
 *                          is theatre without it; see hq-per-operator-identity).
 *  - bulk hard cap       — an absolute ceiling per bulk mutation.
 *  - two-person approval — a row count above which a second approver is
 *                          required (founder-gated policy knob).
 *  - per-operator velocity — a rolling-window mutation cap that catches a
 *                          leaked cookie / runaway script, plus an anomaly alert.
 */

const num = (v: string | undefined, d: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : d;
};

/** Absolute ceiling on rows a single bulk mutation may touch. Hard refuse above. */
export const BULK_HARD_CAP = num(process.env.ACCESS_BULK_HARD_CAP, 500);
/** Row count above which a bulk mutation needs a second approver (founder-gated). */
export const TWO_PERSON_THRESHOLD = num(process.env.ACCESS_TWO_PERSON_THRESHOLD, 50);
/** Per-operator velocity window and the max mutations allowed within it. */
export const VELOCITY_WINDOW_MS = num(process.env.ACCESS_VELOCITY_WINDOW_MS, 5 * 60_000);
export const VELOCITY_MAX = num(process.env.ACCESS_VELOCITY_MAX, 150);

const windowMinutes = () => Math.max(1, Math.round(VELOCITY_WINDOW_MS / 60_000));

// ── Actor model ─────────────────────────────────────────────────────────

export type ActorKind = "operator" | "system";

export type MutationActor = {
  actorId: string;
  actorName: string;
  kind: ActorKind;
  /** System actors with their own idempotency / per-run caps skip the
   *  velocity cap (a Stripe backfill is a legitimate burst). The shared
   *  ops-curl credential does NOT — it is the primary bypass surface. */
  velocityExempt: boolean;
};

/** Internal, trusted writers with their own dedup / per-run envelopes. */
const SYSTEM_ACTOR_IDS = new Set([
  "stripe-webhook",
  "redeem-flow",
  "reconcile-cron",
  "clerk-webhook",
  "backfill",
]);

/** A trusted internal writer (webhook, cron, redeem flow). Velocity-exempt. */
export function systemActor(id: string, name?: string): MutationActor {
  if (!SYSTEM_ACTOR_IDS.has(id)) {
    throw new Error(`systemActor: unknown system actor '${id}'`);
  }
  return { actorId: id, actorName: name ?? id, kind: "system", velocityExempt: true };
}

/**
 * The shared STUDIO_OPS_SECRET curl surface. A machine credential, not a
 * named human, so it is the primary blast-radius surface and is NOT
 * velocity-exempt. Recorded as its own actor so off-Stripe grants stay
 * attributable in the ledger.
 */
export function opsCurlActor(): MutationActor {
  return {
    actorId: "studio-ops",
    actorName: "Studio Ops (shared ops secret)",
    kind: "system",
    velocityExempt: false,
  };
}

type RosterEntry = { id: string; name: string };

function parseRoster(raw: string | undefined): RosterEntry[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const i = pair.indexOf(":");
      return i === -1
        ? { id: pair, name: pair }
        : { id: pair.slice(0, i).trim(), name: pair.slice(i + 1).trim() };
    })
    .filter((e) => e.id);
}

/** The configured HQ operator roster (env SIGNAL_HQ_OPERATORS="id:Name,id2:Name Two"). */
export function operatorRoster(): RosterEntry[] {
  return parseRoster(process.env.SIGNAL_HQ_OPERATORS);
}

/**
 * A named human operator. Requires a non-empty id AND name — fail-closed on
 * anonymous mutation. If a roster is configured it must match (per-operator
 * identity, the launch gate). Until the roster is set, any named operator is
 * accepted (solo-founder interim); it tightens automatically once
 * SIGNAL_HQ_OPERATORS lands.
 */
export function operatorActor(input: { id?: string | null; name?: string | null }): MutationActor {
  const id = input.id?.trim() ?? "";
  const name = input.name?.trim() ?? "";
  if (!id || !name) {
    throw new Error(
      "operatorActor: a named operator (id + name) is required for every mutation",
    );
  }
  const roster = operatorRoster();
  if (roster.length > 0) {
    const match = roster.find((e) => e.id === id);
    if (!match) {
      throw new Error(`operatorActor: '${id}' is not in the HQ operator roster`);
    }
    return { actorId: match.id, actorName: match.name, kind: "operator", velocityExempt: false };
  }
  return { actorId: id, actorName: name, kind: "operator", velocityExempt: false };
}

/** Fail-closed guard: refuse any mutation that arrives without a real actor. */
export function requireActor(actor: MutationActor | null | undefined): MutationActor {
  if (!actor || !actor.actorId?.trim() || !actor.actorName?.trim()) {
    throw new Error(
      "mutation refused: no identified actor (the audit ledger requires a real actor on every write)",
    );
  }
  return actor;
}

// ── Bulk cap + two-person approval ──────────────────────────────────────

/**
 * Refuse a bulk mutation that exceeds the hard cap, or that crosses the
 * two-person threshold without a second approver. `approvals` defaults to 1
 * (the acting operator). Callers above the threshold must pass approvals>=2.
 */
export function assertBulkAllowed(count: number, opts?: { approvals?: number }): void {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error(`assertBulkAllowed: invalid count ${count}`);
  }
  if (count > BULK_HARD_CAP) {
    reportAnomaly({ kind: "bulk_cap", detail: `${count} rows exceeds hard cap ${BULK_HARD_CAP}` });
    throw new Error(
      `bulk mutation refused: ${count} rows exceeds the hard cap of ${BULK_HARD_CAP}`,
    );
  }
  const approvals = opts?.approvals ?? 1;
  if (count > TWO_PERSON_THRESHOLD && approvals < 2) {
    throw new Error(
      `bulk mutation of ${count} rows needs a second approver (threshold ${TWO_PERSON_THRESHOLD})`,
    );
  }
}

// ── Per-operator velocity ───────────────────────────────────────────────

/**
 * Refuse a mutation that would push an operator past the velocity cap in the
 * rolling window. Counts the operator's own ledger events (durable, shared
 * across serverless instances, un-bypassable). `cost` is the number of rows
 * a bulk op is about to write. Velocity-exempt actors pass through.
 */
export async function assertVelocity(actor: MutationActor, cost = 1): Promise<void> {
  if (actor.velocityExempt) return;
  const since = Date.now() - VELOCITY_WINDOW_MS;
  const db = entitlementsDb();
  const [row] = await db
    .select({ n: count() })
    .from(entitlementEvents)
    .where(
      and(eq(entitlementEvents.actorId, actor.actorId), gt(entitlementEvents.createdAt, since)),
    );
  const used = row?.n ?? 0;
  if (used + cost > VELOCITY_MAX) {
    reportAnomaly({
      kind: "velocity",
      actorId: actor.actorId,
      detail: `${used + cost} mutations in ${windowMinutes()}m exceeds ${VELOCITY_MAX}`,
    });
    throw new Error(
      `mutation refused: operator ${actor.actorId} hit the velocity cap (${VELOCITY_MAX} per ${windowMinutes()}m)`,
    );
  }
}

// ── Anomaly hook ────────────────────────────────────────────────────────

export type AnomalyKind = "velocity" | "bulk_cap" | "drift" | "unknown_tier";
export type AnomalySignal = { kind: AnomalyKind; actorId?: string; detail: string };
type AnomalyListener = (s: AnomalySignal) => void;

const listeners: AnomalyListener[] = [];

/** Subscribe to anomaly signals (Health strip / alerting wires in here). */
export function onAnomaly(fn: AnomalyListener): void {
  listeners.push(fn);
}

/** Emit a structured, grep-able anomaly signal and fan out to listeners. */
export function reportAnomaly(signal: AnomalySignal): void {
  console.warn(`[access-anomaly] ${signal.kind} ${signal.actorId ?? "-"} ${signal.detail}`);
  for (const l of listeners) {
    try {
      l(signal);
    } catch {
      // a broken listener must never break a mutation
    }
  }
}
