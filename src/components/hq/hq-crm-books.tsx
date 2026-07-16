import Link from "next/link";
import {
  PROSPECT_SEGMENTS,
  SEGMENT_CONFIG,
  type BookCount,
  type ProspectSegment,
} from "@/lib/hq/crm-utils";

/**
 * HQ CRM Book Switcher — the four lead books as tabs.
 *
 * Venues, students, schools, and small business are separate outbound
 * motions with separate offers; the switcher keeps them separate lists
 * by construction. Each tab carries the book's total, how many leads are
 * fully locked down, and a due pip when follow-ups are waiting.
 *
 * Stateless URL-param navigation: ?book=<segment>. Switching books clears
 * the stage filter — stages read differently per book.
 */
export function HqCrmBooks({
  books,
  activeBook,
}: {
  books: Record<ProspectSegment, BookCount>;
  activeBook: ProspectSegment;
}) {
  return (
    <nav className="hq-crm-books" aria-label="Lead book">
      {PROSPECT_SEGMENTS.map((segment) => {
        const config = SEGMENT_CONFIG[segment];
        const book = books[segment];
        const isActive = segment === activeBook;
        return (
          <Link
            key={segment}
            href={`/hq/crm?book=${segment}`}
            className="hq-crm-book-tab"
            data-active={isActive ? "true" : undefined}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="hq-crm-book-label">
              {config.label}
              {book.due > 0 && (
                <span
                  className="hq-crm-book-due-pip"
                  aria-label={`${book.due} due`}
                />
              )}
            </span>
            <span className="hq-crm-book-counts">
              {book.total}
              <span className="hq-crm-book-locked">
                {" "}· {book.locked} locked
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
