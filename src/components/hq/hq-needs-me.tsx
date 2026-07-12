import Link from "next/link";
import type { AttentionQueue } from "@/lib/hq/attention";

/**
 * The Needs-me queue on Today: at most seven rows, each one thing only
 * the founder can move. Rows link into the room where the action lives;
 * the full ledgers (operator to-dos, inbox tiers) stay one disclosure
 * down in "the full read".
 */
export function HqNeedsMe({ queue }: { queue: AttentionQueue }) {
  return (
    <section className="hq-needsme" aria-labelledby="hq-needsme-title">
      <div className="hq-needsme-head">
        <span className="hq-os-eyebrow">needs me</span>
        <h2 id="hq-needsme-title" className="hq-needsme-title">
          {queue.items.length === 0
            ? "Nothing is waiting on you."
            : `${queue.items.length} ${queue.items.length === 1 ? "thing" : "things"} only you can move`}
        </h2>
      </div>

      {queue.items.length === 0 ? (
        <p className="hq-needsme-empty">
          The gates are clear. Open a room, or let the work run.
        </p>
      ) : (
        <ul className="hq-needsme-list">
          {queue.visible.map((item) => {
            const row = (
              <>
                <span className="hq-needsme-tag" data-rank={item.rank}>
                  {item.tag}
                </span>
                <span className="hq-needsme-item-title">{item.title}</span>
                <span className="hq-needsme-item-detail">{item.detail}</span>
                <span className="hq-needsme-arrow" aria-hidden="true">
                  →
                </span>
              </>
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={item.href} className="hq-needsme-row">
                    {row}
                  </Link>
                ) : (
                  <div className="hq-needsme-row" data-static="true">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {queue.overflow > 0 ? (
        <p className="hq-needsme-overflow">
          {queue.overflow} more below in the full read — a queue this long is
          the finding, not a paging problem.
        </p>
      ) : null}
    </section>
  );
}
