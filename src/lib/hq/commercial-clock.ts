import { COMMERCIAL_TERMS } from "../commercial-terms";

/** No authorised first-send receipt reader is wired. CRM dates are not one. */
export function getCommercialClock(now = Date.now()) {
  const launchTarget = COMMERCIAL_TERMS.launchProgramme.firstOutreachDate;
  const prelaunch = new Date(now).toISOString().slice(0, 10) < launchTarget;
  const targetLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${launchTarget}T00:00:00Z`));
  return {
    state: prelaunch ? "prelaunch" as const : "inert" as const,
    launchTarget,
    campaignStart: null,
    campaignEnd: null,
    m3Gate: null,
    notStarted: true,
    line: prelaunch
      ? `Internal testing only until the ${targetLabel} target. Launch and first outreach require recorded manual decisions. No commercial clock has started.`
      : `The ${targetLabel} target is not send authority. No authorised first-outreach receipt is connected here; the commercial clock remains inert. Confirm the recorded manual decisions and actual send evidence.`,
  };
}
