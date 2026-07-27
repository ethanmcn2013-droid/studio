"use client";

import { coverageTone, formatMetricValue } from "@/lib/account/format";
import type { AccountSnapshot } from "@/lib/account/types";
import { AccountIcon } from "../components/icons";
import { Metric } from "../components/metric";
import styles from "./account-brief.module.css";

const JOURNEY = [
  ["Allotted", "allotted"],
  ["Issued", "issued"],
  ["Redeemed", "redeemed"],
  ["First useful action", "firstUsefulAction"],
  ["Active recently", "activeRecently"],
  ["Continued after 30 days", "continuedAfter30Days"],
] as const;

export function AccountBriefOverview({
  snapshot,
  onOpenReport,
}: {
  snapshot: AccountSnapshot;
  onOpenReport: () => void;
}) {
  return (
    <div className={styles.root} data-concept="account-brief">
      <section className={styles.hero} aria-labelledby="brief-hero-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            {snapshot.account.editionLabel} · {snapshot.term.label}
          </p>
          <h1 id="brief-hero-title">{snapshot.brandLines.hero}</h1>
          <p className={styles.lede}>
            A calm account review for renewal and governance. Access issued,
            taken up, and continued — without exposing private work.
          </p>
        </div>
        <aside
          className={styles.verdict}
          data-tone={coverageTone(snapshot.coverage.state)}
          aria-label="Account verdict"
        >
          <span>Account standing</span>
          <strong>{snapshot.term.standingLabel}</strong>
          <small>
            Term through {snapshot.term.end} · Data through{" "}
            {snapshot.coverage.dataThrough}
          </small>
          <em>{snapshot.coverage.label}</em>
        </aside>
      </section>

      <section className={styles.story} aria-label="Access and adoption journey">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.eyebrow}>Adoption story</p>
            <h2>From allotted access to continued use</h2>
          </div>
          <span>{snapshot.coverage.periodLabel}</span>
        </div>
        <ol className={styles.journey}>
          {JOURNEY.map(([label, key], index) => (
            <li key={key}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{formatMetricValue(snapshot.adoption[key])}</strong>
              <small>{label}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.action} aria-label="Recommended action">
        <div>
          <p className={styles.eyebrow}>Evidence-backed next step</p>
          <h2>{snapshot.nextAction.label}</h2>
          <p>{snapshot.nextAction.detail}</p>
        </div>
        <button type="button" onClick={onOpenReport}>
          Open corresponding report
          <AccountIcon name="arrow" />
        </button>
      </section>

      <div className={styles.split}>
        <section aria-label="Product reach">
          <p className={styles.eyebrow}>Product reach</p>
          <h2>Across Notes, Tasks, Timeline and Signal</h2>
          <ul className={styles.reach}>
            {snapshot.productReach.map((row) => (
              <li key={row.product}>
                <span>{row.product}</span>
                <Metric
                  className={styles.reachMetric}
                  metric={row.workspacesReached}
                  label="workspaces reached"
                  detail={row.supportingDetail}
                />
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.receipt} aria-label="Privacy receipt">
          <p className={styles.eyebrow}>Privacy receipt</p>
          <h2>{snapshot.privacyReceipt.headline}</h2>
          <p>{snapshot.privacyReceipt.body}</p>
          <p>{snapshot.privacyReceipt.withheldRule}</p>
          <div className={styles.lock}>
            <AccountIcon name="lock" />
            <span>{snapshot.brandLines.privacy}</span>
          </div>
        </section>
      </div>

      <footer className={styles.reconcile}>
        <span data-tone={snapshot.access.reconciliation.state}>
          {snapshot.access.reconciliation.label}
        </span>
        <small>{snapshot.access.reconciliation.detail}</small>
      </footer>
    </div>
  );
}
