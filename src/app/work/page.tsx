import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Work — studio.",
  description:
    "Six things made under this roof — Tasks, Roadmap, Luminary Studio, Approvals Motion, Verizon GPO, 1ERP.",
};

interface WorkItem {
  name: string;
  descriptor: string;
  year: string;
  status: "In production" | "Shipped" | "In progress";
  href?: string;
}

const items: WorkItem[] = [
  {
    name: "Tasks",
    descriptor: "A multi-view workspace for people who don't think in sprints.",
    year: "2026",
    status: "In production",
    href: "https://tasks-nu-hazel.vercel.app",
  },
  {
    name: "Roadmap",
    descriptor:
      "Public-facing changelogs for the people your engineers aren't talking to.",
    year: "2026",
    status: "In production",
    href: "https://roadmap-ebon-eight.vercel.app",
  },
  {
    name: "Luminary Studio",
    descriptor: "A hospitality design studio site.",
    year: "2026",
    status: "Shipped",
  },
  {
    name: "Approvals Motion",
    descriptor:
      "Procurement approval flow, Slack-native vs S4-mail, rendered in Remotion.",
    year: "2026",
    status: "Shipped",
  },
  {
    name: "Verizon GPO",
    descriptor: "A modern Verizon design system, in progress.",
    year: "2026",
    status: "In progress",
  },
  {
    name: "1ERP",
    descriptor: "Steerco source-of-truth and programme communications.",
    year: "2026",
    status: "In progress",
  },
];

const statusColor: Record<WorkItem["status"], string> = {
  "In production": "var(--accent)",
  Shipped: "var(--ink-quiet)",
  "In progress": "var(--ink-faint)",
};

export default function WorkPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-[760px] px-6 pb-28 pt-16 md:pt-24">
          {/* Section eyebrow */}
          <div
            className="mb-10 text-[11px] font-semibold uppercase"
            style={{ color: "var(--accent)", letterSpacing: "var(--tracking-eyebrow)" }}
          >
            Work
          </div>

          {/* Intro line */}
          <p
            className="mb-12 leading-[1.6] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            Six things made under this roof.
          </p>

          {/* Index list */}
          <ol className="flex flex-col divide-y divide-border-soft">
            {items.map((item) => {
              const Row = (
                <div className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                  {/* Left col */}
                  <div>
                    <span
                      className="font-medium text-ink"
                      style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}
                    >
                      {item.name}
                    </span>
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
                  <li key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block no-underline transition-opacity hover:opacity-80"
                      aria-label={`${item.name} — opens in new tab`}
                    >
                      {Row}
                    </a>
                  </li>
                );
              }

              return (
                <li key={item.name}>
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
