"use client";

import { useState } from "react";

/**
 * Bulk action bar for the filtered schools set.
 *
 * Two outreach-day actions on whatever the current filter resolves to (every
 * match, not just the visible page): copy the de-duplicated email list, and
 * download a mail-merge CSV. Both fetch from the export route on demand rather
 * than shipping the whole set in the page payload, so the list stays light at
 * thousands of rows. `emailCount` is the server-computed unique-email count.
 */
export function HqCrmBulkBar({
  total,
  filteredCount,
  emailCount,
  exportBase,
}: {
  total: number;
  filteredCount: number;
  emailCount: number;
  /** querystring for /api/internal/prospects/export-schools (no format key) */
  exportBase: string;
}) {
  const [state, setState] = useState<"idle" | "copying" | "done" | "error">("idle");

  async function copyEmails() {
    setState("copying");
    try {
      const res = await fetch(
        `/api/internal/prospects/export-schools?${exportBase}&format=emails`,
      );
      if (!res.ok) throw new Error("export failed");
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setState("done");
      setTimeout(() => setState("idle"), 1900);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2400);
    }
  }

  const filtered = filteredCount !== total;
  const copyLabel =
    state === "copying"
      ? "Copying…"
      : state === "done"
        ? "Copied ✓"
        : state === "error"
          ? "Copy failed"
          : `Copy ${emailCount.toLocaleString()} emails`;

  return (
    <div className="hq-crm-bulkbar">
      <p className="hq-crm-bulkbar-count">
        <strong>{filteredCount.toLocaleString()}</strong>
        {filtered ? <> of {total.toLocaleString()} schools</> : <> schools</>}
        <span className="hq-crm-bulkbar-emails">
          {" · "}
          {emailCount.toLocaleString()} unique emails
        </span>
      </p>
      <div className="hq-crm-bulkbar-actions">
        <button
          type="button"
          className="hq-crm-bulk-btn"
          onClick={copyEmails}
          disabled={emailCount === 0 || state === "copying"}
          data-done={state === "done" ? "true" : undefined}
        >
          {copyLabel}
        </button>
        <a
          className="hq-crm-bulk-btn hq-crm-bulk-btn--primary"
          href={`/api/internal/prospects/export-schools?${exportBase}&format=csv`}
          data-disabled={filteredCount === 0 ? "true" : undefined}
          aria-disabled={filteredCount === 0}
        >
          Export CSV
        </a>
      </div>
    </div>
  );
}
