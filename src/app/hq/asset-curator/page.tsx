import type { Metadata } from "next";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { AssetCurator } from "@/components/hq/asset-curator";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  CURATOR_ASSETS,
  CURATOR_CATEGORIES,
  DEFAULT_PREFERRED_ASSET_IDS,
} from "@/lib/hq/asset-curator-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Asset Curator · Signal HQ",
  description: "Review, shortlist, and export Signal Studio's preferred visual directions.",
  robots: { index: false, follow: false },
};

export default async function AssetCuratorPage() {
  await requireHqAccess();

  return (
    <div className="hqx-page">
      <HqPageHeader
        slug="asset-curator"
        title="Lock the visual canon."
        standfirst="Your chosen canon is separated from the review queue. Browse every retained visual and Remotion hook, refine the set, then export an exact reference brief for future work."
        meta={
          <span className="hq-page-head-note">
            {CURATOR_ASSETS.length} directions · {DEFAULT_PREFERRED_ASSET_IDS.length} preferred · {CURATOR_CATEGORIES.length} collections
          </span>
        }
      />
      <AssetCurator />
    </div>
  );
}
