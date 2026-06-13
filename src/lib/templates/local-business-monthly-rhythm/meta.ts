import type { WorkspaceTemplate } from "../types";

type TemplateMeta = Pick<
  WorkspaceTemplate,
  "id" | "name" | "description" | "icon" | "domain" | "audience" | "problem" | "seoSummary"
>;

export const meta: TemplateMeta = {
  id: "local-business-monthly-rhythm",
  name: "Monthly business rhythm",
  description:
    "Month-end close, payroll, suppliers, marketing, staff one-to-ones — a cadence that holds a small operation together.",
  icon: "calendar",
  domain: "marketing",
  audience: "small-business-operator",
  problem:
    "Running a small business is part operations, part people, part sales — and nobody is watching for what's slipping. The monthly rhythm catches it before the bank reconciliation does.",
  seoSummary:
    "A starter workspace for restaurants, shops, clinics, and studios. The monthly cadence that keeps payroll on time, suppliers paid, marketing posted, staff one-to-ones happening, and the month-end close honest — without a status meeting, a manager, or a project-management vocabulary. Pairs with a private Notes notebook for owner thinking, a shared Timeline update for the staff, and a daily Signal briefing that catches the renewal coming up before it slips.",
};
