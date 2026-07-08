import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Work · Signal Studio",
  description:
    "Four products for operational clarity: Notes, Tasks, Timeline, Signal.",
};

type ProductSlug = "notes" | "tasks" | "timeline" | "signal";

interface WorkItem {
  name: string;
  descriptor: string;
  year: string;
  status: "Private preview" | "Private build";
  href?: string;
}

// Workflow order: Notes captures, Tasks runs, Timeline shows, Signal
// surfaces. Product names carry no "Signal" prefix, the house is Signal
// Studio; the products are Notes, Tasks, Timeline, Signal.
const items: WorkItem[] = [
  {
    name: "Notes",
    descriptor: "Capture clarity for fast notes that can become work when they earn it.",
    year: "2026",
    status: "Private build",
    href: waitlistHref("notes"),
  },
  {
    name: "Tasks",
    descriptor:
      "Execution clarity for active work, daily attention, and plain-English follow-through.",
    year: "2026",
    status: "Private preview",
    href: waitlistHref("tasks"),
  },
  {
    name: "Timeline",
    descriptor:
      "Direction clarity for public plans, changes, and decisions people can read.",
    year: "2026",
    status: "Private preview",
    href: waitlistHref("timeline"),
  },
  {
    name: "Signal",
    descriptor:
      "Attention clarity through short briefings that surface what matters in the work.",
    year: "2026",
    status: "Private preview",
    href: waitlistHref("signal"),
  },
];

function waitlistHref(product: ProductSlug): string {
  return `/waitlist?source=work&campaign=pre_access_waitlist&product=${product}&artifact=work_row_${product}&touch=site`;
}

const statusColor: Record<WorkItem["status"], string> = {
  "Private preview": "var(--accent)",
  "Private build": "var(--accent)",
};

export default function WorkPage() {
  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          {/* Visually-hidden page H1, eyebrow div below is the visual label */}
          <h1 className="sr-only">Work</h1>

          {/* Section eyebrow */}
          <div
            className="mb-10 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
            aria-hidden="true"
          >
            Work
          </div>

          <p
            className="mb-12 leading-[1.6] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Four products, one system. Access is staged: join the waitlist
            and we will open the right door when the next window is ready.
          </p>

          <ol className="flex flex-col">
            {items.map((item) => {
              const Row = (
                <div className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  {/* Left col */}
                  <div>
                    <h2
                      className="m-0 inline p-0 font-medium text-ink"
                      style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}
                    >
                      {item.name}
                    </h2>
                    <span
                      className="ml-3 text-ink-quiet"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {item.descriptor}
                    </span>
                  </div>

                  {/* Right col */}
                  <div
                    className="flex items-center gap-3 sm:justify-end"
                    style={{ flexShrink: 0 }}
                  >
                    <span
                      className="font-mono text-[11px] text-ink-faint"
                      style={{ letterSpacing: "0.04em" }}
                    >
                      {item.year}
                    </span>
                    <span className="font-mono text-[11px] text-ink-faint" aria-hidden>·</span>
                    <span
                      className="text-[11px] font-medium uppercase"
                      style={{
                        letterSpacing: "var(--tracking-eyebrow)",
                        color: statusColor[item.status],
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );

              if (item.href) {
                return (
                  <li key={item.name} className="border-b border-border-soft last:border-b-0">
                    <a
                      href={item.href}
                      className="group block no-underline transition-opacity hover:opacity-80"
                      aria-label={`Join the waitlist for ${item.name}`}
                    >
                      {Row}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.name} className="border-b border-border-soft last:border-b-0">
                  {Row}
                </li>
              );
            })}
          </ol>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
