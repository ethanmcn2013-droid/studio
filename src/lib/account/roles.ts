/**
 * Venue account roles and capabilities.
 *
 * WHAT THIS GOVERNS TODAY: the four /hq/account-review panels, which are
 * a founder-facing review fixture. Nothing else imports `roleCan`. There
 * is no venue-authenticated route anywhere in the product (R-043), so no
 * venue currently holds any of these roles, and this file is a
 * specification rather than a running control. Do not cite it as evidence
 * that venue authorisation is implemented (E08.05).
 *
 * `docs/venue-portal/ROLES_AND_PERMISSIONS.md` describes a larger design
 * — four roles including a Signal operator, a thirteen-row matrix, and a
 * `sponsor_members` lifecycle. None of that is implemented; grep for
 * `sponsor_members` returns nothing. The three roles below are what
 * exists.
 *
 * The full truth table, and the rule that no venue role may ever hold a
 * capability reaching couple content, are enforced in
 * `role-matrix.test.ts`.
 */

import type { AccountRole } from "./types";

export type AccountCapability =
  | "view_usage"
  | "view_reports"
  | "download_reports"
  | "manage_members"
  | "edit_reporting_preferences"
  | "request_access";

const ROLE_CAPABILITIES: Record<AccountRole, AccountCapability[]> = {
  owner: [
    "view_usage",
    "view_reports",
    "download_reports",
    "manage_members",
    "edit_reporting_preferences",
    "request_access",
  ],
  manager: [
    "view_usage",
    "view_reports",
    "download_reports",
    "edit_reporting_preferences",
    "request_access",
  ],
  viewer: ["view_usage", "view_reports"],
};

export function roleCan(role: AccountRole, capability: AccountCapability) {
  return ROLE_CAPABILITIES[role].includes(capability);
}

/** Point-of-denial copy when a control is disabled by role. */
export function roleDenialReason(
  role: AccountRole,
  capability: AccountCapability,
): string | null {
  if (roleCan(role, capability)) return null;
  switch (capability) {
    case "request_access":
      return "Viewers can inspect access, but only Owners and Managers can request more.";
    case "download_reports":
      return "Viewers can open report previews. PDF and CSV download require Owner or Manager.";
    case "edit_reporting_preferences":
      return "Reporting preferences are Owner or Manager only in this review fixture.";
    case "manage_members":
      return "Only Owners can invite or change account members.";
    case "view_usage":
      return "This role cannot view usage.";
    case "view_reports":
      return "This role cannot view reports.";
  }
}

export const ROLE_OPTIONS: Array<{ value: AccountRole; label: string }> = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "Viewer" },
];
