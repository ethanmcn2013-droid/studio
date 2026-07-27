import {
  formatMetricAccessibleLabel,
  formatMetricValue,
} from "@/lib/account/format";
import type { MetricValue } from "@/lib/account/types";

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
