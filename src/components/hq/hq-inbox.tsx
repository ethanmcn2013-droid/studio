import Link from "next/link";
import { getInboxData } from "@/lib/hq/inbox";
import type { InboxItem } from "@/lib/hq/inbox-pure";
import { HqInboxDismissable } from "./hq-inbox-dismissable";

/**
 * HQ Inbox — things you owe an answer to right now.
 *
 * Lives at the very top of /hq, above the Today block. Severity-tiered
 * queue derived from atlas drift, cron health, risks, decisions, atlas
 * staleness, and overdue prospect follow-ups. Clear is a valid state.
 *
 * Visual register matches the atlas: paper white, ink #111, indigo only
 * on the high-tier dot, hairlines between rows, restrained motion.
 */
export async function HqInbox({
  data: provided,
}: {
  data?: Awaited<ReturnType<typeof getInboxData>>;
} = {}) {
  const data = provided ?? (await getInboxData());

  if (data.items.length === 0) {
    return (
      <section className="hq-inbox hq-inbox--clear" aria-label="inbox">
        <div className="hq-inbox-header">
          <span className="hq-inbox-eyebrow">inbox</span>
          <span className="hq-inbox-stamp">clear</span>
        </div>
        <p className="hq-inbox-clear-line">
          Nothing owes you an answer right now. Quiet is a valid state.
        </p>
      </section>
    );
  }

  return (
    <section className="hq-inbox" aria-label="inbox">
      <div className="hq-inbox-header">
        <span className="hq-inbox-eyebrow">inbox · what needs an answer</span>
        <span className="hq-inbox-counts">
          {tierLine(data.tierCounts.high, "high")}
          {tierSeparator(data.tierCounts.high && (data.tierCounts.mid || data.tierCounts.low))}
          {tierLine(data.tierCounts.mid, "mid")}
          {tierSeparator(data.tierCounts.mid && data.tierCounts.low)}
          {tierLine(data.tierCounts.low, "low")}
        </span>
      </div>
      <ul className="hq-inbox-list">
        {data.items.map((item) => (
          <InboxRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function tierLine(n: number, label: string): string {
  if (!n) return "";
  return `${n} ${label}`;
}

function tierSeparator(show: boolean | number): string {
  return show ? " · " : "";
}

function InboxRow({ item }: { item: InboxItem }) {
  const inner = (
    <>
      <span
        className="hq-inbox-tier"
        data-tier={item.tier}
        aria-hidden="true"
      />
      <span className="hq-inbox-row-source">{sourceLabel(item.source)}</span>
      <span className="hq-inbox-row-title">{item.title}</span>
      <span className="hq-inbox-row-detail">{item.detail}</span>
    </>
  );

  return (
    <li className="hq-inbox-row-wrap">
      <HqInboxDismissable id={item.id}>
        {item.href ? (
          <Link href={item.href} className="hq-inbox-row hq-inbox-row--linked">
            {inner}
          </Link>
        ) : (
          <div className="hq-inbox-row">{inner}</div>
        )}
      </HqInboxDismissable>
    </li>
  );
}

function sourceLabel(source: InboxItem["source"]): string {
  switch (source) {
    case "atlas-drift":
      return "drift";
    case "atlas-stale":
      return "stale";
    case "atlas-stub":
      return "stub";
    case "cron":
      return "cron";
    case "risk":
      return "risk";
    case "decision-review":
      return "review";
    case "prospect":
      return "follow-up";
    default:
      return "—";
  }
}
