"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { BookFacets, BookFilters } from "@/lib/hq/crm-utils";
import type { ProspectCountry } from "@/lib/db/schema";

/**
 * Schools filter toolbar — search + county / type / tag selects.
 *
 * URL-param driven: every change pushes a new querystring, so the server
 * re-renders the filtered, paginated list and the state is shareable and
 * back-button-correct. No client-held list state. Country and book are
 * preserved on every change; changing any filter resets to page 1.
 */
export function HqCrmFilters({
  country,
  filters,
  facets,
}: {
  country: ProspectCountry | "all";
  filters: BookFilters;
  facets: BookFacets;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.search);

  function push(next: Partial<BookFilters>) {
    const merged = { ...filters, ...next };
    const p = new URLSearchParams();
    p.set("book", "school");
    p.set("country", country);
    if (merged.search.trim()) p.set("q", merged.search.trim());
    if (merged.county !== "all") p.set("county", merged.county);
    if (merged.category !== "all") p.set("category", merged.category);
    if (merged.flag !== "all") p.set("flag", merged.flag);
    if (merged.stage !== "all") p.set("stage", merged.stage);
    startTransition(() => router.push(`/hq/crm?${p.toString()}`, { scroll: false }));
  }

  const activeCount =
    (filters.county !== "all" ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    (filters.flag !== "all" ? 1 : 0) +
    (filters.stage !== "all" ? 1 : 0) +
    (filters.search.trim() ? 1 : 0);

  return (
    <div className="hq-crm-filters" data-pending={isPending ? "true" : undefined}>
      <form
        className="hq-crm-search"
        onSubmit={(e) => {
          e.preventDefault();
          push({ search });
        }}
        role="search"
      >
        <svg className="hq-crm-search-icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="hq-crm-search-input"
          placeholder="Search school, county, town, email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search schools"
        />
        {search && (
          <button
            type="button"
            className="hq-crm-search-clear"
            onClick={() => {
              setSearch("");
              push({ search: "" });
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </form>

      <div className="hq-crm-selects">
        <label className="hq-crm-select">
          <span className="hq-crm-select-label">County</span>
          <select
            value={filters.county}
            onChange={(e) => push({ county: e.target.value })}
            aria-label="Filter by county"
          >
            <option value="all">All counties</option>
            {facets.counties.map((f) => (
              <option key={f.value} value={f.value}>
                {f.value} ({f.count})
              </option>
            ))}
          </select>
        </label>

        <label className="hq-crm-select">
          <span className="hq-crm-select-label">Type</span>
          <select
            value={filters.category}
            onChange={(e) => push({ category: e.target.value })}
            aria-label="Filter by school type"
          >
            <option value="all">All types</option>
            {facets.categories.map((f) => (
              <option key={f.value} value={f.value}>
                {f.value} ({f.count})
              </option>
            ))}
          </select>
        </label>

        <label className="hq-crm-select">
          <span className="hq-crm-select-label">Tag</span>
          <select
            value={filters.flag}
            onChange={(e) => push({ flag: e.target.value })}
            aria-label="Filter by tag"
          >
            <option value="all">All tags</option>
            {facets.flags.map((f) => (
              <option key={f.value} value={f.value}>
                {f.value} ({f.count})
              </option>
            ))}
          </select>
        </label>

        {activeCount > 0 && (
          <button
            type="button"
            className="hq-crm-filter-reset"
            onClick={() => {
              setSearch("");
              startTransition(() =>
                router.push(`/hq/crm?book=school&country=${country}`, { scroll: false }),
              );
            }}
          >
            Reset ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}
