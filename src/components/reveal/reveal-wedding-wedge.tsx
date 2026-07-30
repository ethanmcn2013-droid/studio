/**
 * Reveal wedding wedge, walkover row 4 (Da Vinci's plea).
 *
 * A one-line entry rail above the hero loader: the umbrella stays
 * neutral, but the wedge is visible at the front door for the audience
 * that brought the page its first revenue path. Sits in the page flow
 * above the loading showcase, a single hairline-bordered band carrying
 * one mono eyebrow and one link to `/weddings`. Server-rendered,
 * zero JS, reduced-motion-safe by construction.
 */

import Link from "next/link";

export function RevealWeddingWedge() {
  return (
    <aside className="reveal-wedge" aria-label="For wedding teams">
      <div className="reveal-wedge-inner">
        <span className="reveal-wedge-eyebrow">
          For wedding teams
        </span>
        <span className="reveal-wedge-line">
          From the first venue note to the final headcount.
        </span>
        <Link href="/weddings" className="reveal-wedge-link">
          See Signal Studio for weddings
          <span className="cta-arrow" aria-hidden>
            {" "}→
          </span>
        </Link>
      </div>
    </aside>
  );
}
