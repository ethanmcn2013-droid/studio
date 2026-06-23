import Link from "next/link";
import type { OperatorTodo, OperatorTodoBoard } from "@/lib/hq/operator-todos";

/**
 * HqOperatorTodos — the founder's standing accountability ledger.
 *
 * Every founder/operator-gated task in the suite (provision an account,
 * get an API key, set a prod env var, publish a legal doc, approve a
 * cost limit) lands here as a `content/hq/operator-todos/*.md` file so
 * the founder has one place to see exactly what they are blocking — and
 * the agent has one place to record what is still gating the work.
 *
 * Calm register, matched to the launch-readiness card: open blockers
 * read loud (P0 + blocking), done tasks sink and grey out. Each row
 * discloses its step-by-step on demand so the spine stays scannable.
 *
 * Server component — the page loads the board and hands it in.
 */
export function HqOperatorTodos({ board }: { board: OperatorTodoBoard }) {
  const { todos, openCount, doneCount, blockingCount } = board;

  if (todos.length === 0) return null;

  return (
    <section className="hq-optodo" aria-labelledby="hq-optodo-title">
      <div className="hq-optodo-head">
        <span className="hq-os-eyebrow">operator to-do</span>
        <h2 id="hq-optodo-title" className="hq-optodo-title">
          What only you can unblock
        </h2>
        <p className="hq-optodo-sub">
          Every founder-gated task across Signal Studio lands here. The agent
          logs the blocker; you have full visibility on what you are holding.
        </p>
        <span className="hq-optodo-count" data-clear={openCount === 0 ? "true" : undefined}>
          {openCount} open
          {blockingCount > 0 ? ` · ${blockingCount} blocking` : ""}
          {doneCount > 0 ? ` · ${doneCount} done` : ""}
        </span>
      </div>

      <ul className="hq-optodo-list" role="list">
        {todos.map((todo) => (
          <OperatorTodoRow key={todo.id} todo={todo} />
        ))}
      </ul>
    </section>
  );
}

function OperatorTodoRow({ todo }: { todo: OperatorTodo }) {
  const done = todo.status === "done";
  return (
    <li className="hq-optodo-row" data-status={todo.status} data-priority={todo.priority}>
      <details className="hq-optodo-details">
        <summary className="hq-optodo-summary">
          <span className="hq-optodo-check" data-status={todo.status} aria-hidden="true">
            {done ? "✓" : ""}
          </span>
          <span className="hq-optodo-main">
            <span className="hq-optodo-row-title">{todo.title}</span>
            <span className="hq-optodo-why">{todo.why}</span>
          </span>
          <span className="hq-optodo-tags">
            <span className="hq-optodo-tag hq-optodo-tag--prio" data-priority={todo.priority}>
              {todo.priority}
            </span>
            {todo.blocking && !done ? (
              <span className="hq-optodo-tag hq-optodo-tag--block">blocking</span>
            ) : null}
            {todo.phase ? (
              <span className="hq-optodo-tag hq-optodo-tag--phase">{todo.phase}</span>
            ) : null}
          </span>
        </summary>
        <div className="hq-optodo-body">
          <pre className="hq-optodo-steps">{todo.steps}</pre>
          {todo.href ? (
            <Link href={todo.href} className="hq-optodo-link">
              open the relevant room →
            </Link>
          ) : null}
        </div>
      </details>
    </li>
  );
}
