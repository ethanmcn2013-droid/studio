import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";
import { SiteFooter } from "@/components/landing/site-footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Changelog — Signal Studio",
  description:
    "What coalesced across the suite. Process notes from Signal Studio — the umbrella over Signal Tasks, Roadmap, Analytics, and Notes.",
};

type Entry = { title: string; body: string };
type Section = { date: string; entries: Entry[] };

/**
 * Parse studio/CHANGELOG.md.
 *
 * Format is deliberately regular:
 *   ## YYYY-MM-DD [(suffix)]   → date section
 *   ### Entry title            → entry inside the current section
 *   body lines...              → entry body
 *
 * Anything before the first `## ` (intro / hr) is dropped — the page
 * carries its own header. Footer signoffs (italic one-liners) are
 * preserved inside the last entry's body, where they belong.
 */
function parseChangelog(raw: string): Section[] {
  const lines = raw.split("\n");
  const sections: Section[] = [];
  let currentSection: Section | null = null;
  let currentEntry: Entry | null = null;

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(\d{4}-\d{2}-\d{2}.*)$/);
    if (sectionMatch) {
      if (currentEntry && currentSection) currentSection.entries.push(currentEntry);
      if (currentSection) sections.push(currentSection);
      currentSection = { date: sectionMatch[1].trim(), entries: [] };
      currentEntry = null;
      continue;
    }

    const entryMatch = line.match(/^###\s+(.+)$/);
    if (entryMatch) {
      if (currentEntry && currentSection) currentSection.entries.push(currentEntry);
      currentEntry = { title: entryMatch[1].trim(), body: "" };
      continue;
    }

    if (currentEntry) {
      currentEntry.body += line + "\n";
    }
  }
  if (currentEntry && currentSection) currentSection.entries.push(currentEntry);
  if (currentSection) sections.push(currentSection);
  return sections;
}

/** Split body into paragraphs (blank-line separated) and trim. */
function paragraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
}

/** Render minimal inline markdown — just `*emphasis*`. The body
 *  prose deliberately avoids links, code, bullets, so this stays small. */
function renderInline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const parts = text.split(/(\*[^*]+\*)/g);
  parts.forEach((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      out.push(
        <em key={i} className="italic text-ink-soft">
          {part.slice(1, -1)}
        </em>,
      );
    } else if (part) {
      out.push(part);
    }
  });
  return out;
}

export default async function ChangelogPage() {
  const file = await fs.readFile(
    path.join(process.cwd(), "CHANGELOG.md"),
    "utf-8",
  );
  const sections = parseChangelog(file);

  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          <div
            className="mb-6 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Changelog
          </div>

          <h1 className="h-section mb-6 max-w-[620px] text-balance text-ink">
            What coalesced across the suite.
          </h1>

          <p
            className="mb-4 max-w-[58ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Process notes from the umbrella. The four products — Tasks,
            Roadmap, Analytics, Notes — each keep their own engineering
            logs. This page is the one written for reading.
          </p>

          <p className="mb-16 max-w-[58ch] text-[13.5px] leading-[1.65] text-ink-quiet">
            Updated when something is worth saying out loud. Silence is
            also brand.
          </p>

          <div className="space-y-20">
            {sections.map((section) => (
              <section key={section.date}>
                <div
                  className="mb-8 font-mono text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {section.date}
                </div>

                <div className="space-y-14">
                  {section.entries.map((entry, idx) => (
                    <article key={`${section.date}-${idx}`}>
                      <h2 className="mb-4 text-[20px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                        {entry.title}
                      </h2>
                      <div className="space-y-4 text-[15px] leading-[1.7] text-ink-soft">
                        {paragraphs(entry.body).map((p, i) => (
                          <p key={i}>{renderInline(p)}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-24 border-t border-border-soft pt-6 text-[13px] leading-[1.6] text-ink-quiet">
            Each product&apos;s own log lives in its repo&apos;s{" "}
            <code className="font-mono text-[12.5px] text-ink-soft">
              CHANGELOG.md
            </code>
            . This page is the curated read.
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
