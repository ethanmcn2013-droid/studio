import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { VenueSalesDeckView } from "@/components/venue/venue-sales-deck";
import { buildVenueSalesDeck } from "@/lib/venue-sales-deck";

/**
 * E12.10 — the detailed Venue Edition sales deck.
 *
 * Behind the /hq password gate, not a public route. The deck carries a named
 * venue on the cover and the full commercial position, and it is shown in a
 * room rather than sent, so there is no reason for it to be reachable by a URL
 * anybody can guess. Disallowed in robots.txt with the rest of /hq, absent
 * from the sitemap, and noindex on its own account rather than relying on
 * either of those.
 *
 * `?venue=Glenmara+House` fills the cover. With no parameter the deck renders
 * with a placeholder and says so, because a deck shown with a placeholder on
 * the cover is a deck that was not prepared.
 *
 * The words are `src/lib/venue-sales-deck.ts`. This file adds no copy.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Venue Edition sales deck · Signal HQ",
  description:
    "The seated conversation, twenty slides, every claim traced to the decision that ratified it.",
  robots: { index: false, follow: false },
};

export default async function VenueDeckPage({
  searchParams,
}: {
  searchParams: Promise<{ venue?: string }>;
}) {
  await requireHqAccess();
  const venueName = (await searchParams).venue ?? "";
  const deck = buildVenueSalesDeck({ venueName });

  return (
    <main id="main" tabIndex={-1} className="px-4 py-10 sm:px-8 sm:py-14">
      <VenueSalesDeckView deck={deck} />
    </main>
  );
}
