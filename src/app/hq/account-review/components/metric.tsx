import {
  formatMetricAccessibleLabel,
  formatMetricValue,
  formatRateAccessibleLabel,
  formatRateValue,
} from "@/lib/account/format";
import type { MetricValue, RateValue } from "@/lib/account/types";

export function Metric({
  metric,
  label,
  detail,
  className,
}: {
  metric: MetricValue;
  label: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={className} data-metric-state={metric.state}>
      <strong aria-label={formatMetricAccessibleLabel(metric, label)}>
        {formatMetricValue(metric)}
      </strong>
      <span>{label}</span>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

/**
 * The rate twin of `Metric`.
 *
 * It exists so a rate never has to be flattened into a count to be displayed.
 * There is no prop here that accepts a denominator from somewhere else.
 */
export function RateMetric({
  rate,
  label,
  detail,
  className,
}: {
  rate: RateValue;
  label: string;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={className} data-metric-state={rate.state}>
      <strong aria-label={formatRateAccessibleLabel(rate, label)}>
        {formatRateValue(rate)}
      </strong>
      <span>{label}</span>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

export function MetricText({
  metric,
  label,
}: {
  metric: MetricValue;
  label?: string;
}) {
  const value = formatMetricValue(metric);
  if (!label) return <>{value}</>;
  return <span aria-label={formatMetricAccessibleLabel(metric, label)}>{value}</span>;
}
