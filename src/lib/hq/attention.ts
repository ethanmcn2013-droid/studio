import type { InboxData } from "@/lib/hq/inbox";
import type { OperatorTodoBoard } from "@/lib/hq/operator-todos";

/**
 * "Needs me" — the one attention queue (docs/HQ_ARCHITECTURE.md §5.7).
 *
 * Presentation-layer merge ONLY. The sources stay what they are:
 * operator-todos is the authored founder-gate ledger (the CLAUDE.md
 * rule); the inbox is a pure derivation over risks, decision reviews,
 * prospects, and deploys. Merging their data layers would either break
 * the write contract every agent follows or persist derived state.
 *
 * Admission test: founder action unblocks someone or something.
 * Metrics, FYIs, and agent-completable work never enter. The queue caps
 * at seven visible items — a persistently longer queue is itself the
 * finding, and the component says so rather than paginating.
 */

export type AttentionItem = {
  id: string;
  /** Why it needs the founder, in the item's own words. */
  title: string;
  detail: string;
  href?: string;
  source: "operator-todo" | "inbox";
  /** 0 = blocking work, 1 = decision due, 2 = follow-up due. */
  rank: number;
  tag: string;
};

export type AttentionQueue = {
  items: AttentionItem[];
  visible: AttentionItem[];
  overflow: number;
};

export const ATTENTION_VISIBLE_MAX = 7;

export function buildAttentionQueue(
  todos: OperatorTodoBoard,
  inbox: InboxData,
): AttentionQueue {
  const items: AttentionItem[] = [];

  for (const todo of todos.todos) {
    if (todo.status !== "open") continue;
    items.push({
      id: `todo:${todo.id}`,
      title: todo.title,
      detail: todo.why,
      href: todo.href,
      source: "operator-todo",
      rank: todo.blocking ? 0 : todo.priority === "P0" ? 0 : todo.priority === "P1" ? 1 : 2,
      tag: todo.blocking ? `${todo.priority} · blocking` : todo.priority,
    });
  }

  for (const item of inbox.items) {
    if (item.tier === "low") continue; // low tier is FYI, not founder-gated
    items.push({
      id: `inbox:${item.id}`,
      title: item.title,
      detail: item.detail,
      href: item.href,
      source: "inbox",
      rank: item.tier === "high" ? 0 : 2,
      tag: item.source === "prospect" ? "follow-up due" : item.source.replace(/-/g, " "),
    });
  }

  items.sort((a, b) => a.rank - b.rank);

  return {
    items,
    visible: items.slice(0, ATTENTION_VISIBLE_MAX),
    overflow: Math.max(0, items.length - ATTENTION_VISIBLE_MAX),
  };
}
