import type { TaskSeed } from "../types";

/**
 * Tasks seed for the small-business monthly rhythm. The pattern is one
 * full operating month, close, pay, supply, market, manage, written
 * for an owner-operator running between front-of-house and back-office.
 */
export const tasks: TaskSeed[] = [
  {
    title: "Month-end revenue close, all takings reconciled",
    lane: "done",
    priority: "p1",
    tags: ["close", "books"],
  },
  {
    title: "Payroll run for the team",
    lane: "done",
    priority: "p1",
    tags: ["payroll", "people"],
  },
  {
    title: "Approve supplier invoices for this month",
    lane: "doing",
    priority: "p0",
    due: "Today",
    tags: ["suppliers", "books"],
  },
  {
    title: "Send marketing post for the month",
    lane: "doing",
    priority: "p1",
    due: "Fri",
    tags: ["marketing"],
  },
  {
    title: "Reorder the supplies running low",
    lane: "doing",
    priority: "p0",
    due: "Tomorrow",
    tags: ["suppliers", "stock"],
  },
  {
    title: "Pay the bills due before the 28th",
    lane: "doing",
    priority: "p0",
    due: "Mon",
    tags: ["books"],
  },
  {
    title: "Review the rota for next month",
    lane: "review",
    priority: "p1",
    tags: ["people", "rota"],
  },
  {
    title: "Walk the floor with the front-of-house lead",
    lane: "review",
    priority: "p1",
    tags: ["people", "ops"],
  },
  {
    title: "Renewal coming up, review terms before signing",
    lane: "review",
    priority: "p1",
    tags: ["renewal", "books"],
  },
  {
    title: "Staff one-to-ones for the month",
    lane: "todo",
    priority: "p1",
    tags: ["people"],
  },
  {
    title: "Update the till float and weekly cash limit",
    lane: "todo",
    priority: "p2",
    tags: ["ops", "books"],
  },
  {
    title: "Email the accountant the month's summary",
    lane: "todo",
    priority: "p1",
    tags: ["books"],
  },
  {
    title: "Schedule next month's marketing posts",
    lane: "todo",
    priority: "p2",
    tags: ["marketing"],
  },
  {
    title: "Refresh the menu / window display / waiting-room board",
    lane: "todo",
    priority: "p2",
    tags: ["ops"],
  },
  {
    title: "Plan the staff training session for the quarter",
    lane: "todo",
    priority: "p2",
    tags: ["people", "training"],
  },
  {
    title: "Review last month's reviews and complaints",
    lane: "todo",
    priority: "p2",
    tags: ["ops", "customer"],
  },
  {
    title: "Confirm cover for owner days off",
    lane: "todo",
    priority: "p2",
    tags: ["people", "rota"],
  },
  {
    title: "Write the one-line update for the staff group",
    lane: "todo",
    priority: "p3",
    tags: ["update"],
  },
];
