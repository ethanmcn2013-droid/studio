"use client";

import {
  coverageTone,
  formatMetricValue,
  metricRateLabel,
} from "@/lib/account/format";
import type { AccountSnapshot, DesignConceptId } from "@/lib/account/types";
import { ADOPTION_JOURNEY } from "@/lib/account/vocabulary";
import { AccountIcon } from "./icons";
import { Metric } from "./metric";
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
  const continuation =
    snapshot.adoption.continuedAfter30Days.state === "exact" &&
    snapshot.adoption.continuedAfter30Days.denominator
      ? metricRateLabel(
          snapshot.adoption.continuedAfter30Days,
          {
            state: "exact",
            value: snapshot.adoption.continuedAfter30Days.denominator,
          },
        )
      : formatMetricValue(snapshot.adoption.continuedAfter30Days);

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
            {ADOPTION_JOURNEY.map(([label, key]) => (
              <Metric
                key={label}
                className={styles.metric}
                metric={snapshot.adoption[key]}
                label={label}
              />
            ))}
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
