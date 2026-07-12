import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireHqAccess } from "@/lib/hq/access-guard";
import {
  activeRooms,
  findGroup,
  findRoom,
  HQ_GROUP_SEGMENTS,
  shelvedRooms,
  type HqGroupKey,
} from "@/lib/hq/rooms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Signal HQ",
  robots: { index: false, follow: false },
};

/**
 * Group landing pages — /hq/sell, /hq/make, /hq/money, /hq/company.
 * Registry-rendered (docs/HQ_ARCHITECTURE.md §5.2): active rooms as
 * cards, decided/archived rooms collapsed into the shelf. A nav label
 * always lands here, never on a single room.
 */
export default async function GroupLandingPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  await requireHqAccess();
  const { group: segment } = await params;
  if (!(HQ_GROUP_SEGMENTS as readonly string[]).includes(segment)) {
    notFound();
  }
  const key = segment as HqGroupKey;
  const group = findGroup(key)!;
  const rooms = activeRooms(key);
  const shelf = shelvedRooms(key);

  return (
    <main className="hq-group">
      <header className="hq-page-head">
        <Link href="/hq" className="hq-page-head-back">
          ← today
        </Link>
        <p className="hq-page-head-eyebrow">
          <span className="hq-page-head-dot" aria-hidden="true" />
          signal hq · group
        </p>
        <h1 className="hq-page-head-title">{group.name}</h1>
        <p className="hq-page-head-standfirst">{group.gloss}</p>
        <div className="hq-page-head-meta">
          <span className="hq-page-head-note">
            {rooms.length} active {rooms.length === 1 ? "room" : "rooms"}
            {shelf.length > 0 ? ` · ${shelf.length} on the shelf` : ""}
          </span>
        </div>
      </header>

      <div className="hq-group-grid">
        {rooms.map((room) => {
          const child = room.slug === "atlas" ? findRoom("atlas-map") : undefined;
          return (
            <Link key={room.slug} href={room.route} className="hq-group-card">
              <span className="hq-group-card-kind">{room.kind}</span>
              <span className="hq-group-card-name">{room.name}</span>
              <span className="hq-group-card-summary">{room.summary}</span>
              <span className="hq-group-card-action">
                open{child ? " · map inside" : ""} →
              </span>
            </Link>
          );
        })}
      </div>

      {shelf.length > 0 ? (
        <section className="hq-group-shelf" aria-labelledby={`shelf-${key}`}>
          <h2 id={`shelf-${key}`} className="hq-page-head-eyebrow">
            <span className="hq-page-head-dot" aria-hidden="true" />
            the shelf — decided, kept
          </h2>
          <ul className="hq-group-shelf-list">
            {shelf.map((room) => (
              <li key={room.slug}>
                <Link href={room.route} className="hq-group-shelf-row">
                  <span className="hq-group-shelf-name">{room.name}</span>
                  <span className="hq-group-shelf-summary">{room.summary}</span>
                  <span className="hq-group-shelf-state">{room.lifecycle}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
