import Link from "next/link";
import { NotesBeforeItLeaves } from "@/components/marketing/heroes/notes/before-it-leaves";
import { SignalTheRead, type SignalReadItem } from "@/components/marketing/heroes/signal/the-read";
import { TasksTheBoard } from "@/components/marketing/heroes/tasks/hero";
import { HOMEPAGE_RELAY_TIMELINE_FIXTURE } from "@/components/marketing/heroes/timeline/fixture";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";
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
    number: "01",
    title: "notes",
    eyebrow: "Catch the source",
    body: "A venue detail lands in a private note. Only the exact line Mara approves crosses into work.",
    foot: "Private note → approved extract",
    href: PRODUCT_MARKETING_URLS.notes,
    cta: "Explore Notes",
  },
  {
    key: "tasks",
    number: "02",
    title: "tasks",
    eyebrow: "Make the commitment",
    body: "The approved line arrives as a real task in the wedding workspace, with an owner and a visible state.",
    foot: "Approved extract → assigned task",
    href: PRODUCT_MARKETING_URLS.tasks,
    cta: "Explore Tasks",
  },
  {
    key: "timeline",
    number: "03",
    title: "timeline",
    eyebrow: "Publish the right part",
    body: "When the venue confirms, the authorised milestone joins the public plan. The private work stays private.",
    foot: "Confirmed task → public milestone",
    href: PRODUCT_MARKETING_URLS.timeline,
    cta: "Explore Timeline",
  },
  {
    key: "home",
    number: "04",
    title: "home",
    eyebrow: "Know what needs you",
    body: "Back at Home, the system has read the change, the open risk, and the receipt. Today's Signal starts your day with the two things worth attention.",
    foot: "Real change → daily briefing in Home",
    href: "/features/daily-briefing",
    cta: "See the daily briefing",
  },
] as const;

function ProductPreview({ product }: { product: (typeof CHAPTERS)[number]["key"] }) {
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
        <p className="reveal-relay-kicker">One line, through the studio</p>
        <h2 id="relay-title">
          Follow one detail from a private note to a daily briefing.
        </h2>
        <p>
          Notes keeps the source private. Tasks gives it an owner. Timeline
          publishes the confirmed milestone. Home returns the open risk with
          its receipt in the daily briefing. These are static private-preview
          samples in one fixed workspace, not live customer data.
        </p>
      </header>

      <div className="reveal-relay-source" aria-label="Sample workspace context">
        <span>Sample workspace</span>
        <strong>Mara and Finn</strong>
        <span aria-hidden>·</span>
        <span>The Orchard</span>
        <span aria-hidden>·</span>
        <time dateTime="2026-07-30">30 July</time>
      </div>

      <div className="reveal-relay-chapters">
        {CHAPTERS.map((chapter) => (
          <article
            className="reveal-relay-chapter"
            data-product={chapter.key}
            key={chapter.key}
          >
            <div className="reveal-relay-copy">
              <p
                className="reveal-relay-number"
                style={{ color: "var(--zinc-600)" }}
              >
                {chapter.number}
              </p>
              <h3>
                <ProductSignatureWordmark product={chapter.key} />
              </h3>
              <p className="reveal-relay-eyebrow">{chapter.eyebrow}</p>
              <p className="reveal-relay-body">{chapter.body}</p>
              <p className="reveal-relay-foot">{chapter.foot}</p>
              <Link href={chapter.href} className="reveal-relay-link">
                {chapter.cta}
                <span aria-hidden>↗</span>
              </Link>
            </div>

            <div
              className="reveal-relay-preview"
              data-product={chapter.key}
              role="img"
              aria-label={`${chapter.title} static private-preview sample. ${chapter.body}`}
            >
              <p className="reveal-relay-sample" aria-hidden="true">
                Static private-preview sample
              </p>
              <div className="reveal-relay-artifact" aria-hidden="true" inert>
                <ProductPreview product={chapter.key} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
