import type { InboxData } from "@/lib/hq/inbox";
import type { InboxItem } from "@/lib/hq/inbox-pure";
import type { OperatorTodo, OperatorTodoBoard } from "@/lib/hq/operator-todos";
import { resolveHqLocation } from "@/lib/hq/hq-nav";

/**
 * The Action Center model — one normalized queue for everything that needs the
 * founder, drawn from the real sources (operator to-dos + the derived inbox),
 * so nothing is invented and nothing is lost. See
 * docs/hq-redesign/information-architecture.md § Action Center.
 */

export type ActionPriority = "critical" | "due" | "stale" | "queued";
export type ActionKind = "blocker" | "decision" | "risk" | "follow-up" | "task";

export type ActionItem = {
  id: string;
  priority: ActionPriority;
  kind: ActionKind;
  title: string;
  why: string;
  owner: string;
  meta?: string;
  workspace: string;
  href?: string;
  source: string;
};

export type ActionCenter = {
  items: ActionItem[];
  counts: Record<ActionPriority, number>;
  total: number;
  critical: ActionItem[];
  top: ActionItem | null;
  generatedAt: string;
};

const PRIORITY_RANK: Record<ActionPriority, number> = { critical: 0, due: 1, stale: 2, queued: 3 };

export const PRIORITY_LABEL: Record<ActionPriority, string> = {
  critical: "Critical",
  due: "Due now",
  stale: "Going stale",
  queued: "Queued",
};

function workspaceFor(href?: string): string {
  if (!href || !href.startsWith("/hq")) return "Signal HQ";
  return resolveHqLocation(href).group;
}

function fromTodo(todo: OperatorTodo): ActionItem {
  const priority: ActionPriority =
    todo.priority === "P0" ? "critical" : todo.priority === "P1" ? "due" : "queued";
  return {
    id: `todo:${todo.id}`,
    priority,
    kind: todo.blocking ? "blocker" : "task",
    title: todo.title,
    why: todo.why,
    owner: "Founder",
    meta: todo.blocking ? "Blocking downstream work" : todo.phase,
    workspace: workspaceFor(todo.href),
    href: todo.href,
    source: "Operator to-do",
  };
}

function fromInbox(item: InboxItem): ActionItem {
  const priority: ActionPriority =
    item.tier === "high" ? "due" : item.tier === "mid" ? "stale" : "queued";
  const kind: ActionKind =
    item.source === "decision-review" ? "decision" : item.source === "risk" ? "risk" : "follow-up";
  return {
    id: `inbox:${item.id}`,
    priority,
    kind,
    title: item.title,
    why: item.detail,
    owner: item.source === "prospect" ? "Founder" : "Operator",
    meta: item.date ? `since ${item.date}` : undefined,
    workspace: workspaceFor(item.href),
    href: item.href,
    source: "Inbox",
  };
}

export function buildActionCenter(inbox: InboxData, todos: OperatorTodoBoard): ActionCenter {
  const items: ActionItem[] = [
    ...todos.todos.filter((t) => t.status === "open").map(fromTodo),
    ...inbox.items.map(fromInbox),
  ].sort((a, b) => {
    if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority]) {
      return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    }
    return a.title.localeCompare(b.title);
  });

  const counts: Record<ActionPriority, number> = { critical: 0, due: 0, stale: 0, queued: 0 };
  for (const item of items) counts[item.priority] += 1;

  const critical = items.filter((i) => i.priority === "critical");

  return {
    items,
    counts,
    total: items.length,
    critical,
    top: items[0] ?? null,
    generatedAt: inbox.generatedAt,
  };
}
