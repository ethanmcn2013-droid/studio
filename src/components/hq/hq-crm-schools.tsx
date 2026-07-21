import { HqCrmBulkBar } from "@/components/hq/hq-crm-bulk-bar";
import { HqCrmCountryTabs } from "@/components/hq/hq-crm-country-tabs";
import { HqCrmNationContext } from "@/components/hq/hq-crm-nation-context";
import { HqCrmFilters } from "@/components/hq/hq-crm-filters";
import { HqCrmIntel } from "@/components/hq/hq-crm-intel";
import { HqCrmPager } from "@/components/hq/hq-crm-pager";
import { HqCrmPipeline } from "@/components/hq/hq-crm-pipeline";
import { HqCrmRow } from "@/components/hq/hq-crm-row";
import {
  computeBookFacets,
  computeLockdownSummary,
  computeStageCounts,
  COUNTRY_CONFIG,
  emailsOf,
  filterBook,
  getNextActions,
  paginate,
  type BookFilters,
} from "@/lib/hq/crm-utils";
import type { DbProspect, ProspectCountry, ProspectStage } from "@/lib/db/schema";

const PAGE_SIZE = 50;

/**
 * The schools book at national scale.
 *
 * Ireland's 721 post-primary schools today, England / Scotland / Wales next —
 * one list, four nations, kept separate from the venue and student books by
 * segment. The country tabs scope the nation; the toolbar searches and filters
 * by county, sector and tag; the pipeline rail filters by stage; the bulk bar
 * copies the filtered email list or exports a mail-merge CSV. Everything is
 * URL-param driven and paginated, so the list stays fast and shareable however
 * large the book grows.
 *
 * `rows` arrives already scoped to the active nation (the query pushes the
 * country filter down), so facets and counts here describe that nation.
 */
export function HqCrmSchools({
  rows,
  activeCountry,
  countryCounts,
  allTotal,
  filters,
  pageNumber,
}: {
  rows: DbProspect[];
  activeCountry: ProspectCountry | "all";
  /** per-nation totals across the whole book, for the country tabs */
  countryCounts: { value: string; count: number }[];
  /** total schools across every nation */
  allTotal: number;
  filters: BookFilters;
  pageNumber: number;
}) {
  // County / type / tag facets describe the active-nation row set.
  const facets = computeBookFacets(rows);
  const filtered = filterBook(rows, filters);

  const stageCounts = computeStageCounts(filtered);
  const lockdown = computeLockdownSummary(filtered);
  const nextActions = getNextActions(filtered);

  const page = paginate(filtered, pageNumber, PAGE_SIZE);
  const emailCount = emailsOf(filtered).length;

  // Base querystring for pipeline + pager links (carries the active filter).
  function paramsFor(overrides: Partial<BookFilters & { page: number }>): string {
    const m = { ...filters, ...overrides } as BookFilters & { page?: number };
    const p = new URLSearchParams();
    p.set("book", "school");
    p.set("country", activeCountry);
    if (m.search.trim()) p.set("q", m.search.trim());
    if (m.county !== "all") p.set("county", m.county);
    if (m.category !== "all") p.set("category", m.category);
    if (m.flag !== "all") p.set("flag", m.flag);
    if (m.stage !== "all") p.set("stage", m.stage);
    if (overrides.page && overrides.page > 1) p.set("page", String(overrides.page));
    return p.toString();
  }

  const stageBuildHref = (stage: ProspectStage | "all") =>
    `/hq/crm?${paramsFor({ stage: stage === "all" ? "all" : stage, page: 1 })}`;

  const nation =
    activeCountry === "all" ? "all nations" : COUNTRY_CONFIG[activeCountry].name;

  return (
    <div className="hq-crm-schools">
      <HqCrmCountryTabs
        activeCountry={activeCountry}
        countries={countryCounts}
        totalAll={allTotal}
        search={filters.search}
      />

      <HqCrmNationContext
        activeCountry={activeCountry}
        countryCounts={countryCounts}
      />

      <HqCrmIntel segment="school" lockdown={lockdown} nextActions={nextActions} />

      <HqCrmPipeline
        segment="school"
        stageCounts={stageCounts}
        activeStage={filters.stage}
        buildHref={stageBuildHref}
      />

      <HqCrmFilters country={activeCountry} filters={filters} facets={facets} />

      <HqCrmBulkBar
        total={rows.length}
        filteredCount={filtered.length}
        emailCount={emailCount}
        exportBase={paramsFor({ page: 1 })}
      />

      {page.rows.length === 0 ? (
        <div className="hq-crm-empty">
          <p className="hq-crm-empty-line">
            No schools match this filter in {nation}. Clear a filter to widen the
            list.
          </p>
        </div>
      ) : (
        <div className="hq-crm-list">
          <div className="hq-crm-list-head" role="row" aria-hidden="true">
            <span className="hq-crm-col-org">school</span>
            <span className="hq-crm-col-loc">location</span>
            <span className="hq-crm-col-stage">stage</span>
            <span className="hq-crm-col-contact">last contacted</span>
            <span className="hq-crm-col-follow">follow-up</span>
            <span className="hq-crm-col-action">action</span>
          </div>
          <div className="hq-crm-list-body" role="list">
            {page.rows.map((p) => (
              <HqCrmRow key={p.id} prospect={p} segment="school" />
            ))}
          </div>
        </div>
      )}

      <HqCrmPager page={page} baseParams={paramsFor({ page: 1 })} />
    </div>
  );
}
