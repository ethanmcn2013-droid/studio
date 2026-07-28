import Link from "next/link";
import { NotesBeforeItLeaves } from "@/components/marketing/heroes/notes/before-it-leaves";
import { SignalTheRead, type SignalReadItem } from "@/components/marketing/heroes/signal/the-read";
import { TasksTheBoard } from "@/components/marketing/heroes/tasks/hero";
import { HOMEPAGE_RELAY_TIMELINE_FIXTURE } from "@/components/marketing/heroes/timeline/fixture";
import { TimelineTheLine } from "@/components/marketing/heroes/timeline/the-line";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

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
    key: "signal",
    number: "04",
    title: "signal",
    eyebrow: "Know what needs you",
    body: "Signal reads the change, the open risk, and the receipt. It returns the two things worth attention.",
    foot: "Real change → sourced briefing",
    href: PRODUCT_MARKETING_URLS.signal,
    cta: "Explore Signal",
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
        <h2 id="relay-title">The system earns its place in the handoff.</h2>
        <p>
          Follow one wedding detail from a private thought to a sourced daily
          briefing. These are the current product interfaces, shown with one
          fixed sample workspace.
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
                {chapter.title}
                <span aria-hidden>·</span>
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
            >
              <p className="reveal-relay-sample">Sample product view</p>
              <ProductPreview product={chapter.key} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
