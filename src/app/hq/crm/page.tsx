import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HqCrmBooks } from "@/components/hq/hq-crm-books";
import { HqCrmIntel } from "@/components/hq/hq-crm-intel";
import { HqCrmList } from "@/components/hq/hq-crm-list";
import { HqCrmPipeline } from "@/components/hq/hq-crm-pipeline";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getProspects } from "@/lib/hq/crm-db";
import {
  computeBookCounts,
  computeLockdownSummary,
  computeStageCounts,
  getDueToday,
  getNextActions,
  normalizeSegment,
  PIPELINE_STAGES,
  PROSPECT_SEGMENTS,
  SEGMENT_CONFIG,
} from "@/lib/hq/crm-utils";
import type { ProspectSegment, ProspectStage } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Outreach CRM · Signal HQ",
  robots: { index: false, follow: false },
};

/**
 * Signal HQ Outreach CRM — four lead books, one page.
 *
 * Venues, students, schools, and small business are separate outbound
 * motions (market-entry deck 2026–2028) and stay separate lists by
 * construction: ?book=<segment> picks the book, ?stage=<stage> filters
 * within it. The venue book opens first — it is the live motion and the
 * proof gate.
 *
 * Panels, top to bottom:
 *   1. Book switcher — totals, locked-down counts, due pips per book.
 *   2. Intelligence strip — the book's playbook, lock-down meter, next actions.
 *   3. Pipeline rail — stage counts in the book's vocabulary.
 *   4. Lead list — rows with lock-down marks and an expandable dossier.
 *
 * Server component: auth-checked, data fetched at render time; client
 * state lives only in the row islands.
 */
export default async function HqCrmPage({
  searchParams,
}: {
  searchParams: Promise<{ book?: string; stage?: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access");

  const params = await searchParams;
  const rawBook = params.book;
  const activeBook: ProspectSegment =
    rawBook && (PROSPECT_SEGMENTS as readonly string[]).includes(rawBook)
      ? (rawBook as ProspectSegment)
      : "venue";

  const rawStage = params.stage;
  const activeStage: ProspectStage | "all" = (
    rawStage && [...PIPELINE_STAGES, "not_interested", "later", "all"].includes(rawStage)
      ? rawStage
      : "all"
  ) as ProspectStage | "all";

  const prospects = await getProspects();
  const books = computeBookCounts(prospects);
  const bookProspects = prospects.filter(
    (p) => normalizeSegment(p.segment) === activeBook,
  );

  const stageCounts = computeStageCounts(bookProspects);
  const dueToday = getDueToday(bookProspects);
  const lockdown = computeLockdownSummary(bookProspects);
  const nextActions = getNextActions(bookProspects);

  const filtered =
    activeStage === "all"
      ? bookProspects
      : bookProspects.filter((p) => p.stage === activeStage);

  return (
    <div className="hq-crm-page">
      <HqPageHeader
        slug="crm"
        title={SEGMENT_CONFIG[activeBook].title}
        meta={
          <span className="hq-page-head-note">
            {bookProspects.length} leads · {lockdown.locked} locked ·{" "}
            {dueToday.length} due or stale
          </span>
        }
      />

      <HqCrmBooks books={books} activeBook={activeBook} />

      {dueToday.length > 0 && (
        <p className="hq-crm-due-banner">
          <span className="hq-crm-due-pip" aria-hidden="true" />
          {dueToday.length} follow-up{dueToday.length === 1 ? "" : "s"} due or stale
        </p>
      )}

      <HqCrmIntel
        segment={activeBook}
        lockdown={lockdown}
        nextActions={nextActions}
      />

      <HqCrmPipeline
        segment={activeBook}
        stageCounts={stageCounts}
        activeStage={activeStage}
      />

      <HqCrmList
        prospects={filtered}
        segment={activeBook}
        activeStage={activeStage}
      />
    </div>
  );
}
