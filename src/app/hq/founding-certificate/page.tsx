import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { FoundingCertificateSheet } from "@/components/venue/founding-certificate-sheet";
import { buildFoundingCertificate } from "@/lib/founding-certificate";

/**
 * E12.11 — the Founding Venue certificate.
 *
 * Behind the /hq password gate. The certificate names a venue and states a
 * place in the programme, so it is never public and never guessable.
 *
 * ── Why the number comes from the query string and not from a form ──────
 * Because it comes from the register, and the register is not this route's to
 * read. `?number=` is the founder transcribing a number that the entitlements
 * record already holds, which keeps this surface a renderer rather than a
 * second place a founding number can be created. If the number is wrong here,
 * the certificate is wrong and the register is still right, which is the safe
 * direction for that error to run.
 *
 * The one rule the render cannot be talked out of: with no cleared payment
 * date and no number, `buildFoundingCertificate` refuses and the page prints
 * the refusal. There is no blank certificate and no blank number field.
 *
 * The words are `src/lib/founding-certificate.ts`. This file adds no copy.
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founding Venue certificate · Signal HQ",
  description:
    "The certificate for a founding place, which cannot be produced before the payment clears.",
  robots: { index: false, follow: false },
};

export default async function FoundingCertificatePage({
  searchParams,
}: {
  searchParams: Promise<{
    venue?: string;
    number?: string;
    cleared?: string;
    plan?: string;
  }>;
}) {
  await requireHqAccess();
  const params = await searchParams;
  const parsed = Number.parseInt(params.number ?? "", 10);

  const certificate = buildFoundingCertificate({
    venueName: params.venue ?? "",
    foundingNumber: Number.isNaN(parsed) ? null : parsed,
    paymentClearedOn: params.cleared ?? "",
    venuePlan: params.plan ?? "founding",
  });

  return (
    <main id="main" tabIndex={-1} className="px-4 py-10 sm:px-8 sm:py-14">
      <FoundingCertificateSheet certificate={certificate} />
    </main>
  );
}
