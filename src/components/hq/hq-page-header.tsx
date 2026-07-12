import Link from "next/link";
import { findGroup, findRoom, type HqRoom } from "@/lib/hq/rooms";

/**
 * The shared HQ page header (docs/HQ_ARCHITECTURE.md §6) — one anatomy
 * for every non-artifact room: back-to-group line, eyebrow with the
 * indigo dot, one h1, a one-sentence standfirst, and an optional meta
 * row. Registry-driven: pass the room slug and the group/eyebrow resolve
 * themselves, so a rename in rooms.ts renames the page.
 *
 * Artifact rooms (decks, galleries, the org console) are exempt by
 * design — they own their composition. Everything else uses this.
 */
export function HqPageHeader({
  slug,
  title,
  standfirst,
  meta,
}: {
  /** Registry slug; resolves group + name. */
  slug: string;
  /** Override the h1 (defaults to the registry name). */
  title?: string;
  /** One plain sentence under the title (defaults to registry summary). */
  standfirst?: string;
  /** Optional meta row content (status pill, updated date). */
  meta?: React.ReactNode;
}) {
  const room: HqRoom | undefined = findRoom(slug);
  const group = room ? findGroup(room.group) : undefined;
  const backHref = group ? group.route : "/hq";
  const backLabel = group ? group.label : "today";

  return (
    <header className="hq-page-head">
      <Link href={backHref} className="hq-page-head-back">
        ← {backLabel}
      </Link>
      <p className="hq-page-head-eyebrow">
        <span className="hq-page-head-dot" aria-hidden="true" />
        {group ? `${group.label} · ` : ""}
        {room?.kind ?? "room"}
      </p>
      <h1 className="hq-page-head-title">{title ?? room?.name ?? slug}</h1>
      <p className="hq-page-head-standfirst">
        {standfirst ?? room?.summary ?? ""}
      </p>
      {meta ? <div className="hq-page-head-meta">{meta}</div> : null}
    </header>
  );
}
