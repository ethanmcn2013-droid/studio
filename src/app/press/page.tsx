import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { CopyableQuote } from "@/components/press/copyable-quote";

export const metadata: Metadata = {
  title: "Press · Signal Studio",
  description:
    "Boilerplates, founder bio, brand assets, and a press contact who answers within a day.",
};

type CoverageItem = { title: string; outlet: string; href: string; date: string };

// Add entries here as coverage lands. Date format: YYYY-MM-DD.
const COVERAGE: CoverageItem[] = [];

// Derive the most recent coverage date; undefined when no coverage yet.
const lastCoverageDate: string | undefined =
  COVERAGE.length > 0
    ? COVERAGE.slice().sort((a, b) => b.date.localeCompare(a.date))[0].date
    : undefined;

function waitlistHref(product: string): string {
  return `/waitlist?source=press&campaign=pre_access_waitlist&product=${product}&artifact=press_${product}&touch=site`;
}

export default function PressPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
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

          {lastCoverageDate ? (
            <p className="mb-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
              Last updated {lastCoverageDate}
            </p>
          ) : (
            <p
              className="mb-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint"
            >
              No coverage filed yet.
            </p>
          )}

          <div className="space-y-12 text-[15.5px] leading-[1.7] text-ink-soft">
            <p>
              Everything a writer needs, on one page. Boilerplates, brand
              assets, the founder bio. If something&rsquo;s missing, email
              and you&rsquo;ll have it the same day.
            </p>

            <Section title="One-line description">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio is four small products: Notes, Tasks, Timeline, Signal. Together they give people outside tech a clear view of their work, in plain English.",
                ]}
              />
            </Section>

            <Section title="Boilerplate: 50 words">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio makes work software for people who don’t work in tech: wedding planners, tradespeople, freelancers, students, small businesses. Notes captures ideas. Tasks runs the work. Timeline shows the plan. Signal reports what changed. All of it in plain English. Launching 1 September 2026, from Limerick, Ireland.",
                ]}
              />
            </Section>

            <Section title="Boilerplate: 150 words">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio is a suite of four small products for the eighty percent of working people who don’t live inside a software stack. Signal Tasks shows the same work as a board, a list, a timeline, or a calendar. Switch views without re-entering anything. Signal Timeline is a plan your customers can actually read: one public link, plain English, no login. Signal is a daily briefing that names what needs your attention today. Every sentence comes from a hand-written phrasing library. Nothing is machine-written. Signal Notes is a private notebook that hands a thought to Tasks when it’s ready to become work. Everything shares one typeface, one accent colour, and one rule: if a sentence needs translating, it gets rewritten. Built and run by one person, Ethan McNamara, in Limerick, Ireland. The roadmap is public, and every product says what it will never do.",
                ]}
              />
            </Section>

            <Section title="Boilerplate: 400 words">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio is a four-product suite for the eighty percent of working people the productivity category left behind. It runs on a single argument. Twenty years of project-management software has been written by tech companies for other tech companies, then sold downmarket with the vocabulary unchanged. That is why wedding planners, freelance designers, tradespeople, students, and small-business owners keep churning out of every tool they try.",
                  "The four products each do one thing. Signal Tasks is a live workspace that shows the same items as a board, a list, a timeline, or a calendar. Switch views without re-entering anything, with real-time presence and shareable read-only views on the free tier. Signal Timeline is a public plan your customers can read at midnight on a phone: plain English, one link, no login. Signal is a daily briefing that surfaces what needs your attention today. A rules engine reads your Tasks workspace overnight, finds held-up work, overdue items, and quiet risks, and writes the briefing from a hand-curated phrasing library. Nothing is machine-written. Signal Notes is a private notebook for the half-formed thought. It hands the thought to Tasks when it’s ready to become work, and raw notes never leave the notebook.",
                  "The four products share one typeface, one accent colour, one voice. Every page, every empty state, every error message reads the same way, and every product publishes the features it will never ship, whatever the customer asks. The roadmap is public.",
                  "Signal Studio is built and run by one person, Ethan McNamara, in Limerick, Ireland. The products launch 1 September 2026. signalstudio.ie. hello@signalstudio.ie.",
                ]}
              />
            </Section>

            <Section title="The four products">
              <ul className="space-y-2 text-[15px]">
                <li>
                  <ExternalLink href={waitlistHref("tasks")}>Signal Tasks</ExternalLink>.
                  Execution clarity. Board, list, timeline, calendar over the
                  same items.
                </li>
                <li>
                  <ExternalLink href={waitlistHref("timeline")}>Signal Timeline</ExternalLink>.
                  Direction clarity. Public timelines customers can read.
                </li>
                <li>
                  <ExternalLink href={waitlistHref("signal")}>Signal</ExternalLink>.
                  Attention clarity. A daily briefing. Nothing machine-written.
                </li>
                <li>
                  <ExternalLink href={waitlistHref("notes")}>Signal Notes</ExternalLink>.
                  Capture clarity. Private by design. Hands thoughts to Tasks
                  when they&rsquo;re ready.
                </li>
              </ul>
            </Section>

            <Section title="Brand assets">
              <p>
                Direct downloads, no request form. Wordmarks, product marks,
                lockups, and app icons, SVG and PNG, with usage notes in the
                README:{" "}
                <ExternalLink href="https://signalstudio.ie/brand/kit/README.md">
                  the kit
                </ExternalLink>
                . Product access is staged through the waitlist; screenshots
                are available on request until the access window opens. The
                design system itself is at{" "}
                <ExternalLink href="https://signalstudio.ie/design">
                  signalstudio.ie/design
                </ExternalLink>
                .
              </p>
            </Section>

            <Section title="Founder bio: 50 words">
              <CopyableQuote
                paragraphs={[
                  "Ethan McNamara is the founder of Signal Studio and builds all of it: the design, the code, and the words. He started it for the people project software ignores, the 80% who don’t work in tech. He lives and works in Limerick, Ireland.",
                ]}
              />
            </Section>

            <Section title="Press contact">
              <p>
                <ExternalLink href="mailto:hello@signalstudio.ie">
                  hello@signalstudio.ie
                </ExternalLink>
                . Replies within a day, sooner if you&rsquo;re on deadline.
              </p>
            </Section>

            {COVERAGE.length > 0 ? (
              <Section title="Recent coverage">
                <ul className="space-y-2 text-[15px]">
                  {COVERAGE.map((item) => (
                    <li key={item.href}>
                      <ExternalLink href={item.href}>{item.title}</ExternalLink>
                      {" · "}
                      <span className="text-ink-quiet">{item.outlet}, {item.date}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            ) : null}

            <p className="border-t border-border-soft pt-6 text-[14px] text-ink-quiet">
              No publicist. The email goes to the person who built
              everything on this page.
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

