"use client";

import { useState } from "react";

/**
 * Bulk action bar for the filtered schools set.
 *
 * Two outreach-day actions on whatever the current filter resolves to
 * (every match, not just the visible page): copy the de-duplicated email
 * list to the clipboard for a bulk platform, and download a mail-merge CSV.
 * The server precomputes the email list and CSV for the active filter, so
 * this island only handles the clipboard write and the file download.
 */
export function HqCrmBulkBar({
  total,
  filteredCount,
  emails,
  csv,
  csvName,
}: {
  total: number;
  filteredCount: number;
  emails: string[];
  csv: string;
  csvName: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  function downloadCsv() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = csvName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const filtered = filteredCount !== total;

  return (
    <div className="hq-crm-bulkbar">
      <p className="hq-crm-bulkbar-count">
        <strong>{filteredCount.toLocaleString()}</strong>
        {filtered ? (
          <>
            {" "}
            of {total.toLocaleString()} schools
          </>
        ) : (
          <> schools</>
        )}
        <span className="hq-crm-bulkbar-emails">
          {" · "}
          {emails.length.toLocaleString()} unique emails
        </span>
      </p>
      <div className="hq-crm-bulkbar-actions">
        <button
          type="button"
          className="hq-crm-bulk-btn"
          onClick={copyEmails}
          disabled={emails.length === 0}
          data-done={copied ? "true" : undefined}
        >
          {copied ? "Copied ✓" : `Copy ${emails.length.toLocaleString()} emails`}
        </button>
        <button
          type="button"
          className="hq-crm-bulk-btn hq-crm-bulk-btn--primary"
          onClick={downloadCsv}
          disabled={filteredCount === 0}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
