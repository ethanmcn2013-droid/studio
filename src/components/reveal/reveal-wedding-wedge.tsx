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
          <span className="reveal-wedge-dot" aria-hidden />
          For wedding teams
        </span>
        <span className="reveal-wedge-sep" aria-hidden>
          ·
        </span>
        <span className="reveal-wedge-line">
          Plans, tasks, briefings, and a public timeline, ready to use.
        </span>
        <Link href="/weddings" className="reveal-wedge-link">
          See it for weddings
          <span className="cta-arrow" aria-hidden>
            {" "}→
          </span>
        </Link>
      </div>
    </aside>
  );
}
