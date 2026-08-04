"use client";

import {
  coverageTone,
  formatMetricValue,
  formatRateValue,
} from "@/lib/account/format";
import type { AccountSnapshot, DesignConceptId } from "@/lib/account/types";
import { AccountIcon } from "./icons";
import { Metric, RateMetric } from "./metric";
import styles from "./report-preview.module.css";

export function ReportPreview({
  snapshot,
  concept,
  open,
  onClose,
}: {
  snapshot: AccountSnapshot;
  concept: DesignConceptId;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  const report = snapshot.reports[0];
  // Was: a percentage assembled here from the metric plus a denominator lifted
  // out of it. The rate now arrives whole and already suppressed (R-028).
  const continuation = formatRateValue(snapshot.adoption.continuedAfter30Days);

  return (
    <aside
      className={styles.preview}
      data-concept={concept}
      aria-label="Two-page report preview"
    >
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Frozen account report</p>
          <h2>{report?.title ?? "Account review"}</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close report preview">
          <AccountIcon name="x" />
        </button>
      </header>

      <div className={styles.pages}>
        <article className={styles.page} aria-label="Report page 1">
          <p className={styles.sampleMark}>{snapshot.sampleLabel}</p>
          <div className={styles.mast}>
            <span>signal studio</span>
            <strong>{snapshot.account.name}</strong>
          </div>
          <p className={styles.period}>
            {report?.periodLabel} · {snapshot.definitionVersion}
          </p>
          <h3>{snapshot.brandLines.hero}</h3>
          <p className={styles.standing}>
            {snapshot.term.standingLabel} · {snapshot.term.label} · Data through{" "}
            {snapshot.coverage.dataThrough}
          </p>

          <div className={styles.journey}>
            {(
              [
                ["Allotted", snapshot.adoption.allotted],
                ["Issued", snapshot.adoption.issued],
                ["Redeemed", snapshot.adoption.redeemed],
                ["First useful action", snapshot.adoption.firstUsefulAction],
                ["Active recently", snapshot.adoption.activeRecently],
              ] as const
            ).map(([label, metric]) => (
              <Metric
                key={label}
                className={styles.metric}
                metric={metric}
                label={label}
              />
            ))}
            <RateMetric
              className={styles.metric}
              rate={snapshot.adoption.continuedAfter30Days}
              label="Continued after 30 days"
            />
          </div>

          <div className={styles.reach}>
            <p className={styles.eyebrow}>Product reach</p>
            <ul>
              {snapshot.productReach.map((row) => (
                <li key={row.product}>
                  <span>{row.product}</span>
                  <strong>{formatMetricValue(row.workspacesReached)}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.next}>
            <p className={styles.eyebrow}>Recommended next action</p>
            <strong>{snapshot.nextAction.label}</strong>
            <span>{snapshot.nextAction.detail}</span>
          </div>
        </article>

        <article className={styles.page} aria-label="Report page 2">
          <p className={styles.sampleMark}>{snapshot.sampleLabel}</p>
          <h3>Reporting coverage and privacy</h3>
          <div
            className={styles.coverage}
            data-tone={coverageTone(snapshot.coverage.state)}
          >
            <strong>{snapshot.coverage.label}</strong>
            <span>{snapshot.coverage.detail}</span>
          </div>
          <dl className={styles.defs}>
            <div>
              <dt>Data through</dt>
              <dd>{snapshot.coverage.dataThrough}</dd>
            </div>
            <div>
              <dt>Definition version</dt>
              <dd>{snapshot.definitionVersion}</dd>
            </div>
            <div>
              <dt>30-day continuation</dt>
              <dd>{continuation}</dd>
            </div>
            <div>
              <dt>Days with sponsored use</dt>
              <dd>{formatMetricValue(snapshot.adoption.daysWithSponsoredUse)}</dd>
            </div>
          </dl>
          <p className={styles.privacy}>{snapshot.privacyReceipt.body}</p>
          <p className={styles.privacy}>
            {snapshot.privacyReceipt.withheldRule}
          </p>
          <ul className={styles.never}>
            {snapshot.privacyReceipt.neverIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className={styles.brandPrivacy}>{snapshot.brandLines.privacy}</p>
        </article>
      </div>

      <p className={styles.downloadNote}>
        <AccountIcon name="report" />
        Use Reports to download the deterministic sample PDF and CSV for this
        snapshot.
      </p>
    </aside>
  );
}
