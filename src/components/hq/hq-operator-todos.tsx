import Link from "next/link";
import type { OperatorTodo, OperatorTodoBoard } from "@/lib/hq/operator-todos";

/**
 * HqOperatorTodos, the retained founder/operator source ledger.
 *
 * The source files preserve the state recorded before the delivery-tracker
 * cutover. This component reports those values as historical context; it does
 * not present them as the current execution queue.
 *
 * Each row discloses its original steps on demand so the source context stays
 * available without implying a current priority or owner.
 *
 * Server component, the page loads the board and hands it in.
 */
export function HqOperatorTodos({ board }: { board: OperatorTodoBoard }) {
  const { todos, openCount, doneCount } = board;

  if (todos.length === 0) return null;

  return (
    <section className="hq-optodo" aria-labelledby="hq-optodo-title">
      <div className="hq-optodo-head">
        <span className="hq-os-eyebrow">operator source</span>
        <h2 id="hq-optodo-title" className="hq-optodo-title">
          Retained founder/operator records
        </h2>
        <p className="hq-optodo-sub">
          These records preserve source facts and rationale from before the cutover.
          Check the delivery tracker for current priority, ownership, and next proof.
        </p>
        <span className="hq-optodo-count">
          {todos.length} records · {openCount} recorded open · {doneCount} recorded done
        </span>
      </div>

      <OperatorTodoGroup
        title="Recorded open"
        note="Source-file status only; verify current state in the delivery tracker before acting."
        todos={todos.filter((todo) => todo.status === "open")}
      />
      {doneCount > 0 ? (
        <details className="hq-optodo-archive">
          <summary>Recorded done · {doneCount}</summary>
          <ul className="hq-optodo-list" role="list">
            {todos.filter((todo) => todo.status === "done").map((todo) => (
              <OperatorTodoRow key={todo.id} todo={todo} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  );
}

function OperatorTodoGroup({
  title,
  note,
  todos,
}: {
  title: string;
  note: string;
  todos: OperatorTodo[];
}) {
  if (todos.length === 0) return null;
  return (
    <div className="hq-optodo-group">
      <div className="hq-optodo-group-head">
        <h3>{title}</h3>
        <span>{todos.length}</span>
      </div>
      <p>{note}</p>
      <ul className="hq-optodo-list" role="list">
        {todos.map((todo) => (
          <OperatorTodoRow key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
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
            {!done ? (
              <span className="hq-optodo-tag hq-optodo-tag--effort">{todo.effort}</span>
            ) : null}
            {todo.blocking && !done ? (
              <span className="hq-optodo-tag hq-optodo-tag--block">recorded blocking</span>
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
