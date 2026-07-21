import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { HqCrmBooks } from "@/components/hq/hq-crm-books";
import { HqCrmIntel } from "@/components/hq/hq-crm-intel";
import { HqCrmList } from "@/components/hq/hq-crm-list";
import { HqCrmPipeline } from "@/components/hq/hq-crm-pipeline";
import { HqCrmSchools } from "@/components/hq/hq-crm-schools";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { getProspects } from "@/lib/hq/crm-db";
import {
  type BookFilters,
  computeBookCounts,
  computeLockdownSummary,
  computeStageCounts,
  getDueToday,
  getNextActions,
  normalizeCountry,
  normalizeSegment,
  PIPELINE_STAGES,
  PROSPECT_COUNTRIES,
  PROSPECT_SEGMENTS,
  SEGMENT_CONFIG,
} from "@/lib/hq/crm-utils";
import type {
  ProspectCountry,
  ProspectSegment,
  ProspectStage,
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Outreach CRM · Signal HQ",
  robots: { index: false, follow: false },
};

type CrmParams = {
  book?: string;
  stage?: string;
  country?: string;
  county?: string;
  category?: string;
  flag?: string;
  q?: string;
  page?: string;
};

/**
 * Signal HQ Outreach CRM — four lead books, one page.
 *
 * Venues, students, schools and small business are separate outbound motions
 * (market-entry deck 2026–2028) and stay separate lists by construction:
 * ?book=<segment> picks the book. The venue book opens first — it is the live
 * motion and the proof gate.
 *
 * The schools book is national: it spans Ireland, England, Scotland and Wales
 * on a within-book country axis, and renders the scale-aware view (country
 * tabs, search, county/type/tag filters, pagination, bulk export). The other
 * books keep the curated pipeline view.
 */
export default async function HqCrmPage({
  searchParams,
}: {
  searchParams: Promise<CrmParams>;
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

  const prospects = await getProspects();
  const books = computeBookCounts(prospects);

  // ── Schools book: national, scale-aware view ────────────────────────────────
  if (activeBook === "school") {
    const allSchools = prospects.filter(
      (p) => normalizeSegment(p.segment) === "school",
    );

    const rawCountry = params.country;
    const activeCountry: ProspectCountry | "all" =
      rawCountry === "all"
        ? "all"
        : rawCountry &&
            (PROSPECT_COUNTRIES as readonly string[]).includes(rawCountry)
          ? (rawCountry as ProspectCountry)
          : "all";

    const countryCounts = PROSPECT_COUNTRIES.map((c) => ({
      value: c,
      count: allSchools.filter((p) => normalizeCountry(p.country) === c).length,
    })).filter((c) => c.count > 0);

    const scoped =
      activeCountry === "all"
        ? allSchools
        : allSchools.filter(
            (p) => normalizeCountry(p.country) === activeCountry,
          );

    const rawStage = params.stage;
    const stage: ProspectStage | "all" = (
      rawStage &&
      [...PIPELINE_STAGES, "not_interested", "later"].includes(rawStage)
        ? rawStage
        : "all"
    ) as ProspectStage | "all";

    const filters: BookFilters = {
      country: activeCountry,
      county: params.county?.trim() || "all",
      category: params.category?.trim() || "all",
      flag: params.flag?.trim() || "all",
      stage,
      search: params.q?.trim() ?? "",
    };

    const pageNumber = Math.max(
      1,
      Number.parseInt(params.page ?? "1", 10) || 1,
    );

    return (
      <div className="hq-crm-page">
        <HqPageHeader
          slug="crm"
          title={SEGMENT_CONFIG.school.title}
          meta={
            <span className="hq-page-head-note">
              {allSchools.length.toLocaleString()} schools ·{" "}
              {countryCounts.length} nation
              {countryCounts.length === 1 ? "" : "s"} · staff-only, zero pupil data
            </span>
          }
        />
        <HqCrmBooks books={books} activeBook="school" />
        <HqCrmSchools
          rows={scoped}
          activeCountry={activeCountry}
          countryCounts={countryCounts}
          allTotal={allSchools.length}
          filters={filters}
          pageNumber={pageNumber}
        />
      </div>
    );
  }

  // ── Venue / student / smb: curated pipeline view ────────────────────────────
  const rawStage = params.stage;
  const activeStage: ProspectStage | "all" = (
    rawStage &&
    [...PIPELINE_STAGES, "not_interested", "later", "all"].includes(rawStage)
      ? rawStage
      : "all"
  ) as ProspectStage | "all";

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
