import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getWaitlistEntries } from "@/lib/waitlist";
import type { WaitlistEntry } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Waitlist | Signal HQ",
  description: "Private waitlist ledger for Signal Studio.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

const formatter = new Intl.DateTimeFormat("en-IE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(ms: number): string {
  return formatter.format(new Date(ms));
}

function formatUseCaseLabel(value: string | null): string {
  if (!value) return "unclassified";
  return value.replaceAll("-", " ");
}

function summarize(entries: WaitlistEntry[]) {
  const byUseCase = new Map<string, number>();
  const bySource = new Map<string, number>();

  for (const entry of entries) {
    const useCase = formatUseCaseLabel(entry.useCase);
    byUseCase.set(useCase, (byUseCase.get(useCase) ?? 0) + 1);
    const source = entry.source ?? "unknown";
    bySource.set(source, (bySource.get(source) ?? 0) + 1);
  }

  return {
    total: entries.length,
    byUseCase: Array.from(byUseCase.entries()).sort((a, b) => b[1] - a[1]),
    bySource: Array.from(bySource.entries()).sort((a, b) => b[1] - a[1]),
  };
}

export default async function HqWaitlistPage() {
  await requireHqAccess();

  let entries: WaitlistEntry[] = [];
  let error: string | null = null;

  try {
    entries = await getWaitlistEntries(500);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not read waitlist.";
  }

  const summary = summarize(entries);

  return (
    <main className="mx-auto grid w-full max-w-[1180px] gap-8 px-6 pb-10">
      <HqPageHeader
        slug="waitlist"
        standfirst="Public access is staged through /waitlist; this ledger reads the Studio database directly, newest first."
        meta={
          <Link href="/waitlist" className="hq-page-head-note">
            open public page →
          </Link>
        }
      />

      {error ? (
        <section className="rounded-[8px] border border-border-soft bg-bg-elev p-5">
          <p className="text-[14px] font-medium text-ink">Waitlist unread.</p>
          <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">{error}</p>
        </section>
      ) : (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            <Metric label="total" value={String(summary.total)} detail="latest 500 entries" />
            <Metric
              label="top use case"
              value={summary.byUseCase[0]?.[0] ?? "none"}
              detail={
                summary.byUseCase[0]
                  ? `${summary.byUseCase[0][1]} entr${summary.byUseCase[0][1] === 1 ? "y" : "ies"}`
                  : "no entries yet"
              }
            />
            <Metric
              label="top source"
              value={summary.bySource[0]?.[0] ?? "none"}
              detail={
                summary.bySource[0]
                  ? `${summary.bySource[0][1]} entr${summary.bySource[0][1] === 1 ? "y" : "ies"}`
                  : "no entries yet"
              }
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="grid content-start gap-4">
              <Breakdown title="Use cases" rows={summary.byUseCase} />
              <Breakdown title="Sources" rows={summary.bySource} />
            </div>

            <div className="overflow-hidden rounded-[8px] border border-border-soft bg-bg-elev">
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <span className="hq-os-eyebrow">newest first</span>
                <span className="font-mono text-[11px] text-ink-quiet">
                  {entries.length} shown
                </span>
              </div>
              {entries.length === 0 ? (
                <p className="p-5 text-[14px] text-ink-soft">
                  No waitlist entries yet.
                </p>
              ) : (
                <div className="divide-y divide-border-soft">
                  {entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="grid gap-3 p-4 md:grid-cols-[1fr_auto]"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h2 className="m-0 text-[15px] font-semibold text-ink">
                            {entry.name || entry.email}
                          </h2>
                          {entry.name ? (
                            <span className="font-mono text-[11px] text-ink-quiet">
                              {entry.email}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 max-w-[72ch] text-[13px] leading-[1.6] text-ink-soft">
                          {entry.note || "No note."}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-quiet">
                          <span>{formatUseCaseLabel(entry.useCase)}</span>
                          <span>{entry.source ?? "unknown source"}</span>
                          {entry.artifact ? <span>{entry.artifact}</span> : null}
                        </div>
                      </div>
                      <div className="font-mono text-[11px] leading-[1.7] text-ink-quiet md:text-right">
                        <div>{formatDate(entry.lastSubmittedAt)}</div>
                        <div>{entry.status}</div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[8px] border border-border-soft bg-bg-elev p-5">
      <span className="hq-os-eyebrow">{label}</span>
      <strong className="mt-3 block text-[28px] font-semibold leading-none tracking-[-0.035em] text-ink">
        {value}
      </strong>
      <span className="mt-2 block text-[12px] text-ink-quiet">{detail}</span>
    </div>
  );
}

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number]>;
}) {
  return (
    <section className="rounded-[8px] border border-border-soft bg-bg-elev p-5">
      <h2 className="hq-os-eyebrow">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-4 text-[13px] text-ink-soft">No entries yet.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {rows.map(([label, count]) => (
            <li
              key={label}
              className="flex items-baseline justify-between gap-4 border-b border-border-soft pb-3 last:border-b-0 last:pb-0"
            >
              <span className="text-[13px] capitalize text-ink-soft">{label}</span>
              <span className="font-mono text-[12px] text-ink">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
