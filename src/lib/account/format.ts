import type { MetricValue, RateValue } from "./types";

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

/**
 * The only way to render a rate.
 *
 * There is deliberately no function here that takes two metrics and divides
 * them. That was R-028: `metricRateLabel(numerator, denominator)` accepted any
 * two values from anywhere and printed a percentage with no floor, so a cohort
 * of two rendered as "50%". A rate now arrives already suppressed or already
 * publishable, and this function only decides how to say it.
 */
export function formatRateValue(rate: RateValue): string {
  switch (rate.state) {
    case "rate":
      return `${Math.round((rate.numerator / rate.denominator) * 100)}%`;
    case "withheld":
      return "Withheld";
    case "unavailable":
      return "Unavailable";
  }
}

export function formatRateAccessibleLabel(
  rate: RateValue,
  label: string,
): string {
  switch (rate.state) {
    case "rate":
      return `${label}: ${formatRateValue(rate)}, ${rate.numerator} of ${rate.denominator}`;
    case "withheld":
      return `${label}: withheld for small-group privacy protection`;
    case "unavailable":
      return `${label}: unavailable. ${rate.reason}`;
  }
}

/** Numeric value for charts/exports — never invents zero for a withheld rate. */
export function rateNumericOrNull(rate: RateValue): number | null {
  return rate.state === "rate" ? rate.numerator / rate.denominator : null;
}

export function coverageTone(
  state: "complete" | "partial" | "suppressed" | "unavailable",
): "good" | "attention" | "quiet" {
  if (state === "complete") return "good";
  if (state === "unavailable") return "quiet";
  return "attention";
}
