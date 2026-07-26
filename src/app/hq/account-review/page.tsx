import type { Metadata } from "next";
import { listLiveVenueOptions } from "@/lib/account/live/load-venue-access";
import { listOpenSponsorRequests } from "@/lib/entitlements-db/requests";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { AccountReview } from "./account-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account review · Signal HQ",
  description:
    "Authenticated HQ review of Signal Studio Account — fixtures and live Venue access preview.",
  robots: { index: false, follow: false },
};

export default async function AccountReviewPage() {
  await requireHqAccess();
  const venues = await listLiveVenueOptions();
  const openRequests = await listOpenSponsorRequests(12);

  return (
    <AccountReview
      liveVenues={venues.ok ? venues.venues : []}
      liveVenuesError={venues.ok ? null : venues.error}
      openRequests={openRequests.ok ? openRequests.requests : []}
    />
  );
}
