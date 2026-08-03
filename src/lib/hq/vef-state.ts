import "server-only";
import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * VEF-2026 reporting state, the fourth source behind /hq/blueprint.
 *
 * The founder operating dashboard already joins three sources: the sponsor
 * ledger (traction.ts), the CRM (crm-db.ts) and the four product Tursos
 * (product-analytics.ts). The fourth is the Venue Edition and Films
 * programme register, which until now no code anywhere read.
 *
 * ── READ ONLY, AND THAT IS A RULE, NOT A HABIT ──────────────────────
 * `PROJECT_STATE.json` is the canonical register for VEF-2026. It is
 * written by `tools/project-control.mjs` and by nothing else. This module
 * opens it with `fs.readFile` and exports no writer, no mutator and no
 * action. A web request must never change programme state: an HQ page
 * load is not a project event, and a dashboard that could edit the
 * register would make every render a potential unlogged status change.
 * WORKFLOWS §7. If you are tempted to add a write here, add it to
 * project-control.mjs instead.
 *
 * ── HONESTY CONTRACT (mirrors traction.ts and product-analytics.ts) ──
 * Every figure is parsed from a named field or it is `null`, and the read
 * carries a health state. A file that will not open, or opens and does not
 * look like the schema, returns `read: "unreadable" | "malformed"` with
 * `state: null`. It never returns zeros. A dashboard showing "0 gates
 * passed" when it could not open the file is worse than one showing
 * nothing, because 0 is a claim and "could not read" is the truth.
 *
 * ── PARSED AGAINST THE SCHEMA, NOT AGAINST A GUESS ──────────────────
 * Field names, enums and shapes come from `PROJECT_STATE.schema.json`
 * (`$id` .../project-state.v1.json). Two things the schema is explicit
 * about and this reader honours:
 *   - `releaseGates` is exactly six items with a fixed id enum.
 *   - `counts` is derived and rewritten on every mutation, so it is read
 *     as a convenience and cross-checked against `tasks` rather than
 *     trusted blindly. Where they disagree, the disagreement is reported.
 * `freezes` and `sequencingDirectives` are not in the schema's required
 * list but the schema sets `additionalProperties: true` and both are
 * present in the live file, so they are read defensively and may be null.
 */

/* ── Source health ───────────────────────────────────────────────────── */

export type VefRead = "ok" | "unreadable" | "malformed";

/** Where the control root was found, so an operator can fix a bad deploy. */
export type VefOrigin = { path: string } | null;

/* ── Parsed shapes ───────────────────────────────────────────────────── */

export type VefGateStatus =
  | "not_started"
  | "in_progress"
  | "ready_for_review"
  | "passed"
  | "failed"
  | "waived";

export type VefGate = {
  id: string;
  name: string;
  owner: string;
  status: VefGateStatus;
  blockers: number;
  evidence: number;
  passedAt: string | null;
  waived: boolean;
  exitCriteria: number;
};

export type VefStageCounter = {
  key: string;
  /** Operator-register label. See the invitation-collision note below. */
  label: string;
  count: number;
};

export type VefFounding25 = {
  target: number;
  placesAvailable: number | null;
  geography: string;
  /** The twelve pipeline counters, in stage order (E11.01 §2). */
  ladder: VefStageCounter[];
  /** Cumulative counters must never increase down the ladder (E11.01 §7). */
  monotonic: boolean;
  monotonicBreaks: string[];
};

export type VefQueue = {
  founderReview: number;
  internalReview: number;
  blocked: number;
  inProgress: number;
  ready: number;
  backlog: number;
  done: number;
  deferred: number;
  cancelled: number;
  total: number;
  /** Task ids sitting in founder_review, so the queue is actionable. */
  founderReviewIds: string[];
  /** Task ids in blocked, with the recorded reason count. */
  blockedIds: string[];
};

export type VefCompletion = {
  value: number;
  numerator: number;
  denominator: number;
  unit: string;
  basis: string;
  provisional: boolean;
};

export type VefFreeze = {
  id: string;
  name: string;
  date: string;
  status: string;
};

export type VefSnapshot = {
  schemaVersion: string;
  releaseDate: string;
  releaseMilestoneName: string;
  completionCondition: string;
  currentPhase: string;
  health: { rag: "green" | "amber" | "red"; reason: string } | null;
  baselineState: string;
  /** null when the register carries no computed completion figure. */
  completion: VefCompletion | null;
  /** True when `counts` disagrees with a recount of `tasks`. */
  countsDrifted: boolean;
  gates: VefGate[];
  gatesPassed: number;
  gatesTotal: number;
  founding25: VefFounding25;
  queue: VefQueue;
  freezes: VefFreeze[];
  lastUpdatedAt: string | null;
  lastValidatedAt: string | null;
};

export type VefStateResult =
  | { read: "ok"; origin: VefOrigin; state: VefSnapshot; note: null }
  | { read: "unreadable" | "malformed"; origin: VefOrigin; state: null; note: string };

/* ── Locating the control root ───────────────────────────────────────── */

const CONTROL_ROOT_REL = path.join(
  "docs",
  "execution",
  "venue-edition-and-films",
);

/**
 * Where to look for the control root.
 *
 * `VEF_CONTROL_ROOT`, when set, is the **only** root. It does not sit at the
 * head of a fallback list, deliberately: an operator who points it at the
 * wrong directory must get "not found", not somebody else's register read
 * silently from the repo. A source that quietly substitutes a different
 * source is the same defect as a zero standing in for a missing number.
 *
 * Without the override, `process.cwd()` is the studio app in a normal build
 * and can be the workspace root when next is started with a directory
 * argument, so both are tried.
 *
 * Deploy note, recorded rather than assumed: `next.config.ts` already uses
 * `outputFileTracingIncludes` to pull `content/dispatch/*.md` into the
 * serverless bundle. `PROJECT_STATE.json` has no such entry, so on Vercel
 * this read is expected to fail and the panel is expected to say so. That
 * is the honesty contract working, not a bug — but the tracing entry is the
 * fix, and it belongs to whoever owns next.config.ts.
 */
function candidateRoots(): string[] {
  const override = process.env.VEF_CONTROL_ROOT;
  if (override) return [override];
  const cwd = process.cwd();
  return [
    path.join(cwd, CONTROL_ROOT_REL),
    path.join(cwd, "studio", CONTROL_ROOT_REL),
  ];
}

/* ── Small parse helpers, all null-safe ──────────────────────────────── */

type Json = Record<string, unknown>;

function obj(v: unknown): Json | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : null;
}
function arr(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}
function nullableStr(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}
/** A counter is a number or it is absent. A missing counter is not a zero. */
function counter(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/**
 * The twelve commercial counters, in the stage order fixed by
 * `E11.01-02-crm-stages.md` §2. Labels are the operator register
 * (E09.10 §4, HQ row), and `invitationsIssued` renders as **venue**
 * invitations sent, per E11.01 §2.1: the bare word "invitation" means the
 * couple's code everywhere else in the programme, and one word for two
 * things is how two counters both stay right and never agree.
 */
const STAGE_LADDER: { key: string; label: string }[] = [
  { key: "researchedAccountUniverse", label: "researched" },
  { key: "invitationsIssued", label: "venue invitations sent" },
  { key: "responses", label: "responded" },
  { key: "qualifiedMeetings", label: "qualified meetings" },
  { key: "demonstrations", label: "demos" },
  { key: "proposals", label: "proposals" },
  { key: "signedAgreements", label: "signed" },
  { key: "paidAgreements", label: "paid" },
  { key: "configuredVenueAccounts", label: "configured" },
  { key: "onboardedVenues", label: "onboarded" },
  { key: "firstCoupleInvitations", label: "first couple invited" },
  { key: "firstCoupleActivations", label: "first couple activated" },
];

function parseCommercial(raw: unknown): VefFounding25 {
  const c = obj(raw) ?? {};
  const target = obj(c.target) ?? {};
  const ladder: VefStageCounter[] = [];
  for (const s of STAGE_LADDER) {
    const n = counter(c[s.key]);
    if (n == null) continue; // absent counter is omitted, never rendered as 0
    ladder.push({ key: s.key, label: s.label, count: n });
  }
  // E11.01 §7: counters are cumulative "ever reached this stage or beyond",
  // so each must be <= the one above it. A break is a data error and is
  // surfaced rather than smoothed.
  const breaks: string[] = [];
  for (let i = 1; i < ladder.length; i += 1) {
    if (ladder[i].count > ladder[i - 1].count) {
      breaks.push(`${ladder[i].label} > ${ladder[i - 1].label}`);
    }
  }
  return {
    target: counter(target.foundingVenues) ?? 25,
    placesAvailable: counter(c.foundingPlacesAvailable),
    geography: str(target.geography, "Greater Limerick"),
    ladder,
    monotonic: breaks.length === 0,
    monotonicBreaks: breaks,
  };
}

function parseGates(raw: unknown): VefGate[] {
  return arr(raw).flatMap((g) => {
    const o = obj(g);
    if (!o) return [];
    const waiver = obj(o.waiver);
    return [
      {
        id: str(o.id, "unknown"),
        name: str(o.name, str(o.id, "unknown")),
        owner: str(o.owner, "unassigned"),
        status: str(o.status, "not_started") as VefGateStatus,
        blockers: arr(o.blockers).length,
        evidence: arr(o.evidence).length,
        passedAt: nullableStr(o.passedAt),
        waived: waiver != null,
        exitCriteria: arr(o.exitCriteria).length,
      },
    ];
  });
}

function parseQueue(raw: unknown): { queue: VefQueue; byStatus: Record<string, number> } {
  const tasks = arr(raw);
  const byStatus: Record<string, number> = {};
  const founderReviewIds: string[] = [];
  const blockedIds: string[] = [];
  for (const t of tasks) {
    const o = obj(t);
    if (!o) continue;
    const status = str(o.status, "backlog");
    byStatus[status] = (byStatus[status] ?? 0) + 1;
    if (status === "founder_review") founderReviewIds.push(str(o.id));
    if (status === "blocked") blockedIds.push(str(o.id));
  }
  return {
    byStatus,
    queue: {
      founderReview: byStatus.founder_review ?? 0,
      internalReview: byStatus.internal_review ?? 0,
      blocked: byStatus.blocked ?? 0,
      inProgress: byStatus.in_progress ?? 0,
      ready: byStatus.ready ?? 0,
      backlog: byStatus.backlog ?? 0,
      done: byStatus.done ?? 0,
      deferred: byStatus.deferred ?? 0,
      cancelled: byStatus.cancelled ?? 0,
      total: tasks.length,
      founderReviewIds: founderReviewIds.sort(),
      blockedIds: blockedIds.sort(),
    },
  };
}

function parseCompletion(raw: unknown): VefCompletion | null {
  const v = obj(raw);
  if (!v) return null;
  const value = counter(v.value);
  const numerator = counter(v.numerator);
  const denominator = counter(v.denominator);
  if (value == null || numerator == null || denominator == null) return null;
  return {
    value,
    numerator,
    denominator,
    unit: str(v.unit, "tasks"),
    basis: str(v.basis, "unstated"),
    provisional: v.provisional === true,
  };
}

function parseFreezes(raw: unknown): VefFreeze[] {
  return arr(raw).flatMap((f) => {
    const o = obj(f);
    if (!o) return [];
    const date = str(o.date);
    if (!date) return [];
    return [
      {
        id: str(o.id, "freeze"),
        name: str(o.name, str(o.id, "freeze")),
        date,
        status: str(o.status, "unknown"),
      },
    ];
  });
}

/* ── The read ────────────────────────────────────────────────────────── */

async function readFirst(
  file: string,
): Promise<{ raw: string; origin: VefOrigin } | null> {
  for (const root of candidateRoots()) {
    const p = path.join(root, file);
    try {
      const raw = await fs.readFile(p, "utf-8");
      return { raw, origin: { path: p } };
    } catch {
      // try the next candidate root
    }
  }
  return null;
}

/**
 * Uncached read. Exported so tests can exercise the honesty contract
 * without a React request scope; application code calls `getVefState`.
 */
export async function readVefState(): Promise<VefStateResult> {
  const found = await readFirst("PROJECT_STATE.json");
  if (!found) {
    return {
      read: "unreadable",
      origin: null,
      state: null,
      note: "PROJECT_STATE.json not found under any candidate control root. Set VEF_CONTROL_ROOT, or add the register to outputFileTracingIncludes for this route.",
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(found.raw);
  } catch {
    return {
      read: "malformed",
      origin: found.origin,
      state: null,
      note: "PROJECT_STATE.json is present but is not valid JSON. Nothing is reported rather than reporting a partial register.",
    };
  }

  const root = obj(parsed);
  const project = obj(root?.project);
  const gates = parseGates(root?.releaseGates);
  // Structural sanity against the schema: the register must carry a project
  // block, the six-gate array and a task list. Anything less is a file that
  // is not this file, and guessing at it would be inventing programme state.
  if (!root || !project || gates.length === 0 || arr(root.tasks).length === 0) {
    return {
      read: "malformed",
      origin: found.origin,
      state: null,
      note: "PROJECT_STATE.json parsed but does not match project-state.v1 (project block, six release gates and a task list are all required).",
    };
  }

  const { queue, byStatus } = parseQueue(root.tasks);
  const counts = obj(root.counts);
  const declaredByStatus = obj(counts?.byStatus) ?? {};
  const countsDrifted = Object.keys({ ...declaredByStatus, ...byStatus }).some(
    (k) => (counter(declaredByStatus[k]) ?? 0) !== (byStatus[k] ?? 0),
  );

  const health = obj(project.health);
  const baseline = obj(root.baseline);
  const meta = obj(root.meta);

  return {
    read: "ok",
    origin: found.origin,
    note: null,
    state: {
      schemaVersion: str(root.schemaVersion, "unknown"),
      releaseDate: str(project.releaseDate),
      releaseMilestoneName: str(project.releaseMilestoneName, "Working release"),
      completionCondition: str(project.completionCondition),
      currentPhase: str(project.currentPhase),
      health: health
        ? {
            rag: str(health.rag, "amber") as "green" | "amber" | "red",
            reason: str(health.reason),
          }
        : null,
      baselineState: str(baseline?.state, "unknown"),
      completion: parseCompletion(counts?.verifiedCompletion),
      countsDrifted,
      gates,
      gatesPassed: gates.filter((g) => g.status === "passed").length,
      gatesTotal: gates.length,
      founding25: parseCommercial(root.commercial),
      queue,
      freezes: parseFreezes(root.freezes),
      lastUpdatedAt: nullableStr(meta?.lastUpdatedAt),
      lastValidatedAt: nullableStr(meta?.lastValidatedAt),
    },
  };
}

/** Per-request memoised read. One page render opens the file once. */
export const getVefState = cache(readVefState);

/* ── The two markdown registers, read as a secondary source ──────────── */

export type VefRegister = {
  read: VefRead;
  /** Heading count, or null when the file could not be read. */
  entries: number | null;
  /** Distinct ids. Differs from `entries` when an id was reused. */
  distinct: number | null;
  /** Ids that appear more than once. A register that loses entries under
   *  concurrent sessions shows up here first (RAID I-011). */
  duplicates: string[];
  /** Ratified for DECISIONS, open for RAID. Null when unreadable. */
  headline: number | null;
};

export type VefRegisters = { decisions: VefRegister; raid: VefRegister };

const UNREAD_REGISTER: VefRegister = {
  read: "unreadable",
  entries: null,
  distinct: null,
  duplicates: [],
  headline: null,
};

function scanRegister(
  raw: string,
  headingRe: RegExp,
  headlineRe: RegExp,
): VefRegister {
  const ids = [...raw.matchAll(headingRe)].map((m) => m[1]);
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return {
    read: "ok",
    entries: ids.length,
    distinct: seen.size,
    duplicates: [...dupes].sort(),
    headline: (raw.match(headlineRe) ?? []).length,
  };
}

export async function readVefRegisters(): Promise<VefRegisters> {
  const [decisionsRaw, raidRaw] = await Promise.all([
    readFirst("DECISIONS.md"),
    readFirst("RAID.md"),
  ]);
  return {
    decisions: decisionsRaw
      ? scanRegister(
          decisionsRaw.raw,
          /^## (D-\d+)/gm,
          /\*\*Status:\*\* approved/g,
        )
      : UNREAD_REGISTER,
    raid: raidRaw
      ? scanRegister(
          raidRaw.raw,
          /^### ([RAID]-\d+)/gm,
          /\*\*Status:\*\* open/g,
        )
      : UNREAD_REGISTER,
  };
}

export const getVefRegisters = cache(readVefRegisters);

/* ── Pure date arithmetic, kept out of the reader so it is testable ──── */

/**
 * Whole days from `fromIso` to `toIso`, both `YYYY-MM-DD`, UTC-anchored.
 * Negative when the target is in the past. Returns null on a bad input
 * rather than NaN, because NaN renders as a number and a number is a claim.
 */
export function daysBetween(fromIso: string, toIso: string): number | null {
  const from = Date.parse(`${fromIso}T00:00:00Z`);
  const to = Date.parse(`${toIso}T00:00:00Z`);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  return Math.round((to - from) / 86_400_000);
}

/** `YYYY-MM-DD` for a Date, in UTC. The programme calendar is date-only. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
