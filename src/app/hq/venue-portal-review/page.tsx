import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { VenuePortalReview } from "./venue-portal-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Venue Portal review · Signal HQ",
  description:
    "Authenticated founder review of the privacy-bounded Venue Portal experience.",
  robots: { index: false, follow: false },
};

export default async function VenuePortalReviewPage() {
  await requireHqAccess();
  return <VenuePortalReview />;
}
