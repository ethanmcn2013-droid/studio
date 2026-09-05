import { COMMERCIAL_TERMS } from "../commercial-terms";

/** January target and explicit manual decisions. Cash and dates do not launch. */
export const LAUNCH_DATE = COMMERCIAL_TERMS.broadLaunchDate;
export const LAUNCH_LABEL = new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${LAUNCH_DATE}T00:00:00Z`));

export type GateState = "clear" | "pending";
export type LaunchGate = {
  key: string; label: string; detail: string; state: GateState; live: boolean; href?: string;
};
export type LaunchReadiness = {
  launchDate: string; launchLabel: string; daysRemaining: number; weeksRemaining: number;
  gates: LaunchGate[]; cleared: number; total: number;
  /** No release decision source is wired. A passed target is never approval. */
  launched: boolean;
};

/** The paid count is retained for caller compatibility, never used as launch authority. */
export function getLaunchReadiness(_paidVenues: number | null, now = Date.now()): LaunchReadiness {
  const startOfToday = Math.floor(now / 86400000) * 86400000;
  const daysRemaining = Math.max(0, Math.round((Date.parse(`${LAUNCH_DATE}T00:00:00Z`) - startOfToday) / 86400000));
  const gates: LaunchGate[] = COMMERCIAL_TERMS.launchProgramme.manualGates.map((key) => ({
    key,
    label: key === "user_launch" ? "User launch decision" : "First outreach decision",
    detail: "Pending recorded manual go/no-go against the six programme acceptance states.",
    state: "pending", live: false, href: "/hq/platform-readiness",
  }));
  return {
    launchDate: LAUNCH_DATE, launchLabel: LAUNCH_LABEL, daysRemaining,
    weeksRemaining: Math.ceil(daysRemaining / 7), gates, cleared: 0, total: gates.length,
    launched: false,
  };
}
