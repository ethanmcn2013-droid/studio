import type { TimelineSeed } from "../types";

/**
 * Timeline seed — one "Monthly rhythm" project with items grouped by
 * status. Shape matches Timeline's data model. Item bodies are written
 * for a shared update view the staff and operator can read in under a
 * minute (so the team knows what is moving and what needs a decision).
 */
export const roadmap: TimelineSeed = {
  projects: [
    {
      slug: "monthly-rhythm",
      name: "Monthly rhythm",
      oneLiner:
        "What is closed, what is paying, what is moving, and what is owed before month-end.",
      accent: "#0e7490",
    },
  ],
  items: [
    {
      projectSlug: "monthly-rhythm",
      title: "Revenue close",
      description:
        "All takings reconciled. Bank deposits checked against till totals. Variance under one percent.",
      status: "shipped",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Payroll run",
      description:
        "Staff paid on the agreed date. Tax filings updated. Holiday accruals current.",
      status: "shipped",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Supplier invoices approved",
      description:
        "All supplier invoices for the month reviewed and queued for payment before the 28th.",
      status: "in-flight",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Stock reorder",
      description:
        "Items running low this week reordered. Lead times confirmed for next month's promotions.",
      status: "in-flight",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Marketing post for the month",
      description:
        "One post that names what is on this month, scheduled for the audience. Not all of them at once.",
      status: "in-flight",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Renewal review",
      description:
        "Supplier or service contract coming up for renewal. Terms reviewed before any auto-renew kicks in.",
      status: "waiting",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Rota for next month",
      description:
        "Next month's staffing pattern locked. Cover lined up for holidays. Training session date held.",
      status: "next",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Staff one-to-ones",
      description:
        "Thirty minutes with each staff member. What is going well, what is hard, one ask. Not skipped this month.",
      status: "next",
    },
    {
      projectSlug: "monthly-rhythm",
      title: "Accountant summary",
      description:
        "Month's revenue, payroll, supplier spend, and any one-off costs sent to the accountant in plain English.",
      status: "next",
    },
  ],
};
