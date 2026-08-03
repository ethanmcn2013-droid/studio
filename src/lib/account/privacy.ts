import type { AccountSnapshot, MetricValue } from "./types";

const PROHIBITED_PATTERNS = [
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\bclerk_[a-z0-9]+\b/i,
  /\buser_[a-z0-9]+\b/i,
  /\bnote body\b/i,
  /\btask title\b/i,
  /\battachment\b/i,
];

export function assertMetricHasNoHiddenValue(metric: MetricValue): void {
  if (
    metric.state === "withheld" ||
    metric.state === "unavailable" ||
    metric.state === "unlimited"
  ) {
    if ("value" in metric && (metric as { value?: unknown }).value != null) {
      throw new Error(
        `MetricValue.${metric.state} must not carry a hidden numeric value`,
      );
    }
  }
}

export function walkMetricValues(
  snapshot: AccountSnapshot,
  visit: (metric: MetricValue, path: string) => void,
): void {
  const walkAccess = snapshot.access;
  (
    [
      ["access.allotted", walkAccess.allotted],
      ["access.available", walkAccess.available],
      ["access.issued", walkAccess.issued],
      ["access.redeemed", walkAccess.redeemed],
      ["adoption.allotted", snapshot.adoption.allotted],
      ["adoption.issued", snapshot.adoption.issued],
      ["adoption.redeemed", snapshot.adoption.redeemed],
      ["adoption.firstUsefulAction", snapshot.adoption.firstUsefulAction],
      ["adoption.activeRecently", snapshot.adoption.activeRecently],
      ["adoption.continuedAfter30Days", snapshot.adoption.continuedAfter30Days],
      ["adoption.daysWithSponsoredUse", snapshot.adoption.daysWithSponsoredUse],
    ] as const
  ).forEach(([path, metric]) => visit(metric, path));

  snapshot.productReach.forEach((row, index) => {
    visit(row.workspacesReached, `productReach[${index}].workspacesReached`);
  });
}

export function assertSnapshotPrivacy(snapshot: AccountSnapshot): string[] {
  const errors: string[] = [];

  walkMetricValues(snapshot, (metric, path) => {
    try {
      assertMetricHasNoHiddenValue(metric);
    } catch (error) {
      errors.push(`${path}: ${(error as Error).message}`);
    }
  });

  if (
    snapshot.coverage.state === "suppressed" &&
    snapshot.access.redeemed.state === "exact" &&
    snapshot.access.redeemed.value >= 3
  ) {
    errors.push(
      "Suppressed fixture must not show a redeemed population of 3+ while claiming a tiny eligible cohort",
    );
  }

  const serialized = JSON.stringify(snapshot);
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(serialized)) {
      errors.push(`Prohibited pattern found in snapshot: ${pattern}`);
    }
  }

  for (const code of snapshot.access.codes) {
    if (!code.maskedCode.includes("••••")) {
      errors.push(`Access code is not masked: ${code.maskedCode}`);
    }
  }

  return errors;
}

export function scanTextForPrivacyLeaks(text: string): string[] {
  const errors: string[] = [];
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(text)) {
      errors.push(`Prohibited pattern in rendered text: ${pattern}`);
    }
  }
  return errors;
}
