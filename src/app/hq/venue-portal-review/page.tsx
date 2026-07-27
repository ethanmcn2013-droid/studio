import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireHqAccess } from "@/lib/hq/access-guard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account review · Signal HQ",
  description:
    "Legacy Venue Portal review URL. Redirects to Signal Studio Account review.",
  robots: { index: false, follow: false },
};

/** Preserve existing review links after the Account V2 rename. */
export default async function VenuePortalReviewRedirectPage() {
  await requireHqAccess();
  redirect("/hq/account-review");
}
