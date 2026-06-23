import "server-only";
import { readHqSection } from "./markdown";

/**
 * Operator to-do list — the standing accountability ledger of every
 * founder/operator-gated task across Signal Studio.
 *
 * ── THE RULE (CLAUDE.md / AGENTS.md, codified 2026-06-23) ────────────
 * When any cycle surfaces work that only the founder/operator can do —
 * provision an account, get an API key, set a production env var,
 * publish a legal doc, approve a cost limit, decide a policy — it does
 * NOT live in a chat message or a buried doc. It becomes a file in
 * `content/hq/operator-todos/<id>.md` so it shows up here on the HQ
 * main page. The agent logs the blocker; the founder gets full
 * visibility on exactly what they are blocking; the agent gets full
 * visibility on what is still gating the work.
 * ─────────────────────────────────────────────────────────────────────
 *
 * Source-backed, same contract as the rest of HQ: this reads
 * `content/hq/operator-todos/*.md` via `readHqSection`. To mark a task
 * done, set `status: done` in its file (the agent does this once the
 * founder confirms, or the founder edits the file directly). Nothing is
 * optimistically green — a task is only "done" when its source says so.
 */

export type OperatorTodoStatus = "open" | "done";
export type OperatorTodoPriority = "P0" | "P1" | "P2";

export type OperatorTodo = {
  id: string;
  title: string;
  /** One-line reason this is needed — the cost of leaving it undone. */
  why: string;
  status: OperatorTodoStatus;
  priority: OperatorTodoPriority;
  /** True when downstream engineering work is blocked until this lands. */
  blocking: boolean;
  /** Which phase of the hardening plan this belongs to (free text). */
  phase?: string;
  /** Optional HQ route the task relates to. */
  href?: string;
  /** Step-by-step instructions, rendered as the disclosure body. */
  steps: string;
  /** ISO date the task was logged. */
  date?: string;
};

export type OperatorTodoBoard = {
  todos: OperatorTodo[];
  openCount: number;
  doneCount: number;
  blockingCount: number;
  total: number;
};

const PRIORITY_RANK: Record<OperatorTodoPriority, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
};

function normalizeStatus(raw: unknown): OperatorTodoStatus {
  return String(raw ?? "open").toLowerCase() === "done" ? "done" : "open";
}

function normalizePriority(raw: unknown): OperatorTodoPriority {
  const v = String(raw ?? "P1").toUpperCase();
  return v === "P0" || v === "P2" ? v : "P1";
}

function normalizeBlocking(raw: unknown): boolean {
  return raw === true || String(raw ?? "").toLowerCase() === "true";
}

/**
 * Load + shape the operator to-do board. Open tasks first, then sorted
 * by priority (P0 → P2) with blocking ahead of non-blocking inside a
 * tier; done tasks sink to the bottom so the live blockers stay loud.
 */
export async function getOperatorTodos(): Promise<OperatorTodoBoard> {
  const entries = await readHqSection("operator-todos");

  const todos: OperatorTodo[] = entries.map((e) => {
    // `steps` section if present, else the whole body.
    const steps = e.sections["Steps"] ?? e.sections["steps"] ?? e.body;
    return {
      id: e.fm.id,
      title: e.fm.title,
      why: String(e.fm.why ?? ""),
      status: normalizeStatus(e.fm.status),
      priority: normalizePriority(e.fm.priority),
      blocking: normalizeBlocking(e.fm.blocking),
      phase: e.fm.phase !== undefined ? String(e.fm.phase) : undefined,
      href: e.fm.href !== undefined ? String(e.fm.href) : undefined,
      steps: steps.trim(),
      date: e.fm.date,
    };
  });

  todos.sort((a, b) => {
    // Done sinks.
    if (a.status !== b.status) return a.status === "done" ? 1 : -1;
    // Priority tier.
    if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority]) {
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    }
    // Blocking ahead of non-blocking in the same tier.
    if (a.blocking !== b.blocking) return a.blocking ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  const openTodos = todos.filter((t) => t.status === "open");
  return {
    todos,
    openCount: openTodos.length,
    doneCount: todos.length - openTodos.length,
    blockingCount: openTodos.filter((t) => t.blocking).length,
    total: todos.length,
  };
}
