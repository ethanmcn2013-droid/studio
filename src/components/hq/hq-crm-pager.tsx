import Link from "next/link";
import type { Paged } from "@/lib/hq/crm-utils";
import type { DbProspect } from "@/lib/db/schema";

/**
 * Pager for the schools list. Server-rendered Links that carry the full
 * filter querystring and only swap the page number, so paging is shareable
 * and needs no client state. Hidden when everything fits on one page.
 */
export function HqCrmPager({
  page,
  baseParams,
}: {
  page: Paged<DbProspect>;
  /** the active filter querystring without a `page` key */
  baseParams: string;
}) {
  if (page.pageCount <= 1) return null;

  const href = (n: number) =>
    `/hq/crm?${baseParams}${baseParams ? "&" : ""}page=${n}`;
  const prev = Math.max(1, page.page - 1);
  const next = Math.min(page.pageCount, page.page + 1);

  return (
    <nav className="hq-crm-pager" aria-label="Pagination">
      <span className="hq-crm-pager-range">
        {page.from.toLocaleString()}–{page.to.toLocaleString()} of{" "}
        {page.total.toLocaleString()}
      </span>
      <span className="hq-crm-pager-nav">
        <Link
          href={href(prev)}
          className="hq-crm-pager-btn"
          data-disabled={page.page === 1 ? "true" : undefined}
          aria-disabled={page.page === 1}
          aria-label="Previous page"
        >
          ← Prev
        </Link>
        <span className="hq-crm-pager-page">
          Page {page.page} of {page.pageCount}
        </span>
        <Link
          href={href(next)}
          className="hq-crm-pager-btn"
          data-disabled={page.page === page.pageCount ? "true" : undefined}
          aria-disabled={page.page === page.pageCount}
          aria-label="Next page"
        >
          Next →
        </Link>
      </span>
    </nav>
  );
}
