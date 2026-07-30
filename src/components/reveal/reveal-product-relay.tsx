import Link from "next/link";
import { MarketingPreviewMotion } from "@/components/marketing/delight/marketing-preview-motion";
import { NotesBeforeItLeaves } from "@/components/marketing/heroes/notes/before-it-leaves";
import {
  SignalTheRead,
  type SignalReadItem,
} from "@/components/marketing/heroes/signal/the-read";
import { TasksTheBoard } from "@/components/marketing/heroes/tasks/hero";
import { HOMEPAGE_RELAY_TIMELINE_FIXTURE } from "@/components/marketing/heroes/timeline/fixture";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";
import { HomepageProofThread } from "./homepage-proof-thread";
import { ProductSignatureWordmark } from "./product-signature-wordmark";

const RELAY_SIGNAL_ITEMS: SignalReadItem[] = [
  {
    ordinal: "01",
    claim: "now",
    title: "The side room hold still needs confirmation.",
    why: "Mara approved the request in Notes. The venue reply is still open in Tasks.",
    receipts: ["Notes + Tasks", "updated today"],
    action: "Open task",
  },
  {
    ordinal: "02",
    claim: "next",
    title: "The public plan changes after confirmation.",
    why: "Once confirmed, the shared Timeline publishes the side room milestone for 30 July.",
    receipts: ["Timeline", "current share"],
    action: "Open timeline",
  },
];

const CHAPTERS = [
  {
    key: "notes",
    title: "notes",
    state: "Private source",
    artifact: "Venue can open the side room after six.",
    artifactMeta: "Mara chooses what leaves Notes",
    body: "The complete note stays private. Mara chooses the request that can become shared work.",
    caption:
      "A live Signal Notes view showing a private venue note and the approved request moving into Tasks.",
    href: PRODUCT_MARKETING_URLS.notes,
    cta: "See Signal Notes",
  },
  {
    key: "tasks",
    title: "tasks",
    state: "Owned commitment",
    artifact: "Ask the venue to hold the side room after six.",
    artifactMeta: "Owner: Mara · Open",
    body: "The approved request becomes a task with an owner, a visible state, and a place to finish it.",
    caption:
      "A live Signal Tasks view showing Mara owning the side room request as it moves to completion.",
    href: PRODUCT_MARKETING_URLS.tasks,
    cta: "See Signal Tasks",
  },
  {
    key: "timeline",
    title: "timeline",
    state: "Public milestone",
    artifact: "Side room held after six.",
    artifactMeta: "30 July · Published",
    body: "After confirmation, the public plan shows only the milestone guests need. The working trail stays private.",
    caption:
      "A live Signal Timeline view showing the side room milestone published on the wedding plan for 30 July.",
    href: PRODUCT_MARKETING_URLS.timeline,
    cta: "See Signal Timeline",
  },
  {
    key: "signal",
    title: "signal",
    state: "Sourced briefing",
    artifact: "The side room hold still needs confirmation.",
    artifactMeta: "Receipt: Notes + Tasks",
    body: "Signal returns the open question with its source and owner, so Mara can act without searching the workspace.",
    caption:
      "A live Signal briefing showing the open side room question with receipts from Notes and Tasks.",
    href: PRODUCT_MARKETING_URLS.signal,
    cta: "See Signal",
  },
] as const;

function ProductPreview({
  product,
}: {
  product: (typeof CHAPTERS)[number]["key"];
}) {
  if (product === "notes") {
    return <NotesBeforeItLeaves embedded />;
  }

  if (product === "tasks") {
    return <TasksTheBoard embedded />;
  }

  if (product === "timeline") {
    return (
      <TimelineTheLine
        embedded
        timeline={HOMEPAGE_RELAY_TIMELINE_FIXTURE}
      />
    );
  }

  return <SignalTheRead embedded items={RELAY_SIGNAL_ITEMS} />;
}

export function RevealProductRelay() {
  return (
    <section className="reveal-relay" id="system" aria-labelledby="relay-title">
      <header className="reveal-relay-head">
        <p className="reveal-relay-kicker">One detail, through the studio</p>
        <h2 id="relay-title">
          Follow one venue detail from a private note to a sourced briefing.
        </h2>
        <p>The source stays private. The confirmed part moves forward.</p>
      </header>

      <div className="reveal-relay-source" aria-label="Sample workspace context">
        <strong>Mara and Finn</strong>
        <span>The Orchard</span>
        <time dateTime="2026-07-30">30 July</time>
        <span className="reveal-relay-trust">
          Real interfaces. Fixed sample data. No customer data.
        </span>
      </div>

      <HomepageProofThread>
        <div className="reveal-relay-chapters">
          {CHAPTERS.map((chapter) => {
            const titleId = `relay-${chapter.key}-title`;
            const captionId = `relay-${chapter.key}-caption`;

            return (
              <article
                aria-labelledby={titleId}
                className="reveal-relay-chapter"
                data-product={chapter.key}
                data-proof-chapter={chapter.key}
                id={`relay-${chapter.key}`}
                key={chapter.key}
              >
                <div className="reveal-relay-copy">
                  <h3 id={titleId}>
                    <ProductSignatureWordmark product={chapter.key} />
                  </h3>
                  <div className="reveal-relay-state">
                    <p>{chapter.state}</p>
                    <blockquote>{chapter.artifact}</blockquote>
                    <span>{chapter.artifactMeta}</span>
                  </div>
                  <p className="reveal-relay-body">{chapter.body}</p>
                  <Link href={chapter.href} className="reveal-relay-link">
                    {chapter.cta}
                    <span aria-hidden>↗</span>
                  </Link>
                </div>

                <MarketingPreviewMotion
                  ariaLabelledby={captionId}
                  product={chapter.key}
                  // The chapter state and wordmark lead for 120ms. The
                  // 300ms gutter crossing then lands before the proof starts.
                  startDelayMs={420}
                >
                  <figcaption className="reveal-relay-caption" id={captionId}>
                    {chapter.caption}
                  </figcaption>
                  <div
                    aria-hidden="true"
                    className="reveal-relay-proof-visual"
                    inert
                  >
                    <ProductPreview product={chapter.key} />
                  </div>
                </MarketingPreviewMotion>
              </article>
            );
          })}
        </div>
      </HomepageProofThread>
    </section>
  );
}
