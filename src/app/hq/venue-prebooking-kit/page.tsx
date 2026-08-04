import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { VenuePrebookingKitSheet } from "@/components/venue/venue-prebooking-kit-sheet";

/**
 * E12.12 — the pre-booking venue sales kit.
 *
 * Behind the /hq password gate for review. The artefact itself is handed to a
 * venue as a digital pack (D-018), so this route is where the founder reads it
 * and prints it, not where a venue reads it.
 *
 * It is gated rather than public for one reason: the kit contains the sentence
 * set for a venue's own brochure and website, and a public page carrying
 * approved words for somebody else's marketing is a page that gets found,
 * quoted and reused by a venue that never signed anything.
 *
 * The words are `src/lib/venue-prebooking-kit.ts`. This file adds no copy.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pre-booking venue kit · Signal HQ",
  description:
    "What a venue says about the workspace before a couple books, per channel, with the never-list per channel.",
  robots: { index: false, follow: false },
};

export default async function VenuePrebookingKitPage() {
  await requireHqAccess();
  return (
    <main id="main" tabIndex={-1} className="px-4 py-10 sm:px-8 sm:py-14">
      <VenuePrebookingKitSheet />
    </main>
  );
}
