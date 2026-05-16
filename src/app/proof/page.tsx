import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { HandoffTrace } from "@/components/proof/handoff-trace";
import { CaptureReveal } from "@/components/proof/capture-reveal";
import {
  TASKS_URL,
  ROADMAP_URL,
  ANALYTICS_URL,
  NOTES_URL,
} from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Proof — Signal Studio",
  description:
    "One scene, four products, end to end. A wedding planner sits down for a venue call. Forty-five minutes later, the work is in motion across Signal Notes, Tasks, Roadmap, and Analytics. This is that scene.",
};

const LAYERS = [
  {
    n: "1",
    product: "Signal Notes",
    productHref: NOTES_URL,
    role: "Capture clarity",
    when: "The venue call.",
    title: "The planner sits in a venue meeting. Everything lands in Notes.",
    body: [
      "Forty-five minutes. Vendor names, deposit amounts, the date the bride wants confirmed by Friday, the venue coordinator's worry about the marquee plan if it rains. Some of it will turn into tasks. Some of it is just thinking out loud. Notes does not sort yet.",
      "Notes is private by design. Nothing leaves until the planner decides what does. The empty page is a protected writing space, not a collaboration surface.",
    ],
    artefact: {
      label: "From the planner's notebook",
      lines: [
        "Venue confirmed — Powerscourt, Saturday Sept 26.",
        "Florist: Bloom & Co. Quote sent. Waiting reply.",
        "Marquee: only if rain forecast. Decide by 14 days out.",
        "Bride: wants save-the-dates posted by July 15.",
        "Catering: need final headcount by August 1.",
        "Tom (groom's dad) — does the toast. Mention to MC.",
        "Coordinator on the day: Aoife.",
      ],
    },
    outcome: "12 captures. 3 ready to promote into Tasks.",
  },
  {
    n: "2",
    product: "Signal Tasks",
    productHref: TASKS_URL,
    role: "Execution clarity",
    when: "After the meeting.",
    title: "Three notes become three tasks. The wedding workspace is live.",
    body: [
      "The planner long-presses three captures. Each one promotes into a task in a fresh wedding workspace. Tags do the job that projects would do in a heavier tool — \"florist\" becomes a project, \"venue\" becomes a project, \"save-the-dates\" sits inside print.",
      "The workspace was seeded from the canonical wedding template, so the structure is already there. The planner did not configure anything.",
    ],
    artefact: {
      label: "Workspace · Sarah and James — Sept 26",
      lines: [
        "Confirm florist quote — florist · waiting on Bloom & Co",
        "Decide marquee yes/no by 14 days out — venue · scheduled",
        "Send save-the-dates by July 15 — print · doing",
        "Final headcount to caterer by Aug 1 — catering",
        "Brief MC on Tom's toast — ceremony",
      ],
    },
    outcome: "5 tasks. 4 tags. 0 setup.",
  },
  {
    n: "3",
    product: "Signal Roadmap",
    productHref: ROADMAP_URL,
    role: "Direction clarity",
    when: "Same evening.",
    title: "One link goes to the couple. The plan is now public to them.",
    body: [
      "The planner publishes a Roadmap update from the same workspace. Public link. Plain English. No private notes. No vendor pricing. Just the milestones the couple care about and the next decision they have to make.",
      "The couple read it at midnight on their phone. No login. No app to install. No tax on their attention.",
    ],
    artefact: {
      label: "Public roadmap · sarah-and-james.signal.example",
      lines: [
        "Now → Save-the-dates by July 15",
        "Next → Final headcount by August 1",
        "Then → Confirm florist (waiting on quote)",
        "Soon → Decide marquee 14 days before the date",
        "Held up → Catering — need your guest list first",
      ],
    },
    outcome: "One link the couple can read at midnight. No login.",
  },
  {
    n: "4",
    product: "Signal Analytics",
    productHref: ANALYTICS_URL,
    role: "Attention clarity",
    when: "The next morning.",
    title: "At 6am, the briefing names what needs the planner's attention.",
    body: [
      "Analytics reads the state of the workspace overnight. Ten rules look for held-up work, overdue items, quiet projects, and concentration of work on one person. Three items per block. Always three. Silence is signal too.",
      "Every sentence is drawn from a curated library written by hand. No LLM in the path. The briefing tells you what changed; it does not decide what you should do about it.",
    ],
    artefact: {
      label: "Today's briefing · Tuesday morning",
      lines: [
        "Needs attention",
        "Florist quote has been quiet for 8 days, and Confirm florist is held up by it.",
        "Save-the-dates were due 3 days ago.",
        "",
        "Suggested focus",
        "Chase Bloom & Co today — Confirm florist is waiting on them.",
        "Close out save-the-dates today — they're 3 days late.",
      ],
    },
    outcome: "Two minutes of reading. The day is shaped before the inbox.",
  },
] as const;

const PROSE_MAX = "mx-auto w-full max-w-[760px] px-6";

function Eyebrow({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <p
      className="mb-6 text-[11px] font-semibold uppercase"
      style={{
        color: accent ? "var(--accent)" : "var(--ink-quiet)",
        letterSpacing: "var(--tracking-eyebrow)",
        fontFamily: "var(--font-mono-stack)",
      }}
    >
      {children}
    </p>
  );
}

export default function ProofPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <section className={`${PROSE_MAX} pb-16 pt-16 md:pt-24`}>
          <Eyebrow accent>Proof</Eyebrow>

          <h1 className="h-section mb-6 max-w-[620px] text-balance text-ink">
            One scene. Four products. End to end.
          </h1>

          <p
            className="mb-4 max-w-[58ch] leading-[1.7] text-ink-soft"
            style={{ fontSize: "clamp(0.9375rem, 0.875rem + 0.3vw, 1.0625rem)" }}
          >
            A wedding planner sits down for the first venue call.
            Forty-five minutes later, the work is in motion across
            Signal Notes, Tasks, Roadmap, and Analytics. This page is
            that scene, layer by layer.
          </p>

          <p className="max-w-[58ch] text-[13.5px] leading-[1.65] text-ink-quiet">
            The example is wedding planning because it is real. The pattern
            holds for anyone who runs work that has a deadline, real money,
            and people who need to read the plan without being trained on a
            tool.
          </p>
        </section>

        {LAYERS.map((layer, idx) => (
          <section
            key={layer.n}
            className={`border-t border-border-soft py-16 md:py-20 ${
              idx % 2 === 1 ? "bg-[color:var(--bg-sunken,transparent)]" : ""
            }`}
          >
            <div className={PROSE_MAX}>
              {idx > 0 && <HandoffTrace />}
              <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span
                  className="font-mono text-[42px] font-semibold leading-none text-ink"
                  style={{
                    color: "var(--accent)",
                    letterSpacing: "-0.04em",
                  }}
                  aria-hidden
                >
                  {layer.n}
                </span>
                <span
                  className="font-mono text-[11px] font-semibold uppercase text-ink-quiet"
                  style={{ letterSpacing: "var(--tracking-eyebrow)" }}
                >
                  {layer.product} · {layer.role}
                </span>
              </div>

              <p className="mb-3 text-[13px] uppercase tracking-[0.14em] text-ink-faint">
                {layer.when}
              </p>

              <h2 className="mb-6 max-w-[620px] text-balance text-[28px] font-semibold leading-[1.15] tracking-[-0.025em] text-ink md:text-[34px]">
                {layer.title}
              </h2>

              <div className="space-y-4 text-[15.5px] leading-[1.7] text-ink-soft">
                {layer.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <figure
                className="mt-10 overflow-hidden rounded-2xl border border-border-soft"
                style={{ background: "var(--bg-elev, white)" }}
              >
                <figcaption
                  className="border-b border-border-soft px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-quiet"
                  style={{ background: "color-mix(in srgb, var(--bg-deep, #f4f4f0) 60%, transparent)" }}
                >
                  {layer.artefact.label}
                </figcaption>
                <div className="px-5 py-5">
                  {idx === 0 ? (
                    <CaptureReveal lines={layer.artefact.lines} />
                  ) : (
                    <ul className="space-y-2 font-mono text-[13.5px] leading-[1.6] text-ink-soft">
                      {layer.artefact.lines.map((line, i) =>
                        line === "" ? (
                          <li key={i} aria-hidden className="h-2" />
                        ) : (
                          <li key={i} className="break-words">
                            {line}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              </figure>

              <p className="mt-6 max-w-[58ch] text-[13.5px] leading-[1.65] text-ink-quiet">
                <span className="font-mono uppercase tracking-[0.12em] text-ink-faint">
                  Outcome ·{" "}
                </span>
                {layer.outcome}
              </p>

              <div className="mt-6">
                <a
                  href={layer.productHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-ink underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
                >
                  Open {layer.product} →
                </a>
              </div>
            </div>
          </section>
        ))}

        <section className="border-t border-border-soft py-20 md:py-24">
          <div className={PROSE_MAX}>
            <Eyebrow>The point</Eyebrow>
            <h2 className="mb-6 max-w-[620px] text-balance text-[28px] font-semibold leading-[1.2] tracking-[-0.025em] text-ink md:text-[36px]">
              Not all-in-one. Four products, doing one job each, with the
              boundaries between them written out loud.
            </h2>
            <p className="mb-4 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
              Most productivity tools ask you to do the translation work
              yourself: between the meeting and the task list, between the
              task list and what the customer sees, between what you shipped
              and what you do tomorrow. Signal Studio holds the translations
              so you do not have to.
            </p>
            <p className="mb-10 max-w-[58ch] text-[15.5px] leading-[1.7] text-ink-soft">
              The suite is four small tools that already know how to talk to
              each other. Notes promotes to Tasks. Tasks publishes to
              Roadmap. Tasks feeds Analytics. The handoffs are the product.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-ink">
              <Link
                href="/about"
                className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                Read the manifesto
              </Link>
              <Link
                href="/pricing"
                className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                See the pricing
              </Link>
              <Link
                href="/contact"
                className="underline decoration-border-soft underline-offset-[3px] transition-colors hover:text-accent hover:decoration-accent"
              >
                Reach a human
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
