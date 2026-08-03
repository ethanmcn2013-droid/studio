"use client";

import {
  coverageTone,
  formatMetricValue,
  metricNumericOrNull,
} from "@/lib/account/format";
import { roleCan, roleDenialReason } from "@/lib/account/roles";
import type { AccountRole, AccountSnapshot } from "@/lib/account/types";
import { AccountIcon } from "../components/icons";
import { Metric } from "../components/metric";
import styles from "./usage-panel.module.css";
import shared from "./shared.module.css";

export function UsagePanel({
  snapshot,
  role,
}: {
  snapshot: AccountSnapshot;
  role: AccountRole;
}) {
  if (!roleCan(role, "view_usage")) {
    return (
      <div className={styles.root}>
        <p className={styles.denial} role="note">
          {roleDenialReason(role, "view_usage")}
        </p>
      </div>
    );
  }

  const canCompare =
    snapshot.coverage.state === "complete" &&
    snapshot.definitionVersion === "account-metrics.v2";

  const chartValues = [
    snapshot.adoption.firstUsefulAction,
    snapshot.adoption.activeRecently,
    snapshot.adoption.continuedAfter30Days,
  ].map((metric) => metricNumericOrNull(metric));

  // Never render decorative empty bars for suppressed/unavailable/partial metrics.
  const showBars =
    snapshot.coverage.state === "complete" &&
    chartValues.every((value) => value != null);

  return (
    <div className={styles.root}>
      <header className={shared.compactHead}>
        <div>
          <p className={shared.eyebrow}>
            Usage · {snapshot.coverage.periodLabel}
          </p>
          <h1>{snapshot.brandLines.usage}</h1>
          <p>
            Lifecycle evidence for sponsored access. Visits never count.
            Private work never enters this report.
          </p>
        </div>
        <aside
          className={styles.coverage}
          data-tone={coverageTone(snapshot.coverage.state)}
        >
          <strong>{snapshot.coverage.label}</strong>
          <span>{snapshot.coverage.detail}</span>
        </aside>
      </header>

      <div className={styles.lifecycle}>
        <Metric
          className={styles.card}
          metric={snapshot.adoption.firstUsefulAction}
          label="First useful action"
          detail="Reached a committed product action"
        />
        <Metric
          className={styles.card}
          metric={snapshot.adoption.activeRecently}
          label="Recent use"
          detail="Active in the current window"
        />
        <Metric
          className={styles.card}
          metric={snapshot.adoption.continuedAfter30Days}
          label="30-day continuation"
          detail="Still active after first month"
        />
        <Metric
          className={styles.card}
          metric={snapshot.adoption.daysWithSponsoredUse}
          label="Days with sponsored use"
          detail="Supporting metric only"
        />
      </div>

      <section className={styles.explain} aria-label="How reporting works">
        <div>
          <p className={shared.eyebrow}>How reporting works</p>
          <h2>What counts, and what never appears</h2>
          <p>
            First useful action means a committed note, task, timeline, or
            deliberately opened briefing. Page loads do not count. Names,
            emails, note text, task content, Timeline content, comments, and
            attachments are never projected.
          </p>
        </div>
        <div className={shared.lockNote}>
          <AccountIcon name="lock" />
          <span>
            {snapshot.privacyReceipt.withheldRule} Incomplete reporting is never
            shown as zero.
          </span>
        </div>
      </section>

      <section aria-label="Product reach">
        <div className={styles.sectionHead}>
          <h2>Product reach</h2>
          <span>Aggregate workspaces only</span>
        </div>
        <ul className={styles.reach}>
          {snapshot.productReach.map((row) => (
            <li key={row.product}>
              <span>{row.product}</span>
              <strong>{formatMetricValue(row.workspacesReached)}</strong>
              <small>{row.supportingDetail}</small>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Lifecycle chart">
        <div className={styles.sectionHead}>
          <h2>Lifecycle shape</h2>
          <span>
            {showBars
              ? "Comparable complete coverage"
              : "Chart withheld · text state only"}
          </span>
        </div>
        {showBars ? (
          <div className={styles.bars} role="img" aria-label="Lifecycle bars">
            {[
              "First useful action",
              "Recent use",
              "Continued after 30 days",
            ].map((label, index) => {
              const value = chartValues[index] as number;
              const height = Math.max(12, Math.min(100, value * 6));
              return (
                <div key={label}>
                  <i style={{ height: `${height}%` }} data-empty="false" />
                  <span>{label}</span>
                  <strong>{String(value)}</strong>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.textState} role="status">
            <strong>{snapshot.coverage.label}</strong>
            <p>
              Lifecycle bars stay hidden when coverage is incomplete or metrics
              are unavailable. Values above remain labeled as withheld,
              unavailable, or partial, never as empty bars or zeros.
            </p>
            <ul>
              <li>
                First useful action ·{" "}
                {formatMetricValue(snapshot.adoption.firstUsefulAction)}
              </li>
              <li>
                Recent use ·{" "}
                {formatMetricValue(snapshot.adoption.activeRecently)}
              </li>
              <li>
                Continued after 30 days ·{" "}
                {formatMetricValue(snapshot.adoption.continuedAfter30Days)}
              </li>
            </ul>
          </div>
        )}
        {!canCompare ? (
          <p className={styles.compareNote}>
            Prior-period change is shown only when both periods have complete,
            comparable coverage and matching definition versions.
          </p>
        ) : (
          <p className={styles.compareNote}>
            Versus prior complete window: continuation holds at the same
            definition version ({snapshot.definitionVersion}).
          </p>
        )}
      </section>
    </div>
  );
}
