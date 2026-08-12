/**
 * Reveal wedding wedge, walkover row 4 (Da Vinci's plea).
 *
 * A one-line entry rail above the hero loader: the umbrella stays
 * neutral, but the wedge is visible at the front door for the audience
 * that brought the page its first revenue path. Sits in the page flow
 * above the loading showcase, a single hairline-bordered band carrying
 * one mono eyebrow and one link to `/venues`. Server-rendered,
 * zero JS, reduced-motion-safe by construction.
 *
 * Pointed at `/venues` in the 2026-08-12 estate consolidation: the
 * self-serve `/weddings` page was cut, and the venue is the audience
 * carrying the commercial motion. The couple-facing surface returns
 * with E12.01.
 */

import Link from "next/link";

export function RevealWeddingWedge() {
  return (
    <aside className="reveal-wedge" aria-label="For wedding teams">
      <div className="reveal-wedge-inner">
        <span className="reveal-wedge-eyebrow">
          <span className="reveal-wedge-dot" aria-hidden />
          For wedding venues
        </span>
        <span className="reveal-wedge-sep" aria-hidden>
          ·
        </span>
        <span className="reveal-wedge-line">
          Notes, Tasks and Timeline are in private preview.
        </span>
        <Link href="/venues" className="reveal-wedge-link">
          See the Venue Edition
          <span className="cta-arrow" aria-hidden>
            {" "}→
          </span>
        </Link>
      </div>
    </aside>
  );
}
