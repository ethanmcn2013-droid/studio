import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { CoupleWelcomeKitSheet } from "@/components/venue/couple-welcome-sheet";

/**
 * E12.13 — the post-booking couple welcome kit.
 *
 * Behind the /hq password gate. It renders with a real couple's code in it,
 * which is the strongest possible reason for this route never to be public: a
 * redemption code on a guessable URL is a redemption code somebody else uses.
 *
 * The four slots come from the query string so the founder can render one
 * couple's kit and print it without a form posting anything anywhere. Nothing
 * is stored and nothing is sent from this route.
 *
 * The words are `src/lib/couple-welcome-kit.ts`. This file adds no copy.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Couple welcome kit · Signal HQ",
  description:
    "The card, the email and the sequence a venue uses after a couple books.",
  robots: { index: false, follow: false },
};

export default async function CoupleWelcomeKitPage({
  searchParams,
}: {
  searchParams: Promise<{
    venue?: string;
    couple?: string;
    code?: string;
    from?: string;
  }>;
}) {
  await requireHqAccess();
  const params = await searchParams;

  return (
    <main id="main" tabIndex={-1} className="px-4 py-10 sm:px-8 sm:py-14">
      <CoupleWelcomeKitSheet
        slots={{
          venueName: params.venue ?? "",
          coupleGreeting: params.couple ?? "",
          code: params.code ?? "",
          senderName: params.from ?? "",
        }}
      />
    </main>
  );
}
