import type { Metadata } from "next";
import Link from "next/link";
import { requireHqAccess } from "@/lib/hq/access-guard";
import { DECKS, deckThumb, type Deck } from "@/lib/hq/decks";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Decks · Signal HQ",
  description: "Every board, sales, and diligence deck — with a live thumbnail.",
  robots: { index: false, follow: false },
};

const STATE_TONE: Record<string, string> = {
  READY: "done",
  WORKING: "flight",
  SOURCE: "quiet",
  GATED: "accent",
};

function DeckCard({ deck }: { deck: Deck }) {
  const thumb = deckThumb(deck);
  const inner = (
    <>
      <div
        className="hqx-lab-thumb"
        data-cat="deck"
        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
      >
        {!thumb ? <span className="hqx-lab-monogram">{deck.name.slice(0, 2).toUpperCase()}</span> : null}
        <span className="hqx-pill hqx-lab-state" data-tone={STATE_TONE[deck.state] ?? "quiet"}>{deck.state}</span>
        {deck.meta ? <span className="hqx-deck-meta">{deck.meta}</span> : null}
        {deck.external ? <span className="hqx-lab-ext" aria-hidden="true">↗</span> : null}
      </div>
      <div className="hqx-lab-body">
        <span className="hqx-lab-name">{deck.name}</span>
        <span className="hqx-lab-note">{deck.note}</span>
        <span className="hqx-lab-where">{deck.audience}</span>
      </div>
    </>
  );
  return deck.external ? (
    <a href={deck.href} target="_blank" rel="noreferrer" className="hqx-lab-card">{inner}</a>
  ) : (
    <Link href={deck.href} className="hqx-lab-card">{inner}</Link>
  );
}

export default async function DecksPage() {
  await requireHqAccess();

  return (
    <div className="hqx-page">
      <header className="hqx-page-header">
        <span className="hqx-eyebrow">Knowledge · Decks</span>
        <div className="hqx-page-header-row">
          <h1 className="hqx-title">The deck library</h1>
          <span className="hqx-status" data-tone="done">
            <span className="hqx-dot" />
            {DECKS.length} decks
          </span>
        </div>
        <p className="hqx-lede">
          Every board, sales, and diligence deck in one place, each with an active thumbnail. Open
          a deck to present it; every one routes back to the live numbers in Reporting.
        </p>
      </header>

      <div className="hqx-lab-grid">
        {DECKS.map((deck) => <DeckCard key={deck.id} deck={deck} />)}
      </div>
    </div>
  );
}
