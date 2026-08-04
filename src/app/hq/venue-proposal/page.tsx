import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { VenueProposalComposer } from "./composer";

/**
 * E12.09 — the one-page commercial proposal.
 *
 * The artefact is a printed page, not a public route. It carries one named
 * venue and a price, so it lives behind the /hq password gate, is disallowed
 * in robots.txt with the rest of /hq, is absent from the sitemap, and sets
 * noindex on its own account rather than relying on any of those.
 *
 * The words are `src/lib/venue-proposal.ts`. This file adds no copy.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Venue Edition proposal · Signal HQ",
  description:
    "Fill the six slots, check the page, print the proposal a venue is sent.",
  robots: { index: false, follow: false },
};

export default async function VenueProposalPage() {
  await requireHqAccess();
  return <VenueProposalComposer />;
}
