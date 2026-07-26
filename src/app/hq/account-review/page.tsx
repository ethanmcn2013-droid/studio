import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { AccountReview } from "./account-review";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account review · Signal HQ",
  description:
    "Authenticated founder review of Signal Studio Account design concepts and deterministic fixtures.",
  robots: { index: false, follow: false },
};

export default async function AccountReviewPage() {
  await requireHqAccess();
  return <AccountReview />;
}
