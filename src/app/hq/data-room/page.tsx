import type { Metadata } from "next";
import Link from "next/link";
import { HqPageHeader } from "@/components/hq/hq-page-header";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { HqLaunchReadiness } from "@/components/hq/hq-launch-readiness";
import { DATA_ROOM, dataRoomCounts, type DataRoomItem } from "@/lib/hq/data-room";
import { getLaunchReadiness } from "@/lib/hq/launch";
import { getTraction } from "@/lib/hq/traction";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Data room · Signal HQ",
  description:
    "The one curated index for a lender, investor, or collaborator doing diligence, narrative, ask, numbers, company, product, legal, proof.",
  robots: { index: false, follow: false },
};

/**
 * /hq/data-room, the "send this one link" view. A curated, ordered subset
 * of the asset library for an outsider doing diligence, with honest ready /
 * pending states. The launch countdown sits at the top so the first thing a
 * reader sees is where the company is against its hard date.
 */
export default async function DataRoomPage() {
  await requireHqAccess();

  const traction = await getTraction();
  const readiness = getLaunchReadiness(
    traction.available ? traction.paidVenues : null,
  );
  const counts = dataRoomCounts();

  return (
    <main id="main" className="hq-page">
      <HqPageHeader
        slug="data-room"
        title="The one link."
        standfirst="Everything a lender, investor, or collaborator needs to understand Signal Studio, in the order they’d want it."
        meta={
          <span className="hq-page-head-note">
            {counts.ready} ready · {counts.pending} pending
          </span>
        }
      />

      <HqLaunchReadiness readiness={readiness} />

      <section className="hq-dr" aria-label="data room sections">
        {DATA_ROOM.map((section) => (
          <div key={section.id} className="hq-dr-section">
            <div className="hq-dr-head">
              <h2 className="hq-dr-title">{section.title}</h2>
              <p className="hq-dr-blurb">{section.blurb}</p>
            </div>
            <div className="hq-dr-ledger">
              {section.items.map((item) => (
                <DataRoomRow key={item.label} item={item} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="hq-dr-foot">
        <Link href="/hq" className="hq-dr-back">← back to Signal HQ</Link>
        <span className="hq-dr-source">source · src/lib/hq/data-room.ts</span>
      </footer>
    </main>
  );
}

function DataRoomRow({ item }: { item: DataRoomItem }) {
  const external = item.state === "external";
  const body = (
    <>
      <span className="hq-dr-state" data-state={item.state}>
        {item.state === "external" ? "public" : item.state}
      </span>
      <span className="hq-dr-label">{item.label}</span>
      <span className="hq-dr-note">{item.note}</span>
      <span className="hq-dr-action">{item.href ? "open →" : "pending"}</span>
    </>
  );

  if (!item.href) {
    return <div className="hq-dr-row hq-dr-row--static">{body}</div>;
  }
  if (external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="hq-dr-row">
        {body}
      </a>
    );
  }
  return (
    <Link href={item.href} className="hq-dr-row">
      {body}
    </Link>
  );
}
