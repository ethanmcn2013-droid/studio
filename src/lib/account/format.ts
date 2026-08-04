import type { MetricValue } from "./types";

export function formatMetricValue(metric: MetricValue): string {
  switch (metric.state) {
    case "exact":
      return String(metric.value);
    case "lower_bound":
      return `${metric.value}+`;
    case "withheld":
      return "Withheld";
    case "unavailable":
      return "Unavailable";
    case "unlimited":
      return "Unlimited";
  }
}

export function formatMetricAccessibleLabel(
  metric: MetricValue,
  label: string,
): string {
  switch (metric.state) {
    case "exact":
      return `${label}: ${metric.value}`;
    case "lower_bound":
      return `${label}: at least ${metric.value}`;
    case "withheld":
      return `${label}: withheld for small-group privacy protection`;
    case "unavailable":
      return `${label}: unavailable. ${metric.reason}`;
    case "unlimited":
      return `${label}: unlimited. Every couple who books is covered`;
  }
}

/** Numeric value for charts/exports — never invents zero for missing data. */
export function metricNumericOrNull(metric: MetricValue): number | null {
  if (metric.state === "exact" || metric.state === "lower_bound") {
    return metric.value;
  }
  return null;
}

export function metricRateLabel(
  numerator: MetricValue,
  denominator: MetricValue,
): string {
  if (
    numerator.state !== "exact" ||
    denominator.state !== "exact" ||
    denominator.value === 0
  ) {
    // A rate against an unlimited denominator has no meaning. Saying so beats
    // printing a percentage of infinity or, worse, of zero.
    if (numerator.state === "unlimited" || denominator.state === "unlimited") {
      return "Not applicable";
    }
    if (numerator.state === "withheld" || denominator.state === "withheld") {
      return "Withheld";
    }
    if (
      numerator.state === "unavailable" ||
      denominator.state === "unavailable" ||
      numerator.state === "lower_bound" ||
      denominator.state === "lower_bound"
    ) {
      return "Not available";
    }
    return "Not available";
  }
  return `${Math.round((numerator.value / denominator.value) * 100)}%`;
}

export function coverageTone(
  state: "complete" | "partial" | "suppressed" | "unavailable",
): "good" | "attention" | "quiet" {
  if (state === "complete") return "good";
  if (state === "unavailable") return "quiet";
  return "attention";
}
