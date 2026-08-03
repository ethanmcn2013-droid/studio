"use client";

import { useState } from "react";
import { coverageTone, formatMetricValue } from "@/lib/account/format";
import type { AccountSnapshot } from "@/lib/account/types";
import { ADOPTION_JOURNEY } from "@/lib/account/vocabulary";
import { AccountIcon } from "../components/icons";
import { Metric } from "../components/metric";
import styles from "./guided-review.module.css";

export function GuidedReviewOverview({
  snapshot,
  onOpenReport,
}: {
  snapshot: AccountSnapshot;
  onOpenReport: () => void;
}) {
  const [openDetail, setOpenDetail] = useState<"journey" | "reach" | "privacy">(
    "journey",
  );

  return (
    <div className={styles.root} data-concept="guided-review">
      <section className={styles.decision} aria-label="Account decision">
        <p className={styles.eyebrow}>
          {snapshot.account.editionLabel} · guided review
        </p>
        <p className={styles.kicker}>{snapshot.brandLines.hero}</p>
        <h1>
          {snapshot.term.standingLabel}.
          <span> One clear next step.</span>
        </h1>
        <div
          className={styles.verdictLine}
          data-tone={coverageTone(snapshot.coverage.state)}
        >
          <strong>{snapshot.coverage.label}</strong>
          <span>
            {snapshot.term.label} · Data through {snapshot.coverage.dataThrough}
          </span>
        </div>
      </section>

      <section className={styles.nextCard} aria-label="Recommended action">
        <div>
          <p className={styles.eyebrow}>Do this next</p>
          <h2>{snapshot.nextAction.label}</h2>
          <p>{snapshot.nextAction.detail}</p>
        </div>
        <div className={styles.nextActions}>
          <button type="button" className={styles.primary} onClick={onOpenReport}>
            Review the frozen report
            <AccountIcon name="arrow" />
          </button>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => setOpenDetail("journey")}
          >
            See adoption evidence
          </button>
        </div>
      </section>

      <div className={styles.progress} aria-label="Progressive detail">
        {(
          [
            ["journey", "Adoption journey"],
            ["reach", "Product reach"],
            ["privacy", "Privacy receipt"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-expanded={openDetail === id}
            data-active={openDetail === id}
            onClick={() => setOpenDetail(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {openDetail === "journey" ? (
        <section className={styles.panel} aria-label="Adoption journey">
          <ol>
            {ADOPTION_JOURNEY.map(([label, key], index) => (
              <li key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{formatMetricValue(snapshot.adoption[key])}</strong>
                  <small>{label}</small>
                </div>
              </li>
            ))}
          </ol>
          <p className={styles.support}>
            Days with sponsored use:{" "}
            {formatMetricValue(snapshot.adoption.daysWithSponsoredUse)} ·
            supporting metric only.
          </p>
        </section>
      ) : null}

      {openDetail === "reach" ? (
        <section className={styles.panel} aria-label="Product reach">
          <div className={styles.reachGrid}>
            {snapshot.productReach.map((row) => (
              <Metric
                key={row.product}
                className={styles.reachMetric}
                metric={row.workspacesReached}
                label={row.product}
                detail={row.supportingDetail}
              />
            ))}
          </div>
        </section>
      ) : null}

      {openDetail === "privacy" ? (
        <section className={styles.panel} aria-label="Privacy receipt">
          <h2>{snapshot.privacyReceipt.headline}</h2>
          <p>{snapshot.privacyReceipt.body}</p>
          <p>{snapshot.privacyReceipt.withheldRule}</p>
          <ul>
            {snapshot.privacyReceipt.neverIncludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className={styles.lock}>
            <AccountIcon name="lock" />
            <span>{snapshot.brandLines.privacy}</span>
          </div>
        </section>
      ) : null}
    </div>
  );
}
