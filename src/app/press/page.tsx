import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import {
  TASKS_URL,
  ROADMAP_URL,
  ANALYTICS_URL,
  NOTES_URL,
} from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Press — Signal Studio",
  description:
    "Boilerplates, founder bio, brand assets, and a press contact who answers within a day.",
};

const LAST_UPDATED = "2026-05-12";

export default function PressPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <article className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{
              color: "var(--accent)",
              letterSpacing: "var(--tracking-eyebrow)",
              fontFamily: "var(--font-mono-stack)",
            }}
          >
            Press
          </div>

          <h1 className="h-section mb-3 max-w-[620px] text-balance text-ink">
            For writers and producers.
          </h1>

          <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            Last updated {LAST_UPDATED}
          </p>

          <div className="space-y-12 text-[15.5px] leading-[1.7] text-ink-soft">
            <p>
              Signal Studio is a small suite of four products for the
              80&thinsp;% of the world that doesn&apos;t work in tech.
              Below are the boilerplates, brand assets, and founder bio
              you might need. If something&rsquo;s missing, email and
              we&rsquo;ll send it back the same day.
            </p>

            <Section title="One-line description">
              <Quote>
                Signal Studio is a four-product suite — Tasks, Roadmap,
                Analytics, Notes — that brings operational clarity to the
                eighty percent of the world who don&rsquo;t work in tech.
              </Quote>
            </Section>

            <Section title="Boilerplate — 50 words">
              <Quote>
                Signal Studio is a four-product suite built for everyone the
                productivity category ignored: wedding planners, freelancers,
                tradespeople, students, small-business operators. Signal
                Tasks runs the work. Roadmap explains it publicly. Analytics
                surfaces what needs attention today. Notes captures the
                thinking that comes before all of it. Plain English. No
                sprints. No per-seat bill.
              </Quote>
            </Section>

            <Section title="Boilerplate — 150 words">
              <Quote>
                Signal Studio is a suite of four small, opinionated products
                designed for the eighty percent of working people who do not
                live inside a software stack. Signal Tasks renders the same
                to-do list as a board, list, timeline, or calendar — switch
                lenses without re-entering anything. Signal Roadmap is a
                public roadmap your customers can actually read, written in
                plain English. Signal Analytics is a daily briefing that
                names what needs your attention today — no LLM in the path,
                every sentence written by hand. Signal Notes is a private
                capture surface that promotes to Tasks when the thinking is
                ready. The suite shares one register and one accent colour.
                The roadmap is public. The principles page lists features
                that will never ship. Designed and shipped by Ethan
                McNamara, a designer in Dublin.
              </Quote>
            </Section>

            <Section title="Boilerplate — 400 words">
              <Quote>
                Signal Studio is a four-product suite designed for the
                eighty percent of working people the productivity category
                left behind. The suite is built around a single argument:
                that twenty years of project-management software has been
                written by tech companies for other tech companies, then
                sold downmarket with the vocabulary unchanged — and that
                this is why wedding planners, freelance designers,
                tradespeople, students, and small-business operators keep
                churning out of every tool they try.
                {"\n\n"}
                The four products each do one thing. Signal Tasks is a live
                workspace that renders the same items as a board, a list, a
                timeline, or a calendar — switch lenses without re-entering
                anything, with real-time presence and shareable read-only
                views on the free tier. Signal Roadmap is a public roadmap
                your customers can read at midnight on a phone — plain
                English, one link, no login. Signal Analytics is a daily
                briefing that surfaces what needs your attention today: a
                rules engine reads your Tasks workspace overnight,
                identifies held-up work, overdue items, and quiet risks,
                and writes the briefing in language drawn from a
                hand-curated phrasing library. No LLM in the path. Signal
                Notes is a private capture surface for the half-formed
                thought; it promotes selectively into Tasks when the
                thinking is ready to act on, but raw notes never leave the
                notebook.
                {"\n\n"}
                The four products share one register, one accent colour,
                one footer pattern, one cross-product nav. The brand
                discipline is the moat: every page, every empty state,
                every error message passes through the same voice, and
                every product publishes its locked refusals — features the
                product will not ship, regardless of customer ask.
                {"\n\n"}
                Signal Studio is operated by Ethan McNamara, a designer in
                Dublin, who spent years inside enterprise software watching
                the wrong people get charged for the wrong things. The
                suite ships in cycles, in public, against its own roadmap.
                signalstudio.ie. hello@signalstudio.ie.
              </Quote>
            </Section>

            <Section title="The four products">
              <ul className="space-y-2 text-[15px]">
                <li>
                  <ExternalLink href={TASKS_URL}>Signal Tasks</ExternalLink> —
                  execution clarity. Board, list, timeline, calendar over the
                  same items.
                </li>
                <li>
                  <ExternalLink href={ROADMAP_URL}>Signal Roadmap</ExternalLink>{" "}
                  — direction clarity. Public roadmaps customers can read.
                </li>
                <li>
                  <ExternalLink href={ANALYTICS_URL}>Signal Analytics</ExternalLink>{" "}
                  — attention clarity. A daily briefing, no LLM in the path.
                </li>
                <li>
                  <ExternalLink href={NOTES_URL}>Signal Notes</ExternalLink> —
                  capture clarity. Private by design; promotes selectively to
                  Tasks.
                </li>
              </ul>
            </Section>

            <Section title="Founder bio — 50 words">
              <Quote>
                Ethan McNamara is the designer and solo founder behind
                Signal Studio. He built the suite after watching Notion
                become a wiki, Asana become enterprise software, and the
                rest of the productivity category turn into a vocabulary
                tax. Previously designed inside large product organisations;
                now ships in cycles, in public, from Dublin.
              </Quote>
            </Section>

            <Section title="Brand assets">
              <p>
                Logos, OG cards, and screenshots — direct links, no asset
                request form.
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>
                  <ExternalLink href="https://signalstudio.ie/opengraph-image">
                    Umbrella OG card (1200×630, PNG)
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://signalstudio.ie/icon">
                    Umbrella icon
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href={TASKS_URL}>Signal Tasks — live</ExternalLink>{" "}
                  (open in browser, screenshot freely)
                </li>
                <li>
                  <ExternalLink href={ROADMAP_URL}>Signal Roadmap — live</ExternalLink>
                </li>
                <li>
                  <ExternalLink href={ANALYTICS_URL}>Signal Analytics — live</ExternalLink>
                </li>
              </ul>
              <p className="mt-3">
                Wordmark SVG, per-product marks, and the full brand kit
                (light and dark, PNG and SVG) on request — email below.
              </p>
            </Section>

            <Section title="Press contact">
              <p>
                <ExternalLink href="mailto:hello@signalstudio.ie">
                  hello@signalstudio.ie
                </ExternalLink>
                . Replies within twenty-four hours, including weekends if
                the deadline is real. No publicist between us.
              </p>
            </Section>

            <Section title="Recent coverage">
              <p>None yet. Links will land here as they do.</p>
            </Section>

            <p className="border-t border-border-soft pt-6 text-[14px] text-ink-quiet">
              No publicist. No PR firm. No embargo dance. The email above
              goes to the person who designed and shipped the suite.
            </p>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="rounded-xl border border-border-soft px-5 py-4 text-[15px] leading-[1.65] text-ink"
      style={{ background: "var(--bg-elev, white)" }}
    >
      {children}
    </blockquote>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      className="text-ink underline decoration-1 underline-offset-2 transition-opacity hover:opacity-70"
      {...(isExternal
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
    >
      {children}
    </a>
  );
}

