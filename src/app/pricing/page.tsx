import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { TASKS_URL } from "@/lib/product-urls";

export const metadata: Metadata = {
  title: "Pricing — Signal Studio",
  description:
    "One subscription. Four kinds of clarity. Free forever for solo. €12 a month, or €120 a year, for the workspace tier. €79 one-time for an event. Free for students. Venues stand behind their couples from €1,500 a year.",
  openGraph: {
    title: "Pricing — Signal Studio",
    description:
      "One subscription. Four kinds of clarity. No per-seat tax. No per-product tax.",
    type: "website",
  },
};

/* ── Type ─────────────────────────────────────────────────────────── */

type Tier = {
  name: string;
  recommended?: boolean;
  price: string;
  cadence: string;
  /** Plainly-stated annual prepay. No "SAVE %" theatre — the number is the number. */
  annual?: string;
  annualHref?: string;
  body: string;
  pills?: { label: string; value: string }[];
  cta: string;
  href: string;
};

type InsideProduct = {
  key: "tasks" | "roadmap" | "notes" | "analytics";
  word: string;
  position: string;
  desc: string;
  status: "shipped" | "build" | "design";
  statusLabel: string;
};

/* ── Static content ───────────────────────────────────────────────── */

/* E-7 (2026-05-14): paid-tier CTAs route through Tasks's /api/checkout
 * endpoint. Tasks owns the Stripe integration; the resulting entitlement
 * is mirrored to the shared signal-entitlements DB on success, so all
 * five products see the new tier without per-product checkout wiring.
 */
const TASKS_CHECKOUT_WORKSPACE = `${TASKS_URL}/api/checkout?tier=workspace`;
const TASKS_CHECKOUT_WORKSPACE_ANNUAL = `${TASKS_URL}/api/checkout?tier=workspace&interval=annual`;
const TASKS_CHECKOUT_EVENT = `${TASKS_URL}/api/checkout?tier=event`;

const TIERS: Tier[] = [
  {
    name: "Free",
    price: "€0",
    cadence: "forever",
    body: "One workspace. All four products. Three editing guests. No card needed.",
    pills: [
      { label: "Workspaces", value: "One" },
      { label: "Guests", value: "Three" },
      { label: "Window", value: "Forever" },
    ],
    cta: "Start free",
    href: TASKS_URL,
  },
  {
    name: "Student",
    price: "€0",
    cadence: "with verified .edu",
    body: "Workspace tier, free. Two-year window. For students running multi-stream work with real deadlines.",
    pills: [
      { label: "Workspaces", value: "One" },
      { label: "Guests", value: "Unlimited" },
      { label: "Window", value: "Two years" },
    ],
    cta: "Verify .edu",
    href: "mailto:hello@signalstudio.ie?subject=Student%20access%20—%20Signal%20Studio",
  },
  {
    name: "Workspace",
    recommended: true,
    price: "€12",
    cadence: "/ month · per workspace",
    annual: "or €120 a year, paid once",
    annualHref: TASKS_CHECKOUT_WORKSPACE_ANNUAL,
    body: "Unlimited workspaces. All four products. Invite anyone — the price doesn't move.",
    pills: [
      { label: "Workspaces", value: "Unlimited" },
      { label: "Guests", value: "Unlimited" },
      { label: "Window", value: "Monthly" },
    ],
    cta: "Start a workspace",
    href: TASKS_CHECKOUT_WORKSPACE,
  },
  {
    name: "Event",
    price: "€79",
    cadence: "one-time · 12 months",
    body: "One workspace for one event. Wedding, launch, move, conference. The workspace keeps reading forever.",
    pills: [
      { label: "Workspaces", value: "One" },
      { label: "Guests", value: "Unlimited" },
      { label: "Window", value: "12 months" },
    ],
    cta: "Plan an event",
    href: TASKS_CHECKOUT_EVENT,
  },
];

const SUITE: InsideProduct[] = [
  {
    key: "roadmap",
    word: "roadmap",
    position: "Direction",
    desc: "Show where the work is going. A public page anyone can open. No account, no jargon.",
    status: "shipped",
    statusLabel: "Shipping now",
  },
  {
    key: "tasks",
    word: "tasks",
    position: "Execution",
    desc: "Run the work. Plain-language workspace for weddings, freelance, students, trades.",
    status: "shipped",
    statusLabel: "Shipping now",
  },
  {
    key: "notes",
    word: "notes",
    position: "Context",
    desc: "Capture what was said. Promote a note into a task in one tap. Never auto-detected.",
    status: "shipped",
    statusLabel: "Shipping now",
  },
  {
    key: "analytics",
    word: "analytics",
    position: "Attention",
    desc: "The daily briefing. What needs focus before it becomes a problem. Three things, plain English.",
    status: "shipped",
    statusLabel: "Shipping now",
  },
];

const COMPARE_ROWS: { label: string; values: [string, string, string, string] }[] = [
  {
    label: "Who it's for",
    values: [
      "Solo, just starting",
      "Verified .edu, two-year window",
      "Crews running ongoing work",
      "One wedding, launch, move, conference",
    ],
  },
  {
    label: "Workspaces",
    values: ["One", "One", "Unlimited", "One, event-shaped"],
  },
  {
    label: "All four products",
    values: ["Yes", "Yes", "Yes", "Yes"],
  },
  {
    label: "Editing guests",
    values: ["Three", "Unlimited", "Unlimited", "Unlimited"],
  },
  {
    label: "Price",
    values: ["€0", "€0", "€12 / month", "€79 one-time"],
  },
  {
    label: "Window",
    values: ["Forever", "Two years", "Monthly, cancel anytime", "12 months"],
  },
  {
    label: "After the window",
    values: ["—", "Drops to Free", "Drops to Free", "Workspace keeps reading forever"],
  },
];

const REFUSALS: { neg: string; pos: string }[] = [
  {
    neg: "Not per seat.",
    pos: "One workspace, one price, however many people are in it.",
  },
  {
    neg: "Not per product.",
    pos: "The four work as one. Pay once. Use what you need, when you need it.",
  },
  {
    neg: "Not a trial that ends.",
    pos: "The free tier is free forever. No fourteen-day countdown. No verify-to-continue.",
  },
];

const FAQ: { q: string; a: string }[] = [
  {
    q: "Why a one-time price for events?",
    a: "Because weddings, launches, and moves are events, not subscriptions. You plan once, intensely, for a fixed window. A monthly bill that renews past the event would be the wrong shape. €79 captures the value while you need it. The workspace stays readable forever after.",
  },
  {
    q: "Do I have to pay per person?",
    a: "No. One workspace is one price. You can invite ten people, or one, or none — the bill does not change.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. One tap in the workspace settings. You keep the workspace through the end of the month, then it drops to Free.",
  },
  {
    q: "What if I only ever use one of the four products?",
    a: "Then you have the cleanest single product in its category, with three more sitting there in case you ever want them. That is still a good deal. We will not pressure you to use the rest.",
  },
  {
    q: "Will the price move as the suite grows?",
    a: "No. All four products are live now. As each one deepens, your price stays where it is. You pay for Signal Studio, not for a feature count, and we honor that by holding the price steady.",
  },
  {
    q: "Can I switch tiers?",
    a: "Anytime. Up, down, sideways. No annual contracts on the Workspace plan. Cancel and you keep access through the end of the current month.",
  },
  {
    q: "Why one price for four products?",
    a: "Because the four products are four kinds of clarity, not four tools. Pricing them separately would mean you have to translate between Notes, Tasks, Roadmap, and Analytics — which is the exact translation tax Signal Studio exists to remove.",
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

function eyebrowStyle(): React.CSSProperties {
  return {
    fontFamily: "var(--font-mono)",
    fontSize: 11,
    color: "var(--ink-quiet)",
    letterSpacing: "var(--tracking-eyebrow)",
    textTransform: "uppercase",
    fontWeight: 600,
  };
}

function statusPipColor(s: InsideProduct["status"]): string {
  if (s === "shipped") return "#10b981";
  return "#f59e0b";
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; upgrade?: string }>;
}) {
  const params = await searchParams;
  const checkoutOffline = params.status === "checkout-offline";

  return (
    <>
      <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
        {checkoutOffline ? (
          <div
            role="status"
            className="mx-auto w-full max-w-[1180px] px-6 pt-6"
            style={{ marginTop: 16 }}
          >
            <div
              style={{
                background: "var(--bg-deep)",
                border: "1px solid var(--border-soft)",
                borderRadius: 12,
                padding: "14px 18px",
                fontSize: 13.5,
                color: "var(--ink-soft)",
              }}
            >
              <strong style={{ color: "var(--ink)" }}>
                Checkout is temporarily offline.
              </strong>{" "}
              Workspace and Event purchases will resume when resolved. Free and
              Student access remain available — start there, or email{" "}
              <a
                href="mailto:hello@signalstudio.ie"
                style={{ color: "var(--ink)" }}
              >
                hello@signalstudio.ie
              </a>{" "}
              and we&apos;ll grant access manually.
            </div>
          </div>
        ) : null}

        {/* ── 1 · Frame ─────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1180px] px-6 pt-16 pb-20 md:pt-24 md:pb-24">
          <div className="mb-6" style={eyebrowStyle()}>
            Signal Studio · Pricing
          </div>
          <h1
            className="h-display max-w-[22ch] text-balance text-ink"
            style={{ marginBottom: 24 }}
          >
            One price. All the clarity you need.
          </h1>
          <p
            className="max-w-[56ch] text-ink-soft"
            style={{ fontSize: 19, lineHeight: 1.55 }}
          >
            One subscription. Use what you need — no per-seat tax, no per-product tax.
          </p>
        </section>

        {/* ── 2 · Suite reveal ──────────────────────────────────── */}
        <section
          style={{
            background: "var(--bg-deep)",
            borderTop: "1px solid var(--border-soft)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <div className="mx-auto w-full max-w-[1180px] px-6 py-16 md:py-20">
            <div className="mb-10" style={eyebrowStyle()}>
              The four products
            </div>
            <div className="grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
              {SUITE.map((p) => (
                <div key={p.key}>
                  <span
                    className="pricing-mark"
                    data-key={p.key}
                    style={{
                      fontSize: "clamp(1.875rem, 1.2rem + 2vw, 3rem)",
                    }}
                  >
                    <span className="word">{p.word}</span>
                    <span className="dot" aria-hidden />
                  </span>
                  <div
                    className="mt-3"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--ink-quiet)",
                      letterSpacing: "var(--tracking-eyebrow)",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {p.position}
                  </div>
                  <p
                    className="mt-2 text-ink-soft"
                    style={{ fontSize: 15, lineHeight: 1.5 }}
                  >
                    {p.position === "Execution" && "Run the work."}
                    {p.position === "Direction" && "Show where it's going."}
                    {p.position === "Context" && "Capture what was said."}
                    {p.position === "Attention" && "Surface what matters."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 · Tier grid ─────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
          <div className="mb-4" style={eyebrowStyle()}>
            Plans
          </div>
          <h2
            className="h-title text-balance text-ink"
            style={{ maxWidth: "20ch", marginBottom: 32 }}
          >
            Pick the one that matches how you work.
          </h2>

          <div
            className="text-ink-quiet"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Monthly billing
          </div>

          <p
            className="md:hidden text-ink-quiet"
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              marginBottom: 18,
              maxWidth: "44ch",
            }}
          >
            Planning one event? The €79 Event tier is the last card below.
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-elev)",
            }}
          >
            {TIERS.map((t, i) => (
              <div
                key={t.name}
                className={`flex flex-col md:min-h-[360px] ${i === 1 ? "order-2 md:order-none" : i === 2 ? "order-1 md:order-none" : i === 3 ? "order-3 md:order-none" : ""}`}
                style={{
                  padding: "36px 28px 32px",
                  borderRight:
                    i < TIERS.length - 1
                      ? "1px solid var(--border-soft)"
                      : "none",
                  borderBottom:
                    i < TIERS.length - 1
                      ? "1px solid var(--border-soft)"
                      : "none",
                  background: "transparent",
                  outline: t.recommended ? "1.5px solid var(--accent)" : "none",
                  outlineOffset: t.recommended ? "-1.5px" : undefined,
                  position: "relative",
                }}
              >
                {/* Anchor row — only filled for recommended; renders only at md+ where horizontal alignment matters. */}
                <div className="hidden md:block md:h-[26px] md:mb-[6px]">
                  {t.recommended ? (
                    <span
                      className="inline-flex items-center"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "var(--tracking-eyebrow)",
                        textTransform: "uppercase",
                        color: "var(--ink-quiet)",
                        fontWeight: 600,
                      }}
                    >
                      <span className="pricing-anchor-dot" aria-hidden />
                      Most chosen
                    </span>
                  ) : null}
                </div>

                <div
                  className="text-ink"
                  style={{
                    fontSize: 22,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {t.name}
                </div>

                <div
                  className="text-ink"
                  style={{
                    marginTop: 22,
                    fontSize: "clamp(2.25rem, 1.6rem + 1.8vw, 3.25rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.045em",
                    lineHeight: 1,
                  }}
                >
                  {t.price}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--ink-quiet)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {t.cadence}
                </div>

                {t.annual ? (
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 13,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {t.annualHref ? (
                      <Link
                        href={t.annualHref}
                        style={{
                          color: "var(--ink-soft)",
                          borderBottom: "1px solid var(--border)",
                          paddingBottom: 1,
                        }}
                      >
                        {t.annual}
                      </Link>
                    ) : (
                      t.annual
                    )}
                  </div>
                ) : null}

                <p
                  className="text-ink-soft"
                  style={{
                    marginTop: 22,
                    fontSize: 15,
                    lineHeight: 1.55,
                    flex: 1,
                  }}
                >
                  {t.body}
                </p>

                {t.pills ? (
                  <div
                    className="md:hidden flex flex-wrap gap-x-5 gap-y-2"
                    style={{
                      marginTop: 18,
                      marginBottom: 22,
                      borderTop: "1px solid var(--border-soft)",
                      paddingTop: 14,
                    }}
                    aria-label="Plan at a glance"
                  >
                    {t.pills.map((pill) => (
                      <div key={pill.label} className="flex flex-col">
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--ink-quiet)",
                            letterSpacing: "var(--tracking-eyebrow)",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          {pill.label}
                        </span>
                        <span
                          className="text-ink"
                          style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}
                        >
                          {pill.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <Link
                  href={t.href}
                  className="pricing-tier-cta"
                  data-recommended={t.recommended ? "true" : undefined}
                >
                  {t.cta}{" "}
                  <span className="cta-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3.5 · Side-by-side compare ────────────────────────── */}
        <section className="mx-auto w-full max-w-[1180px] px-6 pb-20 md:pb-24">
          <div className="mb-4" style={eyebrowStyle()}>
            Side by side
          </div>
          <h2
            className="h-title text-balance text-ink"
            style={{ maxWidth: "22ch", marginBottom: 12 }}
          >
            Same four products. Four shapes of access.
          </h2>
          <p
            className="text-ink-soft"
            style={{
              fontSize: 17,
              lineHeight: 1.55,
              maxWidth: "58ch",
              marginBottom: 36,
            }}
          >
            The tiers don't differ on which products you get. All four, every
            plan. They differ on shape — who it's for, how long it lasts, what
            stays when it ends.
          </p>

          <div
            className="hidden md:block"
            style={{
              border: "1px solid var(--border)",
              background: "var(--bg-elev)",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: 760,
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "22px 24px",
                      borderBottom: "1px solid var(--border-soft)",
                      fontWeight: 400,
                      width: "22%",
                    }}
                    aria-label="Dimension"
                  />
                  {TIERS.map((t) => (
                    <th
                      key={t.name}
                      scope="col"
                      style={{
                        padding: "22px 24px",
                        borderBottom: "1px solid var(--border-soft)",
                        borderLeft: "1px solid var(--border-soft)",
                        color: "var(--ink)",
                        background: t.recommended
                          ? "linear-gradient(180deg, color-mix(in srgb, var(--accent-soft) 60%, var(--bg-elev)) 0%, var(--bg-elev) 100%)"
                          : "transparent",
                        verticalAlign: "bottom",
                      }}
                    >
                      {t.recommended ? (
                        <div
                          className="inline-flex items-center"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "var(--tracking-eyebrow)",
                            textTransform: "uppercase",
                            color: "var(--ink-quiet)",
                            fontWeight: 600,
                            marginBottom: 8,
                          }}
                        >
                          <span className="pricing-anchor-dot" aria-hidden />
                          Most chosen
                        </div>
                      ) : null}
                      <div
                        style={{
                          fontSize: 17,
                          fontWeight: 600,
                          letterSpacing: "-0.015em",
                        }}
                      >
                        {t.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => {
                  const isLast = ri === COMPARE_ROWS.length - 1;
                  return (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        style={{
                          padding: "18px 24px",
                          borderBottom: isLast
                            ? "none"
                            : "1px solid var(--border-soft)",
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--ink-quiet)",
                          letterSpacing: "var(--tracking-eyebrow)",
                          textTransform: "uppercase",
                          verticalAlign: "top",
                          textAlign: "left",
                        }}
                      >
                        {row.label}
                      </th>
                      {row.values.map((v, ci) => {
                        const tier = TIERS[ci];
                        return (
                          <td
                            key={ci}
                            style={{
                              padding: "18px 24px",
                              borderBottom: isLast
                                ? "none"
                                : "1px solid var(--border-soft)",
                              borderLeft: "1px solid var(--border-soft)",
                              fontSize: 15,
                              lineHeight: 1.5,
                              color: "var(--ink-soft)",
                              background: tier.recommended
                                ? "color-mix(in srgb, var(--accent-soft) 35%, var(--bg-elev))"
                                : "transparent",
                              verticalAlign: "top",
                            }}
                          >
                            {v}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile compare — stacked per-tier blocks, md:hidden */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {TIERS.map((t, ti) => (
              <div
                key={t.name}
                className={ti === 1 ? "order-2" : ti === 2 ? "order-1" : ti === 3 ? "order-3" : ""}
                style={{
                  border: t.recommended ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  background: t.recommended
                    ? "color-mix(in srgb, var(--accent-soft) 20%, var(--bg-elev))"
                    : "var(--bg-elev)",
                }}
              >
                {/* Tier header */}
                <div
                  style={{
                    padding: "18px 20px 14px",
                    borderBottom: "1px solid var(--border-soft)",
                  }}
                >
                  {t.recommended ? (
                    <div
                      className="inline-flex items-center"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        letterSpacing: "var(--tracking-eyebrow)",
                        textTransform: "uppercase",
                        color: "var(--ink-quiet)",
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      <span className="pricing-anchor-dot" aria-hidden />
                      Most chosen
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.015em",
                      color: "var(--ink)",
                    }}
                  >
                    {t.name}
                  </div>
                </div>

                {/* Rows */}
                <dl style={{ margin: 0 }}>
                  {COMPARE_ROWS.map((row, ri) => {
                    const isLast = ri === COMPARE_ROWS.length - 1;
                    return (
                      <div
                        key={row.label}
                        className="flex items-start justify-between"
                        style={{
                          padding: "13px 20px",
                          borderBottom: isLast ? "none" : "1px solid var(--border-soft)",
                          gap: 16,
                        }}
                      >
                        <dt
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "var(--ink-quiet)",
                            letterSpacing: "var(--tracking-eyebrow)",
                            textTransform: "uppercase",
                            flexShrink: 0,
                            paddingTop: 2,
                          }}
                        >
                          {row.label}
                        </dt>
                        <dd
                          style={{
                            fontSize: 14,
                            lineHeight: 1.5,
                            color: "var(--ink-soft)",
                            margin: 0,
                            textAlign: "right",
                          }}
                        >
                          {row.values[ti]}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>

          <p
            className="text-ink-quiet"
            style={{
              marginTop: 20,
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            All tiers include every product, and every plan can read every
            briefing in the app. Two things that come to you instead — the
            morning briefing by email, and a forward-to address that turns mail
            into notes — are part of the Workspace tier. Nothing you make is
            ever locked away by plan.
          </p>
        </section>

        {/* ── 4 · What's inside ─────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
          <div className="mb-4" style={eyebrowStyle()}>
            What's in Signal Studio
          </div>
          <h2
            className="h-title text-balance text-ink"
            style={{ maxWidth: "20ch", marginBottom: 40 }}
          >
            Four products. One subscription.
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
            {SUITE.map((p) => (
              <div
                key={p.key}
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 24,
                }}
              >
                <div className="flex items-baseline" style={{ gap: 12, marginBottom: 14 }}>
                  <span
                    className="pricing-mark small"
                    data-key={p.key}
                    style={{ fontSize: 20 }}
                  >
                    <span className="word">{p.word}</span>
                    <span className="dot" aria-hidden />
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--ink-quiet)",
                      letterSpacing: "var(--tracking-eyebrow)",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                  >
                    {p.position}
                  </span>
                </div>
                <p
                  className="text-ink-soft"
                  style={{ fontSize: 15, lineHeight: 1.55 }}
                >
                  {p.desc}
                </p>
                <div
                  className="flex items-center"
                  style={{
                    marginTop: 18,
                    gap: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-quiet)",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: statusPipColor(p.status),
                      display: "inline-block",
                    }}
                  />
                  {p.statusLabel}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5 · Shipping truth ────────────────────────────────── */}
        <section
          style={{
            background: "var(--bg-deep)",
            borderTop: "1px solid var(--border-soft)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <div className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
            <div className="mb-6" style={eyebrowStyle()}>
              What we ship today
            </div>
            <div
              className="text-ink-soft"
              style={{
                maxWidth: "62ch",
                borderLeft: "2px solid var(--accent)",
                paddingLeft: 28,
              }}
            >
              <p style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 18 }}>
                Signal Studio is one subscription. Today,{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Signal Tasks</strong>,{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Signal Roadmap</strong>,{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Signal Notes</strong>, and{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Signal Analytics</strong> are live.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.6, marginBottom: 18 }}>
                Your price stays the same as the suite deepens. You pay for
                Signal Studio, not for a product count.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.6 }}>
                We will not list a feature on this page until the product behind
                it works.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6 · Event lane ────────────────────────────────────── */}
        <section
          style={{
            background: "var(--bg-elev)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
            <div className="mb-6" style={eyebrowStyle()}>
              Planning one event?
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:gap-16 md:items-end">
              <div>
                <h2
                  className="h-title text-balance text-ink"
                  style={{ maxWidth: "22ch" }}
                >
                  Signal Studio for one wedding, one launch, one move.
                </h2>
                <p
                  className="text-ink-soft"
                  style={{
                    marginTop: 20,
                    fontSize: 17,
                    lineHeight: 1.6,
                    maxWidth: "52ch",
                  }}
                >
                  €79 one-time. 12 months of full access. All four products in a
                  single event-shaped workspace. When the event is over, the
                  workspace keeps reading forever — a record of how the work
                  actually ran.
                </p>
              </div>
              <div className="flex flex-col md:items-end" style={{ gap: 18 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-quiet)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Event lane
                </span>
                <span
                  className="text-ink"
                  style={{
                    fontSize: "clamp(2.5rem, 1.8rem + 2vw, 3.75rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.045em",
                    lineHeight: 1,
                  }}
                >
                  €79
                </span>
                <div className="flex flex-col md:items-end" style={{ gap: 6 }}>
                  <Link
                    href="/weddings"
                    style={{
                      color: "var(--accent)",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    Plan an event{" "}
                    <span className="cta-arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                  <Link
                    href="/weddings"
                    style={{
                      color: "var(--ink-quiet)",
                      fontSize: 13,
                    }}
                  >
                    See how it works for weddings ↗
                  </Link>
                </div>
              </div>
            </div>
            {/* Venue Editions surface — quiet line, no CTA, no link.
                The couples this is for arrive via their venue, not
                via this page. The line exists for the small set of
                couples who looked here first. */}
            <p
              className="text-ink-quiet"
              style={{
                marginTop: 36,
                fontSize: 15,
                lineHeight: 1.55,
              }}
            >
              Planning a wedding? Ask your venue.
            </p>
          </div>
        </section>

        {/* ── 6.5 · For venues (paid patronage, ratified 2026-05-16) ─ */}
        <section
          style={{
            background: "var(--bg-deep)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <div className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
            <div className="mb-6" style={eyebrowStyle()}>
              For venues
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_auto] md:gap-16 md:items-start">
              <div>
                <h2
                  className="h-title text-balance text-ink"
                  style={{ maxWidth: "20ch" }}
                >
                  Stand behind every couple who books with you.
                </h2>
                <p
                  className="text-ink-soft"
                  style={{
                    marginTop: 20,
                    fontSize: 17,
                    lineHeight: 1.6,
                    maxWidth: "56ch",
                  }}
                >
                  The Venue Edition is patronage, not software. The venue pays
                  once a year. Every couple it sends gets twelve months of
                  Signal Studio to plan their wedding, with the venue&apos;s
                  name in a quiet line at the top. No seats. No per-couple
                  maths. Nothing for your team to run.
                </p>
                <p
                  className="text-ink-soft"
                  style={{
                    marginTop: 18,
                    fontSize: 17,
                    lineHeight: 1.6,
                    maxWidth: "56ch",
                  }}
                >
                  The first fifteen venues lock €1,500 for as long as they
                  stay. Not a discount — a standing. The couples never see a
                  price. They see a venue that thought ahead.
                </p>
                <div style={{ marginTop: 28 }}>
                  <Link
                    href="/venues"
                    style={{
                      color: "var(--accent)",
                      fontSize: 15,
                      fontWeight: 500,
                    }}
                  >
                    See the Founding Venue Programme{" "}
                    <span className="cta-arrow" aria-hidden>
                      →
                    </span>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col md:items-end" style={{ gap: 14 }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--ink-quiet)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Annual · prepaid
                </span>
                <span
                  className="text-ink"
                  style={{
                    fontSize: "clamp(2.25rem, 1.7rem + 1.8vw, 3.25rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.045em",
                    lineHeight: 1,
                  }}
                >
                  €1,500–€4,000
                </span>
                <span
                  className="text-ink-quiet"
                  style={{ fontSize: 13, lineHeight: 1.5 }}
                >
                  a year, by venue size
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7 · What this isn't ───────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
          <div className="mb-4" style={eyebrowStyle()}>
            What this isn't
          </div>
          <h2
            className="h-title text-balance text-ink"
            style={{ maxWidth: "24ch", marginBottom: 40 }}
          >
            Three things Signal Studio refuses to do.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {REFUSALS.map((r, i) => (
              <div
                key={r.neg}
                style={{
                  padding: i === 0 ? "0 28px 0 0" : "0 28px",
                  borderLeft:
                    i > 0 ? "1px solid var(--border-soft)" : "none",
                }}
              >
                <div
                  className="text-ink"
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                  }}
                >
                  {r.neg}
                </div>
                <p
                  className="text-ink-soft"
                  style={{ fontSize: 15, lineHeight: 1.55 }}
                >
                  {r.pos}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8 · FAQ ───────────────────────────────────────────── */}
        <section
          style={{
            background: "var(--bg-deep)",
            borderTop: "1px solid var(--border-soft)",
            borderBottom: "1px solid var(--border-soft)",
          }}
        >
          <div className="mx-auto w-full max-w-[1180px] px-6 py-20 md:py-24">
            <div className="mb-4" style={eyebrowStyle()}>
              Questions
            </div>
            <h2
              className="h-title text-balance text-ink"
              style={{ maxWidth: "24ch", marginBottom: 48 }}
            >
              The honest answers, in plain English.
            </h2>

            <div className="grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <div
                    className="text-ink"
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      marginBottom: 10,
                    }}
                  >
                    {f.q}
                  </div>
                  <p
                    className="text-ink-soft"
                    style={{ fontSize: 15, lineHeight: 1.6 }}
                  >
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9 · Quiet close ───────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1180px] px-6 pt-24 pb-24 md:pt-28 md:pb-28">
          <h2
            className="h-title text-balance text-ink"
            style={{ maxWidth: "14ch", marginBottom: 28 }}
          >
            Everything important. Nothing distracting.
          </h2>
          <p
            className="text-ink-soft"
            style={{
              maxWidth: "48ch",
              fontSize: 19,
              lineHeight: 1.55,
              marginBottom: 48,
            }}
          >
            One price. Four kinds of clarity. Built for everyone else.
          </p>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              letterSpacing: "0.04em",
              color: "var(--ink-quiet)",
            }}
          >
            <a
              href="mailto:hello@signalstudio.ie"
              style={{
                color: "var(--ink-soft)",
                borderBottom: "1px solid var(--ink-300)",
                paddingBottom: 1,
              }}
            >
              hello@signalstudio.ie
            </a>
            <span style={{ margin: "0 10px", color: "var(--accent)" }}>·</span>
            Dublin
            <span style={{ margin: "0 10px", color: "var(--accent)" }}>·</span>
            2026
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
