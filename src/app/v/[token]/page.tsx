import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  recordVenueLinkReplaced,
  recordVenuePageView,
} from "@/lib/venue-invitation/event";
import {
  getVenueInvitationRegistry,
  resolveVenueInvitationLink,
} from "@/lib/venue-invitation/links";
import { InvitationState, ProposalState, ReplacedState } from "./states";

/**
 * `/v/<token>` — the private per-venue page.
 *
 * `E13.16-link-and-destination-contract.md` is the contract in full:
 *   §1  the URL carries a bare token and no query string (D-032 R13)
 *   §3  one page, two states: invitation first, proposal after a conversation
 *   §4  the render is the click, and exactly seven fields are recorded
 *   §6  unknown and revoked are byte-identical 404s and record nothing
 *   §7  no third-party script, carved out in one place (`lib/venue-invitation/paths`)
 *   §12 a replaced token returns 200 and the replacement page
 *
 * The venue's name is on the page and nowhere else: not in the URL, not in the
 * metadata, not in a link preview. A private invitation gets forwarded, pasted
 * into chat threads and unfurled by every service on the way, and a name that
 * has already been sent cannot be recalled (§1.1's reasoning, applied to the
 * one surface it did not name).
 */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal Studio",
  // §3.1: noindex, nofollow. `/v/` is also disallowed in robots.ts and absent
  // from the sitemap, because a private invitation must not become a search
  // result naming a venue that has not agreed to anything.
  robots: { index: false, follow: false, nocache: true },
};

export default async function VenueInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const registry = getVenueInvitationRegistry();
  const link = resolveVenueInvitationLink(registry, token);

  // Unknown, malformed and revoked all land here, identically, and record
  // nothing. A route that answers "no such link" differently from "that link
  // was withdrawn" is an oracle (§6).
  if (link === null) notFound();

  if (link.status === "replaced") {
    // §12.6: one structured server log line, no `venue_page_viewed`. A page
    // nobody meant to open is not a film view.
    recordVenueLinkReplaced({ accountId: link.accountId });
    return <ReplacedState />;
  }

  recordVenuePageView({
    accountId: link.accountId,
    cohort: link.cohort,
    touch: link.touch,
    state: link.state,
  });

  return link.state === "proposal" ? (
    <ProposalState link={link} />
  ) : (
    <InvitationState link={link} />
  );
}
