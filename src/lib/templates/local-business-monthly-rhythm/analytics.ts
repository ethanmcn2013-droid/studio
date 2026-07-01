import type { AnalyticsHint } from "../types";

/**
 * Signal hint — detector ids the briefing engine weights up for
 * workspaces created from this template. The small-business operator
 * misses things in two patterns: deadlines that drift past month-end
 * (renewals, payroll, supplier pay), and people work that quietly
 * slips (one-to-ones, training, rota cover).
 */
export const analytics: AnalyticsHint = {
  detectors: [
    "renewal-deadline-approaching",
    "supplier-payment-due",
    "payroll-run-pending",
    "staff-one-to-one-skipped",
    "stock-running-low",
    "month-end-close-incomplete",
    "marketing-post-overdue",
  ],
  weights: {
    "renewal-deadline-approaching": 1.8,
    "month-end-close-incomplete": 1.5,
    "staff-one-to-one-skipped": 1.3,
  },
};
