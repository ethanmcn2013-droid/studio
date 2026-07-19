import type { Metadata } from "next";
import Link from "next/link";
import { HqLabGallery } from "@/components/hq/hq-lab-gallery";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { MAKE_LABS } from "@/lib/hq/make-labs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab · Signal HQ",
  description: "Every lab, room, gallery, and shipped hero — with a live thumbnail.",
  robots: { index: false, follow: false },
};

export default async function MakePage() {
  await requireHqAccess();

  const live = MAKE_LABS.filter((l) => l.state === "LIVE" || l.state === "SHIPPED").length;

  return (
    <div className="hqx-page">
      <header className="hqx-page-header">
        <span className="hqx-eyebrow">Lab · Design &amp; product</span>
        <div className="hqx-page-header-row">
          <h1 className="hqx-title">Every lab, at a glance</h1>
          <span className="hqx-status" data-tone="done">
            <span className="hqx-dot" />
            {MAKE_LABS.length} labs · {live} live
          </span>
        </div>
        <p className="hqx-lede">
          Product heroes, decision rooms, brand galleries, systems, and parked directions — each
          with an active thumbnail so the work is scannable, not a list. Nothing is thrown away.
        </p>
      </header>

      <HqLabGallery />

      <div className="hqx-banner" data-tone="accent">
        <span className="hqx-banner-mark" />
        <div className="hqx-banner-body">
          <span className="hqx-banner-kicker">How the lab works</span>
          <span className="hqx-banner-text">
            A direction earns the front page or it waits on its branch. Parked work is never
            deleted, so the record of how each hero was found stays intact and any runner-up can
            be brought back. Thumbnails refresh via <code>scripts/hq-redesign/lab-thumbs.mjs</code>.
          </span>
        </div>
        <Link href="/hq/experimentation-room" className="hqx-btn hqx-btn--ghost">Lab registry →</Link>
      </div>
    </div>
  );
}
