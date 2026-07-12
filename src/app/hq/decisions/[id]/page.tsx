import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HqStatusPill, mapToStatus } from "@/components/hq/hq-status-pill";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { readHqEntry } from "@/lib/hq/markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Decision · Signal HQ",
  robots: { index: false, follow: false },
};

/** One decision record: frontmatter facts, then its H2 sections as prose. */
export default async function DecisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireHqAccess();
  const { id } = await params;
  const entry = await readHqEntry("decisions", id);
  if (!entry) notFound();

  const status = String(entry.fm.status ?? "Active");
  const sections = Object.entries(entry.sections);

  return (
    <main className="hq-decision">
      <header className="hq-page-head">
        <Link href="/hq/decisions" className="hq-page-head-back">
          ← decisions
        </Link>
        <p className="hq-page-head-eyebrow">
          <span className="hq-page-head-dot" aria-hidden="true" />
          company · decision
        </p>
        <h1 className="hq-page-head-title">
          {String(entry.fm.title ?? entry.fm.id)}
        </h1>
        <div className="hq-page-head-meta">
          <HqStatusPill status={mapToStatus(status)} label={status.toLowerCase()} />
          <span className="hq-page-head-note">
            {String(entry.fm.category ?? "")}
            {entry.fm.date ? ` · ${String(entry.fm.date)}` : ""}
            {entry.fm.reviewDate
              ? ` · review ${String(entry.fm.reviewDate)}`
              : ""}
          </span>
        </div>
      </header>

      {sections.length > 0 ? (
        sections.map(([heading, body]) => (
          <section key={heading} className="hq-decision-section">
            <h2>{heading}</h2>
            {body
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </section>
        ))
      ) : (
        <section className="hq-decision-section">
          {entry.body
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </section>
      )}

      {entry.fm.relatedObjects.length > 0 ? (
        <footer className="hq-decision-related">
          <span className="hq-page-head-eyebrow">related</span>
          <p>{entry.fm.relatedObjects.join(" · ")}</p>
        </footer>
      ) : null}
    </main>
  );
}
