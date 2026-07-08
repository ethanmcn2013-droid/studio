import type { Metadata } from "next";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { getCopyReviewSnapshot } from "@/lib/hq/copy-review";
import { CopyReviewRoom } from "./CopyReviewRoom";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Founder Copy Review | Signal HQ",
  description: "Version-aware founder approval for Signal Studio copy.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function CopyReviewPage() {
  await requireHqAccess();
  const snapshot = await getCopyReviewSnapshot();

  return (
    <main className="hq-copy" aria-labelledby="copy-review-title">
      <CopyReviewRoom snapshot={snapshot} />
    </main>
  );
}
