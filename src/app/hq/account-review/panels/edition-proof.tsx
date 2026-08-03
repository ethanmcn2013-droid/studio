"use client";

import { formatMetricValue } from "@/lib/account/format";
import { getEditionProof } from "@/lib/account/fixtures";
import { ADOPTION_JOURNEY } from "@/lib/account/vocabulary";
import { AccountIcon } from "../components/icons";
import styles from "./edition-proof.module.css";
import shared from "./shared.module.css";

const JOURNEY = ADOPTION_JOURNEY;

export function EditionProof({
  edition,
}: {
  edition: "education" | "organisation";
}) {
  const proof = getEditionProof(edition);
  const report = proof.reports[0];

  return (
    <div className={styles.root} data-edition={edition}>
      <header className={styles.masthead}>
        <div className={styles.brand}>
          <span aria-hidden="true" />
          <strong>signal studio</strong>
          <small>{proof.account.editionLabel}</small>
        </div>
        <div className={styles.meta}>
          <span>{proof.account.name}</span>
          <small>{proof.coverage.periodLabel}</small>
        </div>
      </header>

      <section className={styles.hero}>
        <p className={shared.eyebrow}>
          Cross-edition proof · {proof.account.recipientNounPlural}
        </p>
        <h1>{proof.brandLines.hero}</h1>
        <p>
          Shared Account system with edition vocabulary only. No
          edition-specific workflows.
        </p>
      </section>

      <section aria-label="Adoption journey">
        <div className={styles.sectionHead}>
          <h2>Adoption journey</h2>
          <span>{proof.coverage.periodLabel}</span>
        </div>
        <ol className={styles.journey}>
          {JOURNEY.map(([label, key], index) => (
            <li key={key}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{formatMetricValue(proof.adoption[key])}</strong>
              <small>{label}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.receipt} aria-label="Privacy receipt">
        <AccountIcon name="lock" />
        <div>
          <strong>{proof.privacyReceipt.postureLabel}</strong>
          <p>{proof.privacyReceipt.body}</p>
        </div>
      </section>

      <section className={styles.report} aria-label="Report masthead">
        <p className={shared.eyebrow}>Report masthead</p>
        <h2>{report.title}</h2>
        <p>
          Filename: <code>{report.filenameStem}.pdf</code>
        </p>
        <p className={styles.sample}>{proof.sampleLabel}</p>
      </section>
    </div>
  );
}
