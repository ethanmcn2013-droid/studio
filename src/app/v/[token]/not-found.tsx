import Link from "next/link";
import { UNKNOWN_LINK_PAGE } from "@/lib/venue-invitation/copy";

/**
 * The response for an unknown, malformed or revoked token.
 *
 * `E13.16-link-and-destination-contract.md` section 6: unknown and revoked must
 * be indistinguishable, byte for byte. Both reach this page through the same
 * `notFound()` call, so there is no second template that could drift into being
 * a different answer.
 *
 * It names nothing. No venue, no cohort, no "this invitation has expired", no
 * count of anything. It says the link is not valid and offers the public page.
 */
export default function VenueInvitationNotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex flex-1 flex-col justify-center py-24"
    >
      <div className="mx-auto w-full max-w-[720px] px-6">
        <h1 className="text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
          {UNKNOWN_LINK_PAGE.heading}
        </h1>
        <p className="mt-5 text-[16px] leading-[1.65] text-ink-soft">
          {UNKNOWN_LINK_PAGE.body}
        </p>
        <p className="mt-6">
          <Link
            href={UNKNOWN_LINK_PAGE.linkHref}
            className="text-[15px] text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:decoration-accent"
          >
            {UNKNOWN_LINK_PAGE.linkLabel}
          </Link>
        </p>
      </div>
    </main>
  );
}
