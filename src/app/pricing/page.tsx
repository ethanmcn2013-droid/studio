import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { MarketingDelightController } from "@/components/marketing/delight/marketing-delight-controller";
import { HOMEPAGE_RELAY_TIMELINE_FIXTURE } from "@/components/marketing/heroes/timeline/fixture";
import { ProductSignatureWordmark } from "@/components/reveal/product-signature-wordmark";
import {
  COMMERCIAL_TERMS,
  formatEuroCents,
  getConsumerPricingPresentation,
} from "@/lib/commercial-terms";
import { REVIEW_SUITE_PRESENTATION } from "@/lib/review-suite-presentation";
import {
  PlanPicker,
  type PricingComparisonKey,
  type PricingPlan,
} from "./plan-picker";
import {
  PricingClosing,
  PricingSelectionProvider,
} from "./pricing-selection";
import styles from "./pricing.module.css";

const PRICING = getConsumerPricingPresentation();
const FREE_PRICE = PRICING.plans.free.price;
const STUDENT_PRICE = PRICING.plans.student.price;
const PRO_PRICE = PRICING.plans.pro.price;
const PRO_ANNUAL_PRICE = PRICING.plans.pro.annualPrice;
const PRO_ANNUAL_SAVING = formatEuroCents(
  COMMERCIAL_TERMS.plans.pro.monthlyAmountCents * 12 -
    COMMERCIAL_TERMS.plans.pro.annualAmountCents,
);
const PRO_EDITING_LIMIT =
  PRICING.plans.pro.editingGuestLimit === "See terms before purchase"
    ? "Limit not yet published"
    : PRICING.plans.pro.editingGuestLimit;

export const metadata: Metadata = {
  title: "Pricing · Signal Studio",
  description: `Start free, pay ${STUDENT_PRICE} yearly while studying, choose Pro from ${PRO_PRICE} monthly, or shape Enterprise terms with Ethan.`,
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing · Signal Studio",
    description:
      "Free, Student, Pro and Enterprise. Compare the price, limits and access terms without a feature maze.",
    type: "website",
    url: "/pricing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing · Signal Studio",
    description:
      "Free, Student, Pro and Enterprise. One clear comparison.",
  },
};

function waitlistHref(artifact: string, plan: string): string {
  return `/waitlist?source=pricing&campaign=pre_access_waitlist&artifact=${artifact}&plan=${plan}&touch=site`;
}

const PLANS: readonly PricingPlan[] = [
  {
    id: "free",
    useCase: "Starting solo",
    name: PRICING.plans.free.name,
    price: FREE_PRICE,
    cadence: "no recurring charge",
    fit: "One workspace and 3 editing guests for a real project.",
    summary: "One workspace for putting Signal Studio to work on a real project.",
    facts: [
      { label: "Workspaces", value: PRICING.plans.free.workspaceLimit },
      {
        label: "Editing guests",
        value: PRICING.plans.free.editingGuestLimit,
      },
      { label: "Access", value: PRICING.plans.free.access },
    ],
    cta: "Join the Free waitlist",
    href: waitlistHref("pricing_free", "free"),
    microcopy: "No card or charge today.",
    mobileSummary: "1 workspace · 3 editing guests",
    comparison: {
      bestFor: "Starting solo",
      workspaces: PRICING.plans.free.workspaceLimit,
      editingGuests: PRICING.plans.free.editingGuestLimit,
      price: FREE_PRICE,
      access: PRICING.plans.free.access,
    },
  },
  {
    id: "student",
    useCase: "For study",
    name: PRICING.plans.student.name,
    price: STUDENT_PRICE,
    cadence: "per year",
    fit: "Three workspaces and 3 editing guests, reviewed each year.",
    summary:
      "Keep study work separate across three workspaces, with student status reviewed each year.",
    facts: [
      { label: "Eligibility", value: "Student verification" },
      {
        label: "Workspaces",
        value: PRICING.plans.student.workspaceLimit,
      },
      {
        label: "Editing guests",
        value: PRICING.plans.student.editingGuestLimit,
      },
    ],
    cta: "Join the Student waitlist",
    href: waitlistHref("pricing_student", "student"),
    microcopy:
      "Student status and payment terms are confirmed before access.",
    mobileSummary: "3 workspaces · 3 editing guests",
    comparison: {
      bestFor: "Verified students",
      workspaces: PRICING.plans.student.workspaceLimit,
      editingGuests: PRICING.plans.student.editingGuestLimit,
      price: `${STUDENT_PRICE} per year`,
      access: PRICING.plans.student.access,
    },
  },
  {
    id: "pro",
    useCase: "Ongoing work",
    name: PRICING.plans.pro.name,
    price: PRO_PRICE,
    cadence: `per month · ${PRO_ANNUAL_PRICE}/year saves ${PRO_ANNUAL_SAVING}`,
    fit: "Unlimited workspaces. Editing limit not yet published.",
    summary: "Unlimited workspaces for work that keeps moving across projects.",
    facts: [
      { label: "Workspaces", value: PRICING.plans.pro.workspaceLimit },
      {
        label: "Billing",
        value: `${PRO_PRICE} monthly or ${PRO_ANNUAL_PRICE} yearly. Save ${PRO_ANNUAL_SAVING}.`,
      },
      {
        label: "Editing guests",
        value: PRO_EDITING_LIMIT,
      },
    ],
    cta: "Join the Pro waitlist",
    href: waitlistHref("pricing_pro", "pro"),
    microcopy: "Editing limit and purchase terms are confirmed before access.",
    mobileSummary: "Unlimited workspaces · Editing limit unpublished",
    comparison: {
      bestFor: "Ongoing work",
      workspaces: PRICING.plans.pro.workspaceLimit,
      editingGuests: PRO_EDITING_LIMIT,
      price: `${PRO_PRICE} monthly or ${PRO_ANNUAL_PRICE} yearly. Save ${PRO_ANNUAL_SAVING}.`,
      access: PRICING.plans.pro.access,
    },
  },
  {
    id: "enterprise",
    useCase: "For organisations",
    name: "Enterprise",
    price: "Let’s talk",
    cadence: "scope before price",
    fit: "A considered start, shaped around how the work runs.",
    summary:
      "For organisations that need a considered start, a larger editing group, or terms shaped around the work.",
    facts: [
      { label: "Working group", value: "Understood together" },
      { label: "Start", value: "Conversation with Ethan" },
      { label: "Terms", value: "Written before purchase" },
    ],
    cta: "Discuss Enterprise",
    href: "/about?subject=enterprise&source=pricing&campaign=enterprise&artifact=pricing_enterprise&touch=site#contact",
    microcopy: "Your note goes to Ethan, Signal Studio’s founder.",
    mobileSummary: "Scope and editing group agreed together",
    comparison: {
      bestFor: "Organisations",
      workspaces: "Scoped together",
      editingGuests: "Scoped together",
      price: "Agreed together",
      access: "Agreed terms",
    },
  },
];

const COMPARISON_ROWS: readonly Readonly<{
  key: PricingComparisonKey;
  label: string;
}>[] = [
  { key: "bestFor", label: "Best for" },
  { key: "workspaces", label: "Workspaces" },
  { key: "editingGuests", label: "Editing guests" },
  { key: "price", label: "Price" },
  { key: "access", label: "Access" },
];

const PROOF_STEPS = [
  {
    id: "notes",
    product: "notes" as const,
    state: "Captured privately",
    label: "Working note",
    title: "Menu tasting",
    body: REVIEW_SUITE_PRESENTATION.journey.note,
    meta: "Private by default",
  },
  {
    id: "tasks",
    product: "tasks" as const,
    state: "Approved into work",
    label: REVIEW_SUITE_PRESENTATION.journey.taskState,
    title: REVIEW_SUITE_PRESENTATION.journey.task,
    body: REVIEW_SUITE_PRESENTATION.journey.openRisk,
    meta: `${REVIEW_SUITE_PRESENTATION.journey.taskPriority} priority`,
  },
  {
    id: "timeline",
    product: "timeline" as const,
    state: "Published after review",
    label: "Current milestone",
    title: REVIEW_SUITE_PRESENTATION.journey.task,
    body: "1 August 2026 at The Orchard.",
    meta: "Link-only copy",
  },
] as const;

const PUBLISHED_TIMELINE = HOMEPAGE_RELAY_TIMELINE_FIXTURE;

const FAQ = [
  {
    question: "Does joining the waitlist cost anything?",
    answer:
      "No. Joining records the plan you came from. It does not take a payment or lock your choice.",
  },
  {
    question: "What counts as an editing guest?",
    answer:
      "The limit applies to people invited into the workspace. Someone who only opens a published Timeline link is not a workspace editor.",
  },
  {
    question: "How does Student verification work?",
    answer:
      "Student access starts after eligibility checks are in place. Status is checked again each year. The process is shown before purchase.",
  },
  {
    question: "Can I pay for Pro annually?",
    answer: `Yes when paid access opens. Pro is ${PRO_PRICE} per month or ${PRO_ANNUAL_PRICE} per year, saving ${PRO_ANNUAL_SAVING}. The waitlist does not select a billing cadence.`,
  },
  {
    question: "When should I choose Enterprise?",
    answer:
      "Choose Enterprise when the working group, the way access begins, or the terms need to be shaped around your organisation. Ethan replies directly.",
  },
  {
    question: "What happens when I renew, cancel or change plan?",
    answer:
      "Paid renewal, cancellation and plan-change terms are not yet published. They will be shown before purchase. Joining the waitlist starts none of them.",
  },
] as const;

export default function PricingPage() {
  return (
    <>
      <main className={styles.page} id="main" tabIndex={-1}>
        <MarketingDelightController />
        <header className={`${styles.hero} ${styles.shell}`}>
          <p className={styles.eyebrow}>Pricing</p>
          <h1>
            <span>One clear system.</span>
            <span>Four ways in.</span>
          </h1>
          <p className={styles.heroLede}>
            Start free, pay less while studying, move to Pro for ongoing work,
            or shape an Enterprise start with Ethan.
          </p>
        </header>

        <section
          aria-label="Pricing commitments"
          className={styles.commitmentBand}
        >
          <ul className={styles.shell}>
            <li>
              <strong>No charge</strong>
              <span>on the waitlist</span>
            </li>
            <li>
              <strong>VAT included</strong>
              <span>at the prevailing rate</span>
            </li>
            <li>
              <strong>Terms repeated</strong>
              <span>before purchase</span>
            </li>
          </ul>
        </section>

        <PricingSelectionProvider>
          <section
            aria-labelledby="plans-title"
            className={`${styles.plansSection} ${styles.shell}`}
            id="plans"
          >
            <div className={styles.sectionHeader}>
            <h2 id="plans-title">Choose by the work in front of you.</h2>
            <p>
              Compare the price, workspace limit and the terms settled today.
              Anything unresolved is named plainly.
            </p>
            </div>

            <PlanPicker plans={PLANS} />

            <p className={styles.vatLine}>{PRICING.vatStatement}</p>
          </section>

        <section
          aria-labelledby="comparison-title"
          className={`${styles.comparisonSection} ${styles.shell}`}
        >
          <div className={styles.sectionHeader}>
            <h2 id="comparison-title">Only what changes.</h2>
            <p>
              No feature maze. These are the commercial differences confirmed
              today.
            </p>
          </div>

          <div className={styles.desktopComparison}>
            <table>
              <caption className="sr-only">
                Signal Studio plan comparison
              </caption>
              <thead>
                <tr>
                  <th scope="col">What changes</th>
                  {PLANS.map((plan) => (
                    <th key={plan.id} scope="col">
                      <span>{plan.name}</span>
                      <strong>{plan.price}</strong>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    {PLANS.map((plan) => (
                      <td key={plan.id}>{plan.comparison[row.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mobileComparison}>
            {PLANS.map((plan) => (
              <details key={plan.id} name="pricing-comparison">
                <summary>
                  <span className={styles.mobileComparisonPlan}>
                    <strong>{plan.name}</strong>
                    <span>{plan.mobileSummary}</span>
                  </span>
                  <span className={styles.mobileComparisonMeta}>
                    <strong>{plan.price}</strong>
                    <span className={styles.mobileComparisonState}>
                      <span className={styles.comparisonClosed}>View</span>
                      <span className={styles.comparisonOpen}>Open</span>
                      <span aria-hidden="true" className={styles.disclosureChevron} />
                    </span>
                  </span>
                </summary>
                <dl>
                  {COMPARISON_ROWS.map((row) => (
                    <div key={row.key}>
                      <dt>{row.label}</dt>
                      <dd>{plan.comparison[row.key]}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="proof-title"
          className={styles.proofSection}
        >
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <h2 id="proof-title">The same work, without starting again.</h2>
              <p>
                One verified line of work moves from a private note to an
                approved task and a published Timeline. It is fixed product
                evidence, not live customer data.
              </p>
            </div>

            <figure
              className={styles.signalProof}
              data-delight="pricing-proof"
              data-delight-once
            >
              <ol
                aria-label="A first-party product handoff from Notes to Tasks to Timeline"
                className={styles.proofSteps}
              >
                {PROOF_STEPS.map((step) => (
                  <li key={step.id}>
                    <span className={styles.proofNode} aria-hidden="true" />
                    <div className={styles.proofStepHead}>
                      <ProductSignatureWordmark
                        product={step.product}
                        staticPresentation
                        suppressMark={step.product === "tasks"}
                      />
                      <span>{step.state}</span>
                    </div>
                    <div className={styles.proofReceipt}>
                      <p className={styles.proofObjectLabel}>{step.label}</p>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                      <span>{step.meta}</span>
                    </div>
                  </li>
                ))}
              </ol>

              <div className={styles.timelineReceipt}>
                <div className={styles.timelineReceiptHeader}>
                  <div>
                    <span>Published Timeline</span>
                    <strong>{PUBLISHED_TIMELINE.label}</strong>
                  </div>
                  <span>{PUBLISHED_TIMELINE.ownerDisplayLabel}</span>
                </div>
                <div className={styles.timelineTrack} aria-hidden="true">
                  <span />
                  <span className={styles.timelineCurrent} />
                  <span />
                </div>
                <div className={styles.timelineLabels}>
                  <span>The Orchard reserved</span>
                  <strong>Menu tasting · 1 Aug</strong>
                  <span>Wedding day · 3 Oct</span>
                </div>
              </div>

              <figcaption>
                Deterministic product fixture. Mara &amp; Finn. The Orchard,
                events. No controls, no invented fields.
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-labelledby="answers-title"
          className={`${styles.answersSection} ${styles.shell}`}
        >
          <div className={styles.sectionHeader}>
            <h2 id="answers-title">Straight answers.</h2>
          </div>

          <div className={styles.answers}>
            {FAQ.map((item) => (
              <details key={item.question}>
                <summary>
                  <span>{item.question}</span>
                  <span aria-hidden="true" className={styles.answerMark}>
                    +
                  </span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

          <PricingClosing plans={PLANS} />
        </PricingSelectionProvider>
      </main>
      <div className={styles.pricingFooter}>
        <SiteFooter />
      </div>
    </>
  );
}
