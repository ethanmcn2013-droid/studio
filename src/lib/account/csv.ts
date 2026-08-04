import type { AccountSnapshot, MetricValue, RateValue } from "./types";

type CsvRow = {
  account_name: string;
  edition: string;
  period_start: string;
  period_end: string;
  coverage_state: string;
  data_through: string;
  metric_key: string;
  value_state: string;
  value: string;
  denominator: string;
  unit: string;
  definition_version: string;
  withheld_reason: string;
};

const HEADER = [
  "account_name",
  "edition",
  "period_start",
  "period_end",
  "coverage_state",
  "data_through",
  "metric_key",
  "value_state",
  "value",
  "denominator",
  "unit",
  "definition_version",
  "withheld_reason",
] as const;

function metricFields(metric: MetricValue): Pick<
  CsvRow,
  "value_state" | "value" | "denominator" | "withheld_reason"
> {
  switch (metric.state) {
    case "exact":
      return {
        value_state: "exact",
        value: String(metric.value),
        denominator:
          metric.denominator === undefined ? "" : String(metric.denominator),
        withheld_reason: "",
      };
    case "lower_bound":
      return {
        value_state: "lower_bound",
        value: String(metric.value),
        denominator:
          metric.denominator === undefined ? "" : String(metric.denominator),
        withheld_reason: "",
      };
    case "withheld":
      return {
        value_state: "withheld",
        value: "",
        denominator: "",
        withheld_reason: metric.reason,
      };
    case "unavailable":
      return {
        value_state: "unavailable",
        value: "",
        denominator: "",
        withheld_reason: metric.reason,
      };
    case "unlimited":
      // Blank, never 0. An export that says 0 codes remaining against an
      // unlimited entitlement is the same lie as showing it on screen.
      return {
        value_state: "unlimited",
        value: "",
        denominator: "",
        withheld_reason: "",
      };
  }
}

/**
 * A rate exports as one row carrying both its numbers.
 *
 * There is no path here that writes a numerator without its denominator, which
 * is what stopped a spreadsheet becoming the place the floor was forgotten.
 */
function rateFields(rate: RateValue): Pick<
  CsvRow,
  "value_state" | "value" | "denominator" | "withheld_reason"
> {
  switch (rate.state) {
    case "rate":
      return {
        value_state: "rate",
        value: String(rate.numerator),
        denominator: String(rate.denominator),
        withheld_reason: "",
      };
    case "withheld":
      return {
        value_state: "withheld",
        value: "",
        denominator: "",
        withheld_reason: rate.reason,
      };
    case "unavailable":
      return {
        value_state: "unavailable",
        value: "",
        denominator: "",
        withheld_reason: rate.reason,
      };
  }
}

function row(
  snapshot: AccountSnapshot,
  metricKey: string,
  metric: MetricValue,
  unit: string,
): CsvRow {
  return {
    account_name: snapshot.account.name,
    edition: snapshot.edition,
    period_start: snapshot.coverage.periodStart,
    period_end: snapshot.coverage.periodEnd,
    coverage_state: snapshot.coverage.state,
    data_through: snapshot.coverage.dataThrough,
    metric_key: metricKey,
    unit,
    definition_version: snapshot.definitionVersion,
    ...metricFields(metric),
  };
}

function rateRow(
  snapshot: AccountSnapshot,
  metricKey: string,
  rate: RateValue,
  unit: string,
): CsvRow {
  return {
    account_name: snapshot.account.name,
    edition: snapshot.edition,
    period_start: snapshot.coverage.periodStart,
    period_end: snapshot.coverage.periodEnd,
    coverage_state: snapshot.coverage.state,
    data_through: snapshot.coverage.dataThrough,
    metric_key: metricKey,
    unit,
    definition_version: snapshot.definitionVersion,
    ...rateFields(rate),
  };
}

export function snapshotToCsvRows(snapshot: AccountSnapshot): CsvRow[] {
  const rows: CsvRow[] = [
    row(snapshot, "access.allotted", snapshot.access.allotted, "codes"),
    row(snapshot, "access.available", snapshot.access.available, "codes"),
    row(snapshot, "access.issued", snapshot.access.issued, "codes"),
    row(snapshot, "access.redeemed", snapshot.access.redeemed, "codes"),
    row(
      snapshot,
      "adoption.first_useful_action",
      snapshot.adoption.firstUsefulAction,
      "workspaces",
    ),
    row(
      snapshot,
      "adoption.active_recently",
      snapshot.adoption.activeRecently,
      "workspaces",
    ),
    rateRow(
      snapshot,
      "adoption.continued_after_30_days",
      snapshot.adoption.continuedAfter30Days,
      "workspaces",
    ),
    row(
      snapshot,
      "adoption.days_with_sponsored_use",
      snapshot.adoption.daysWithSponsoredUse,
      "days",
    ),
  ];

  for (const product of snapshot.productReach) {
    rows.push(
      row(
        snapshot,
        `product_reach.${product.product.toLowerCase()}`,
        product.workspacesReached,
        "workspaces",
      ),
    );
  }

  return rows;
}

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function snapshotToCsv(snapshot: AccountSnapshot): string {
  const meta = [
    `# ${snapshot.sampleLabel}`,
    `# snapshot_id=${snapshot.snapshotId}`,
    `# definition_version=${snapshot.definitionVersion}`,
  ];
  const rows = snapshotToCsvRows(snapshot);
  const body = [
    HEADER.join(","),
    ...rows.map((item) =>
      HEADER.map((key) => escapeCsv(item[key])).join(","),
    ),
  ];
  return `${meta.join("\n")}\n${body.join("\n")}\n`;
}

export function csvFilename(snapshot: AccountSnapshot): string {
  const stem =
    snapshot.reports[0]?.filenameStem ??
    `${snapshot.account.accountId}-account-review`;
  return `${stem}.csv`;
}

export function pdfFilename(snapshot: AccountSnapshot): string {
  const stem =
    snapshot.reports[0]?.filenameStem ??
    `${snapshot.account.accountId}-account-review`;
  return `${stem}.pdf`;
}
