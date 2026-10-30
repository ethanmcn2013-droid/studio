import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { CopyableQuote } from "@/components/press/copyable-quote";

/* Rendered per request, as before. Until round 3 of the home page (2026-10-02)
   the root layout read a request header, which made every route dynamic
   without saying so. The layout no longer does, so that only `/` changes,
   this route says it here. Making it static is a separate decision. */
export const dynamic = "force-dynamic";

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
                  "Signal Studio is one plain-English app for running real work, built for the 80% of people who don’t work in tech.",
                ]}
              />
            </Section>

            <Section title="Boilerplate: 50 words">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio makes project management for people who don’t work in tech: wedding venues, schools, tradespeople, studios, small businesses. One app shows what needs doing, every date in order, whether you are on pace, and every file in one place. All of it in plain English. Built in Limerick, Ireland.",
                ]}
              />
            </Section>

            <Section title="Boilerplate: 150 words">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio is project management for the eighty percent of working people who don’t live inside a software stack. It is one app. A board shows what needs doing, who has it and what is running late. A timeline puts every date in order and counts down to the one that matters. A plain read says whether the work is on pace, and why. Quotes, contracts and photos stay with the job they belong to, and a chat changes the plan only when you approve it. Venues and schools can gift an account to every couple they book or every teacher on their staff. Everything shares one typeface, one accent colour, and one rule: if a sentence needs translating, it gets rewritten. Built and run by one person, Ethan McNamara, in Limerick, Ireland.",
                ]}
              />
            </Section>

            <Section title="Boilerplate: 400 words">
              <CopyableQuote
                paragraphs={[
                  "Signal Studio is project management for the eighty percent of working people the productivity category left behind. It runs on a single argument. Twenty years of project-management software has been written by tech companies for other tech companies, then sold downmarket with the vocabulary unchanged. That is why wedding planners, teachers, tradespeople, studios and small-business owners keep churning out of every tool they try.",
                  "Signal Studio is one app, and it describes itself by what it does. A board shows what needs doing, who has it and what is running late. A timeline puts every date in order and counts down to the one that matters. A plain read says whether the work is on pace, with the reason, before it becomes a problem. Quotes, contracts and photos are kept with the job they belong to. A chat takes a request in your own words and shows the change before anything moves; nothing changes until you approve it.",
                  "It is sold to the organisations that hold the relationship. A wedding venue or a school pays one subscription and gifts an account to every couple it books or every teacher on its staff. The people who receive an account never pay. Individuals can subscribe on their own.",
                  "Every page, every empty state and every error message reads the same way: plain English, no jargon, no exclamation marks. The company publishes what it refuses to build, whatever customers ask.",
                  "Signal Studio is built and run by one person, Ethan McNamara, in Limerick, Ireland. Access opens through the waitlist. signalstudio.ie. hello@signalstudio.ie.",
                ]}
              />
            </Section>

            <Section title="What it does">
              <ul className="space-y-2 text-[15px]">
                <li>Board. What needs doing, who has it, and what is running late.</li>
                <li>Timeline. Every date in order, counting down to the one that matters.</li>
                <li>Pace. Whether you are on track, said plainly, with the reason.</li>
                <li>Files. Quotes, contracts and photos, kept with the job.</li>
                <li>Chat. Ask in your own words; nothing changes until you approve it.</li>
              </ul>
              <p className="mt-3">
                <ExternalLink href={waitlistHref("press")}>Join the waitlist</ExternalLink>.
              </p>
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
                principles behind the system are at{" "}
                <ExternalLink href="https://signalstudio.ie/principles">
                  signalstudio.ie/principles
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

