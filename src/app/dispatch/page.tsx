import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { EntryBlock } from "@/components/dispatch/entry-block";
import { readDispatchEntries } from "@/lib/changelog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The dispatch — Signal Studio",
  description:
    "What gets sent, not what accumulates. The Signal Studio suite dispatch — shipped work across Signal Tasks, Roadmap, Analytics, Notes, and the umbrella.",
  alternates: {
    types: {
      "application/rss+xml": "/changelog.rss",
    },
  },
};

function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const parts = text.split(/(\*[^*]+\*|`[^`]+`)/g);
  parts.forEach((part, i) => {
    if (part.startsWith("**")) {
      out.push(<strong key={i}>{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      out.push(
        <em key={i} className="italic text-ink-soft">
          {part.slice(1, -1)}
        </em>,
      );
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push(
        <code key={i} className="font-mono text-[13px] text-ink-soft">
          {part.slice(1, -1)}
        </code>,
      );
    } else if (part) {
      out.push(part);
    }
  });
  return out;
}

function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
}

export default async function DispatchPage() {
  const entries = await readDispatchEntries();

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          <div
            className="mb-6 font-mono text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            the dispatch
          </div>

          <h1 className="h-section mb-6 max-w-[620px] text-balance text-ink">
            What gets sent, not what accumulates.
          </h1>

          <p
            className="mb-4 max-w-[58ch] leading-[1.6] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Shipped work across the suite — Signal Tasks, Roadmap, Analytics,
            Notes, and the umbrella. Updated when something is worth saying out
            loud.
          </p>

          <p
            className="mb-2 font-mono text-[12px] text-ink-quiet"
            style={{ letterSpacing: "0.01em" }}
          >
            (It&apos;s the changelog. This one&apos;s for the nerds — you know
            who you are. Everyone else: the product just got better.)
          </p>

          <p className="mb-12 max-w-[58ch] text-[13.5px] leading-[1.6] text-ink-quiet">
            Subscribe via{" "}
            <a
              href="/changelog.rss"
              className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              RSS
            </a>
            .
          </p>

          {entries.length === 0 ? (
            <p className="max-w-[58ch] text-[15px] leading-[1.6] text-ink-soft">
              Nothing has shipped that's worth saying out loud yet. Subscribe
              via RSS and you'll get it when it arrives.
            </p>
          ) : (
            <div className="space-y-16">
              {entries.map((entry, i) => (
                <EntryBlock
                  key={`${entry.date}-${i}`}
                  entry={entry}
                  boldLeadNode={entry.boldLead ? renderInline(entry.boldLead) : null}
                  bodyNodes={paragraphs(entry.body).map((p, pi) => (
                    <p key={pi}>{renderInline(p)}</p>
                  ))}
                />
              ))}
            </div>
          )}

          <div className="mt-24 border-t border-border-soft pt-6 text-[13px] leading-[1.6] text-ink-quiet">
            Engineering detail lives in each repo. This page is the
            operator-voice version. Convention:{" "}
            <a
              href="/brand"
              className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              brand §6.5
            </a>
            .
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
