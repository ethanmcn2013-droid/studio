import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { readDispatchEntries, type DispatchEntry } from "@/lib/changelog";

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

const PRODUCT_LABEL: Record<string, string> = {
  S: "Signal Studio",
  T: "Signal Tasks",
  R: "Signal Roadmap",
  A: "Signal Analytics",
  N: "Signal Notes",
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

function EntryBlock({ entry }: { entry: DispatchEntry }) {
  const productLetter = entry.cycleCode?.[0];
  const productLabel = productLetter ? PRODUCT_LABEL[productLetter] : null;

  return (
    <article className="border-t border-border-soft pt-10 first:border-t-0 first:pt-0">
      <header className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[11.5px] uppercase tracking-wide text-ink-quiet">
        <span>{entry.date}</span>
        {entry.cycleCode && (
          <>
            <span aria-hidden className="text-border">·</span>
            <span className="text-accent">{entry.cycleCode}</span>
          </>
        )}
        {entry.verb && (
          <>
            <span aria-hidden className="text-border">·</span>
            <span className="lowercase text-ink-soft">{entry.verb}</span>
          </>
        )}
        {productLabel && (
          <>
            <span aria-hidden className="text-border">·</span>
            <span className="lowercase text-ink-quiet">{productLabel}</span>
          </>
        )}
      </header>

      <h2 className="mb-5 max-w-[58ch] text-[22px] font-semibold leading-snug tracking-[-0.015em] text-ink">
        {entry.headline}
      </h2>

      {entry.boldLead && (
        <p className="mb-5 max-w-[58ch] text-[16px] font-medium leading-[1.6] text-ink">
          {renderInline(entry.boldLead)}
        </p>
      )}

      <div className="max-w-[58ch] space-y-4 text-[15px] leading-[1.7] text-ink-soft">
        {paragraphs(entry.body).map((p, i) => (
          <p key={i}>{renderInline(p)}</p>
        ))}
      </div>
    </article>
  );
}

export default async function DispatchPage() {
  const entries = await readDispatchEntries();

  return (
    <>
      <main className="flex flex-1 flex-col">
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
            className="mb-4 max-w-[58ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Shipped work across the suite — Signal Tasks, Roadmap, Analytics,
            Notes, and the umbrella. Each entry carries a date, a cycle code,
            a verb, and a one-sentence impact lead. The five verbs are{" "}
            <span className="font-mono text-[14px] text-ink">ships</span>,{" "}
            <span className="font-mono text-[14px] text-ink">tightens</span>,{" "}
            <span className="font-mono text-[14px] text-ink">cuts</span>,{" "}
            <span className="font-mono text-[14px] text-ink">holds</span>{" "}
            (what we chose not to build), and{" "}
            <span className="font-mono text-[14px] text-ink">reads</span>.
          </p>

          <p className="mb-3 max-w-[58ch] text-[13.5px] leading-[1.65] text-ink-quiet">
            Updated when something is worth saying out loud. Silence is also
            brand.
          </p>

          <p className="mb-16 max-w-[58ch] text-[13.5px] leading-[1.65] text-ink-quiet">
            Subscribe via{" "}
            <a
              href="/changelog.rss"
              className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
            >
              RSS
            </a>
            .
          </p>

          <div className="space-y-12">
            {entries.map((entry, i) => (
              <EntryBlock key={`${entry.date}-${i}`} entry={entry} />
            ))}
          </div>

          <div className="mt-24 border-t border-border-soft pt-6 text-[13px] leading-[1.6] text-ink-quiet">
            Each product&apos;s own dispatch lives in its repo&apos;s{" "}
            <code className="font-mono text-[12.5px] text-ink-soft">
              CHANGELOG.md
            </code>
            . This page is the curated suite read. Convention:{" "}
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
