import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { MarketingDelightController } from "@/components/marketing/delight/marketing-delight-controller";
import { formatEuroCents, requireVerifiedAmount } from "@/lib/commercial-terms";
import { PlanPicker, type PricingPlan } from "./plan-picker";

const FREE_PRICE = formatEuroCents(requireVerifiedAmount("free"));
const STUDENT_PRICE = formatEuroCents(requireVerifiedAmount("student"));
const PRO_PRICE = formatEuroCents(requireVerifiedAmount("pro"));
const EVENT_PRICE = formatEuroCents(requireVerifiedAmount("event"));

export const metadata: Metadata = {
  title: "Pricing · Signal Studio",
  description: `Four clear access shapes, one complete suite. Free, ${STUDENT_PRICE} yearly for students, ${PRO_PRICE} monthly for ongoing work, or ${EVENT_PRICE} one-time for an event.`,
  openGraph: {
    title: "Pricing · Signal Studio",
    description: "Choose the shape that matches the work. Every plan includes Notes, Tasks, Timeline and the daily briefing in Home.",
    type: "website",
  },
};

function waitlistHref(artifact: string, plan: string): string {
  return `/waitlist?source=pricing&campaign=pre_access_waitlist&artifact=${artifact}&plan=${plan}&touch=site`;
}

const PLANS: readonly PricingPlan[] = [
  {
    id: "free",
    useCase: "Just me",
    name: "Free",
    price: FREE_PRICE,
    cadence: "forever",
    summary: "Start one workspace with the whole suite. No card and no trial countdown.",
    facts: [
      { label: "Workspace", value: "One" },
      { label: "Editing guests", value: "Three" },
      { label: "Access window", value: "Forever" },
    ],
    cta: "Join the Free waitlist",
    href: waitlistHref("pricing_free", "free"),
  },
  {
    id: "student",
    useCase: "I study",
    name: "Student",
    price: STUDENT_PRICE,
    cadence: "per year",
    summary: "The complete suite at a student price. Three workspaces, three editing guests, and verified student status with annual re-verification.",
    facts: [
      { label: "Eligibility", value: "Student verification" },
      { label: "Workspaces", value: "Three" },
      { label: "Editing guests", value: "Three" },
    ],
    cta: "Join the Student waitlist",
    href: waitlistHref("pricing_student", "student"),
  },
  {
    id: "pro",
    useCase: "Ongoing work",
    name: "Pro",
    price: PRO_PRICE,
    cadence: "per month",
    recommended: true,
    summary: "For work that keeps moving. Unlimited workspaces, with a verified monthly price and a €120 annual option when purchase opens.",
    facts: [
      { label: "Best for", value: "Crews and ongoing projects" },
      { label: "Workspaces", value: "Unlimited" },
      { label: "Billing", value: "€12 monthly · €120 yearly" },
    ],
    cta: "Join the Pro waitlist",
    href: waitlistHref("pricing_pro", "pro"),
  },
  {
    id: "event",
    useCase: "One event",
    name: "Event",
    price: EVENT_PRICE,
    cadence: "one-time · 12 months",
    summary: "One workspace for one wedding, launch, move or conference. It stays active for 12 months, then becomes read-only.",
    facts: [
      { label: "Workspace", value: "One event" },
      { label: "After 12 months", value: "Read-only" },
      { label: "Access window", value: "12 months" },
    ],
    cta: "Join the Event waitlist",
    href: waitlistHref("pricing_event", "event"),
  },
];

const COMPARE_ROWS = [
  { label: "Best for", values: ["Starting solo", "Students", "Ongoing work", "One event"] },
  { label: "Workspaces", values: ["One", "Three", "Unlimited", "One event"] },
  { label: "Editing guests", values: ["Three", "Three", "See terms before purchase", "See terms before purchase"] },
  { label: "Price", values: [FREE_PRICE, `${STUDENT_PRICE} / year`, `${PRO_PRICE} / month or €120 / year`, `${EVENT_PRICE} one-time`] },
  { label: "Access", values: ["Does not expire", "Annual re-verification", "While subscribed", "12 months, then read-only"] },
] as const;

const FAQ = [
  {
    q: "What is included in every plan?",
    a: "Notes, Tasks, Timeline and the daily briefing in Home. Plans change the access shape, not which product you are allowed to use.",
  },
  {
    q: "Do I pay for every person who can view a Timeline?",
    a: "No. A link-only Timeline viewer does not become a workspace editor and does not gain workspace access. Editing-member terms are shown separately before purchase.",
  },
  {
    q: "Why is Event one-time?",
    a: `A wedding, launch, move or conference has a fixed planning window. ${EVENT_PRICE} covers one event workspace for 12 months; afterward it becomes read-only.`,
  },
  {
    q: "Can I choose annual Pro?",
    a: "Yes when paid access opens: €12 per month or €120 per year. Joining the waitlist does not select a billing cadence or charge you.",
  },
  {
    q: "Am I charged when I join the waitlist?",
    a: "No. Access is opening in small batches. The waitlist records the plan you chose; price, limits and terms are shown again before any purchase.",
  },
] as const;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-accent">{children}</p>;
}

export default function PricingPage() {
  return (
    <>
      <main className="flex flex-1 flex-col" id="main" tabIndex={-1}>
        <MarketingDelightController />

        <section className="mx-auto w-full max-w-[1120px] px-5 pb-12 pt-14 sm:px-6 md:pb-16 md:pt-24">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="mt-5 max-w-[18ch] text-balance text-[clamp(2.8rem,2rem+4vw,6rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-ink">
            Choose the shape. Keep the whole suite.
          </h1>
          <p className="mt-6 max-w-[62ch] text-[clamp(1.05rem,0.98rem+0.35vw,1.25rem)] leading-8 text-ink-soft">
            Every plan includes Notes, Tasks, Timeline and the daily briefing in Home. Access opens in small batches, and the price, limits and renewal terms are repeated before you commit.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-ink-quiet" role="list" aria-label="Pricing commitments">
            <span role="listitem">No charge on the waitlist</span>
            <span role="listitem">No product add-ons</span>
            <span role="listitem">Terms repeated before purchase</span>
          </div>
        </section>

        <section className="border-y border-border-soft bg-[var(--paper-soft)]">
          <div className="mx-auto w-full max-w-[1120px] px-5 py-12 sm:px-6 md:py-16">
            <div className="max-w-[680px]">
              <Eyebrow>1 · Match the work</Eyebrow>
              <h2 className="mt-3 text-balance text-[clamp(1.8rem,1.45rem+1.4vw,3rem)] font-semibold tracking-[-0.045em] text-ink">
                What are you planning?
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-ink-soft">Choose a use case. The plan, price and known limits update in one place.</p>
            </div>
            <div className="mt-8">
              <PlanPicker plans={PLANS} />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 md:py-20" data-delight="pricing-suite" data-delight-once>
          <Eyebrow>2 · What stays the same</Eyebrow>
          <div className="mt-4 grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <h2 className="max-w-[14ch] text-balance text-[clamp(1.8rem,1.45rem+1.4vw,3rem)] font-semibold tracking-[-0.045em] text-ink">
                Three products. One continuous handoff.
              </h2>
              <p className="mt-4 max-w-[48ch] text-[15px] leading-7 text-ink-soft">
                Plans do not lock away product capability. Notes captures the thought, Tasks carries the action, Timeline shares the direction, and Home reads across all three.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["notes", "Notes", "Capture", "Private by default. You choose exactly what becomes work."],
                ["tasks", "Tasks", "Execute", "Run the work in plain language, with dates, owners and receipts."],
                ["timeline", "Timeline", "Direct", "Publish a frozen link-only copy after you review it."],
              ].map(([key, name, role, body]) => (
                <article className="pricing-mark min-w-0 rounded-xl border border-border-soft bg-white p-4" data-key={key} key={key}>
                  <span className="dot" aria-hidden="true" />
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-faint">{role}</p>
                  <h3 className="mt-1 text-[17px] font-semibold text-ink">{name}</h3>
                  <p className="mt-2 text-[13px] leading-6 text-ink-soft">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border-soft bg-white">
          <div className="mx-auto w-full max-w-[1120px] px-5 py-14 sm:px-6 md:py-20">
            <Eyebrow>3 · Compare only what changes</Eyebrow>
            <h2 className="mt-3 max-w-[18ch] text-balance text-[clamp(1.8rem,1.45rem+1.4vw,3rem)] font-semibold tracking-[-0.045em] text-ink">
              The decision, without the fine-print maze.
            </h2>

            <div className="mt-8 hidden overflow-x-auto md:block">
              <table className="w-full table-fixed border-collapse text-left text-[13px] leading-5">
                <caption className="sr-only">Signal Studio plan comparison</caption>
                <thead>
                  <tr className="border-b border-border-soft">
                    <th className="w-[18%] px-3 py-3" scope="col"><span className="sr-only">Dimension</span></th>
                    {PLANS.map((plan) => <th className="px-3 py-3 text-[14px] font-semibold text-ink" key={plan.id} scope="col">{plan.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row) => (
                    <tr className="border-b border-border-soft align-top" key={row.label}>
                      <th className="px-3 py-4 font-medium text-ink" scope="row">{row.label}</th>
                      {row.values.map((value, index) => <td className="[overflow-wrap:anywhere] px-3 py-4 text-ink-soft" key={PLANS[index].id}>{value}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-7 grid gap-4 md:hidden">
              {PLANS.map((plan, planIndex) => (
                <section className="min-w-0 rounded-xl border border-border-soft bg-[var(--paper-soft)] p-4" key={plan.id} aria-labelledby={`mobile-plan-${plan.id}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[17px] font-semibold text-ink" id={`mobile-plan-${plan.id}`}>{plan.name}</h3>
                    <span className="font-mono text-[12px] text-ink-soft">{plan.price}</span>
                  </div>
                  <dl className="mt-3 divide-y divide-border-soft">
                    {COMPARE_ROWS.map((row) => (
                      <div className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 py-2.5" key={row.label}>
                        <dt className="text-[12px] font-medium text-ink">{row.label}</dt>
                        <dd className="min-w-0 [overflow-wrap:anywhere] text-[12px] leading-5 text-ink-soft">{row.values[planIndex]}</dd>
                      </div>
                    ))}
                  </dl>
                  <Link className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-ink px-4 text-[13px] font-semibold text-ink no-underline" href={plan.href}>{plan.cta}</Link>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[860px] px-5 py-14 sm:px-6 md:py-20">
          <Eyebrow>Before you choose</Eyebrow>
          <h2 className="mt-3 text-balance text-[clamp(1.8rem,1.45rem+1.4vw,3rem)] font-semibold tracking-[-0.045em] text-ink">Straight answers.</h2>
          <div className="mt-7 divide-y divide-border-soft border-y border-border-soft">
            {FAQ.map((item) => (
              <details className="group py-1" key={item.q}>
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[15px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {item.q}<span aria-hidden="true" className="text-ink-faint transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[68ch] pb-5 text-[14px] leading-7 text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="border-t border-border-soft bg-[var(--paper-soft)]">
          <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-end md:justify-between md:py-20">
            <div>
              <Eyebrow>Access opens in small batches</Eyebrow>
              <h2 className="mt-3 max-w-[17ch] text-balance text-[clamp(2rem,1.6rem+1.6vw,3.4rem)] font-semibold tracking-[-0.05em] text-ink">Pick the plan that fits now. Change it before access.</h2>
            </div>
            <Link className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 text-[14px] font-semibold text-white no-underline" href="#main">Choose a plan above</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
