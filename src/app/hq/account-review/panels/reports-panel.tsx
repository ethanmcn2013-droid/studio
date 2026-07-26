"use client";

import { useState } from "react";
import type { VenueFixtureKey } from "@/lib/account/fixtures";
import { roleCan, roleDenialReason } from "@/lib/account/roles";
import type {
  AccountRole,
  AccountSnapshot,
  DesignConceptId,
} from "@/lib/account/types";
import { AccountIcon } from "../components/icons";
import { ReportPreview } from "../components/report-preview";
import styles from "./reports-panel.module.css";
import shared from "./shared.module.css";

export function ReportsPanel({
  snapshot,
  role,
  fixtureKey,
}: {
  snapshot: AccountSnapshot;
  role: AccountRole;
  fixtureKey: VenueFixtureKey;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cadence, setCadence] = useState<"monthly" | "term" | "renewal">(
    "monthly",
  );
  const canDownload = roleCan(role, "download_reports");
  const canEditPrefs = roleCan(role, "edit_reporting_preferences");
  const downloadDenial = roleDenialReason(role, "download_reports");
  const prefsDenial = roleDenialReason(role, "edit_reporting_preferences");
  const latest = snapshot.reports[0];

  return (
    <div className={styles.root}>
      <header className={shared.compactHead}>
        <div>
          <p className={shared.eyebrow}>Reports</p>
          <h1>Frozen evidence for renewal.</h1>
          <p>
            Same journey language as Overview: allotted access through continued
            use, with coverage, privacy receipt, and definition version locked
            into every sample pack.
          </p>
        </div>
        <button
          type="button"
          className={shared.secondaryButton}
          onClick={() => setPreviewOpen(true)}
        >
          <AccountIcon name="report" />
          Preview latest report
        </button>
      </header>

      <section className={styles.latest} aria-label="Latest report">
        <div>
          <p className={shared.eyebrow}>Latest report · sample</p>
          <h2>{latest?.title}</h2>
          <p>
            {latest?.periodLabel} · {latest?.coverageLabel} · Data through{" "}
            {latest?.dataThrough}
          </p>
          <p className={styles.parity}>
            Mirrors Overview: {snapshot.brandLines.hero}
          </p>
        </div>
        <div className={styles.downloadBlock}>
          <div className={styles.downloads}>
            <a
              className={shared.primaryButton}
              aria-disabled={!canDownload}
              tabIndex={canDownload ? 0 : -1}
              href={
                canDownload
                  ? `/hq/account-review/download?fixture=${fixtureKey}&format=pdf`
                  : undefined
              }
              onClick={(event) => {
                if (!canDownload) event.preventDefault();
              }}
            >
              <AccountIcon name="download" />
              Download PDF
            </a>
            <a
              className={shared.secondaryButton}
              aria-disabled={!canDownload}
              tabIndex={canDownload ? 0 : -1}
              href={
                canDownload
                  ? `/hq/account-review/download?fixture=${fixtureKey}&format=csv`
                  : undefined
              }
              onClick={(event) => {
                if (!canDownload) event.preventDefault();
              }}
            >
              <AccountIcon name="download" />
              Download CSV
            </a>
          </div>
          {!canDownload && downloadDenial ? (
            <p className={styles.denial} role="note">
              {downloadDenial}
            </p>
          ) : null}
        </div>
      </section>

      <section aria-label="Report library">
        <div className={styles.list}>
          {snapshot.reports.map((report) => (
            <button
              key={report.reportId}
              type="button"
              onClick={() => setPreviewOpen(true)}
            >
              <i>
                <AccountIcon name="report" />
              </i>
              <span>
                <strong>{report.title}</strong>
                <small>{report.coverageLabel}</small>
              </span>
              <span>
                <small>Data through</small>
                <strong>{report.dataThrough}</strong>
              </span>
              <span>
                <small>Formats</small>
                <strong>{report.formats.join(" · ").toUpperCase()}</strong>
              </span>
              <AccountIcon name="arrow" />
            </button>
          ))}
        </div>
      </section>

      <section className={styles.prefs} aria-label="Reporting preferences">
        <div>
          <p className={shared.eyebrow}>Reporting preferences · prototype</p>
          <h2>Choose a cadence. Nothing is scheduled.</h2>
          <p>
            This review control records a preference only. No email, no
            delivery, no schedule.
          </p>
        </div>
        <div className={styles.cadence} role="group" aria-label="Cadence">
          {(
            [
              ["monthly", "Monthly"],
              ["term", "Access term"],
              ["renewal", "Renewal pack"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={cadence === value}
              disabled={!canEditPrefs}
              title={prefsDenial ?? undefined}
              onClick={() => setCadence(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {!canEditPrefs && prefsDenial ? (
          <p className={styles.denial} role="note">
            {prefsDenial}
          </p>
        ) : null}
      </section>

      <section className={styles.boundary} aria-label="What reports include">
        <h2>Included, excluded, withheld</h2>
        <ul>
          <li>
            <strong>Included</strong>
            <span>
              Account standing, access totals, aggregate lifecycle evidence,
              product reach, coverage, and privacy receipt.
            </span>
          </li>
          <li>
            <strong>Excluded</strong>
            <span>
              Recipient identities, private work, notes, tasks, Timeline
              content, comments, attachments, and raw identifiers.
            </span>
          </li>
          <li>
            <strong>Withheld</strong>
            <span>{snapshot.privacyReceipt.withheldRule}</span>
          </li>
        </ul>
      </section>

      {previewOpen ? (
        <ReportPreview
          snapshot={snapshot}
          concept={"account-brief" satisfies DesignConceptId}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      ) : null}
    </div>
  );
}
