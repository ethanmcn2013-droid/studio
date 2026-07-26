"use client";

import { coverageTone, formatMetricValue } from "@/lib/account/format";
import type { AccountSnapshot } from "@/lib/account/types";
import { AccountIcon } from "../components/icons";
import { Metric } from "../components/metric";
import styles from "./access-ledger.module.css";

export function AccessLedgerOverview({
  snapshot,
  onOpenReport,
}: {
  snapshot: AccountSnapshot;
  onOpenReport: () => void;
}) {
  const totals = [
    ["Allotted", snapshot.access.allotted],
    ["Issued", snapshot.access.issued],
    ["Redeemed", snapshot.access.redeemed],
    ["Available", snapshot.access.available],
  ] as const;

  const lifecycle = [
    ["Redeemed", snapshot.adoption.redeemed],
    ["First useful action", snapshot.adoption.firstUsefulAction],
    ["Active recently", snapshot.adoption.activeRecently],
    ["Continued after 30 days", snapshot.adoption.continuedAfter30Days],
  ] as const;

  return (
    <div className={styles.root} data-concept="access-ledger">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>
            {snapshot.account.editionLabel} · operational review
          </p>
          <h1>{snapshot.account.name}</h1>
        </div>
        <div className={styles.meta}>
          <div>
            <span>Standing</span>
            <strong>{snapshot.term.standingLabel}</strong>
          </div>
          <div>
            <span>Term</span>
            <strong>{snapshot.term.label}</strong>
          </div>
          <div data-tone={coverageTone(snapshot.coverage.state)}>
            <span>Coverage</span>
            <strong>{snapshot.coverage.label}</strong>
          </div>
          <div>
            <span>Data through</span>
            <strong>{snapshot.coverage.dataThrough}</strong>
          </div>
        </div>
      </header>

      <section className={styles.ledger} aria-label="Access totals">
        <div className={styles.ledgerHead}>
          <h2>Access ledger</h2>
          <span>{snapshot.access.reconciliation.label}</span>
        </div>
        <div className={styles.totals}>
          {totals.map(([label, metric]) => (
            <Metric
              key={label}
              className={styles.total}
              metric={metric}
              label={label}
            />
          ))}
        </div>
      </section>

      <section className={styles.lifecycle} aria-label="Lifecycle progression">
        <div className={styles.ledgerHead}>
          <h2>Lifecycle progression</h2>
          <span>{snapshot.coverage.periodLabel}</span>
        </div>
        <div className={styles.steps} role="list">
          {lifecycle.map(([label, metric], index) => (
            <div key={label} role="listitem">
              <i aria-hidden="true">{String(index + 1)}</i>
              <strong>{formatMetricValue(metric)}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.row} aria-label="Next action and attention">
        <div className={styles.next}>
          <p className={styles.eyebrow}>Recommended action</p>
          <h2>{snapshot.nextAction.label}</h2>
          <p>{snapshot.nextAction.detail}</p>
          <button type="button" onClick={onOpenReport}>
            Open frozen report
            <AccountIcon name="arrow" />
          </button>
        </div>
        <div className={styles.attention}>
          <p className={styles.eyebrow}>Anonymous attention</p>
          <ul>
            {snapshot.access.attention.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
            <li>
              <strong>Days with sponsored use</strong>
              <span>
                Supporting metric:{" "}
                {formatMetricValue(snapshot.adoption.daysWithSponsoredUse)}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className={styles.products} aria-label="Product reach">
        <div className={styles.ledgerHead}>
          <h2>Product reach</h2>
          <span>Aggregate workspaces only</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Workspaces reached</th>
              <th>Evidence note</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.productReach.map((row) => (
              <tr key={row.product}>
                <td>{row.product}</td>
                <td>{formatMetricValue(row.workspacesReached)}</td>
                <td>{row.supportingDetail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className={styles.privacy}>
        <AccountIcon name="lock" />
        <div>
          <strong>{snapshot.privacyReceipt.headline}</strong>
          <span>{snapshot.brandLines.privacy}</span>
        </div>
      </footer>
    </div>
  );
}
