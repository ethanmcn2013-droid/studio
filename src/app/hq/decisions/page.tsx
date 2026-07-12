import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HqStatusPill, mapToStatus } from "@/components/hq/hq-status-pill";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { readHqSection } from "@/lib/hq/markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Decisions · Signal HQ",
  description: "The append-only decision ledger.",
  robots: { index: false, follow: false },
};

/**
 * The decision ledger. The company's most valuable record set — every
 * strategic choice, its status, and its review date — rendered as a
 * first-class room instead of feeding derivations invisibly. Source:
 * content/hq/decisions/*.md (append-only; supersede, never edit).
 */
export default async function DecisionsPage() {
  await requireHqAccess();
  const decisions = await readHqSection("decisions");

  const activeFirst = [...decisions].sort((a, b) => {
    const rank = (status: string) => (status === "Active" ? 0 : 1);
    const byStatus =
      rank(String(a.fm.status ?? "")) - rank(String(b.fm.status ?? ""));
    if (byStatus !== 0) return byStatus;
    return String(b.fm.date ?? "").localeCompare(String(a.fm.date ?? ""));
  });

  return (
    <main className="hq-decisions">
      <HqPageHeader
        slug="decisions"
        meta={
          <span className="hq-page-head-note">
            {decisions.length} logged · append-only · supersede, never edit
          </span>
        }
      />

      <ul className="hq-decisions-list">
        {activeFirst.map((entry) => {
          const status = String(entry.fm.status ?? "Active");
          const reviewDate = String(entry.fm.reviewDate ?? "");
          return (
            <li key={entry.fm.id}>
              <Link
                href={`/hq/decisions/${entry.filename.replace(/\.md$/, "")}`}
                className="hq-decisions-row"
              >
                <span className="hq-decisions-row-title">
                  {String(entry.fm.title ?? entry.fm.id)}
                </span>
                <span className="hq-decisions-row-meta">
                  {entry.fm.category ? (
                    <span className="hq-decisions-row-cat">
                      {String(entry.fm.category)}
                    </span>
                  ) : null}
                  <span className="hq-decisions-row-date">
                    {String(entry.fm.date ?? "")}
                    {reviewDate ? ` · review ${reviewDate}` : ""}
                  </span>
                  <HqStatusPill status={mapToStatus(status)} label={status.toLowerCase()} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
