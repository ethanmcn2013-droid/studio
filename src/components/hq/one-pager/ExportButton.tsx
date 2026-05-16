"use client";

// The only interactive element on a one-pager. Triggers the browser's
// native print path → "Save as PDF" → vector text, embedded Geist, true
// indigo. No library, no server Chromium (see docs/ONE_PAGER_SPEC.md §4.9
// + the deliberate dissent against headless rendering). Hidden in print.

export function ExportButton({ label = "Export PDF" }: { label?: string }) {
  return (
    <button type="button" className="op-export" onClick={() => window.print()}>
      {label}
    </button>
  );
}
