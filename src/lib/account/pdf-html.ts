import { formatMetricValue, formatRateValue } from "./format";
import type { AccountSnapshot } from "./types";

/**
 * Print ink for the standalone report document.
 *
 * This file emits a self-contained HTML file for PDF rendering. It is served
 * outside the app shell, so `var(--...)` design tokens do not resolve — the
 * print engine has no stylesheet to inherit from. Literal values are required
 * here and are kept in one place so the print surface stays reviewable.
 * Same constraint as the standalone email templates in `src/emails`.
 */
const PRINT_INK = {
  body: "#12131b", // ds-allow, standalone print document, no token context
  muted: "#6b6f7c", // ds-allow, standalone print document, no token context
  secondary: "#3c4050", // ds-allow, standalone print document, no token context
  ruleStrong: "#d8dbe3", // ds-allow, standalone print document, no token context
  ruleLight: "#e4e6ee", // ds-allow, standalone print document, no token context
  surface: "#fff", // ds-allow, standalone print document, no token context
} as const;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function snapshotToReportHtml(snapshot: AccountSnapshot): string {
  const report = snapshot.reports[0];
  const journey = [
    ["Allotted", snapshot.adoption.allotted],
    ["Issued", snapshot.adoption.issued],
    ["Redeemed", snapshot.adoption.redeemed],
    ["First useful action", snapshot.adoption.firstUsefulAction],
    ["Active recently", snapshot.adoption.activeRecently],
  ] as const;

  // Continuation is a rate, so it is rendered by the rate formatter and never
  // reassembled from a value and a denominator.
  const continuation = formatRateValue(snapshot.adoption.continuedAfter30Days);

  const reach = snapshot.productReach
    .map(
      (row) =>
        `<li><span>${escapeHtml(row.product)}</span><strong>${escapeHtml(
          formatMetricValue(row.workspacesReached),
        )}</strong></li>`,
    )
    .join("");

  const never = snapshot.privacyReceipt.neverIncludes
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(snapshot.sampleLabel)} ${escapeHtml(report?.title ?? "Account review")}</title>
  <style>
    @page { size: A4; margin: 18mm 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: ${PRINT_INK.body};
      font: 12px/1.45 "Geist", "Segoe UI", sans-serif;
    }
    .page { page-break-after: always; }
    .page:last-child { page-break-after: auto; }
    .sample {
      margin: 0 0 14px;
      color: ${PRINT_INK.muted};
      font-size: 9px;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .mast {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-weight: 650;
    }
    h1 {
      margin: 10px 0 8px;
      font-size: 28px;
      font-weight: 560;
      letter-spacing: -.04em;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 18px;
      font-weight: 560;
      letter-spacing: -.03em;
    }
    .standing, .period, p { color: ${PRINT_INK.secondary}; }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      margin: 18px 0;
      border: 1px solid ${PRINT_INK.ruleStrong};
      background: ${PRINT_INK.ruleStrong};
    }
    .grid div {
      background: ${PRINT_INK.surface};
      padding: 10px;
    }
    .grid strong {
      display: block;
      font-size: 20px;
      letter-spacing: -.04em;
    }
    .grid span { color: ${PRINT_INK.muted}; font-size: 10px; }
    ul { margin: 8px 0 0; padding: 0; list-style: none; }
    li {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid ${PRINT_INK.ruleLight};
      padding: 7px 0;
    }
    .next {
      margin-top: 18px;
      border-top: 1px solid ${PRINT_INK.ruleStrong};
      padding-top: 12px;
    }
    .defs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
      margin: 14px 0;
    }
    .defs div { border-top: 1px solid ${PRINT_INK.ruleLight}; padding-top: 7px; }
    .defs dt { color: ${PRINT_INK.muted}; font-size: 10px; }
    .defs dd { margin: 2px 0 0; }
    .never { list-style: disc; padding-left: 18px; }
    .never li { display: list-item; border: 0; }
  </style>
</head>
<body>
  <section class="page">
    <p class="sample">${escapeHtml(snapshot.sampleLabel)}</p>
    <div class="mast">
      <span>signal studio</span>
      <span>${escapeHtml(snapshot.account.name)}</span>
    </div>
    <p class="period">${escapeHtml(report?.periodLabel ?? snapshot.coverage.periodLabel)} · ${escapeHtml(snapshot.definitionVersion)}</p>
    <h1>${escapeHtml(snapshot.brandLines.hero)}</h1>
    <p class="standing">${escapeHtml(snapshot.term.standingLabel)} · ${escapeHtml(snapshot.term.label)} · Data through ${escapeHtml(snapshot.coverage.dataThrough)}</p>
    <div class="grid">
      ${journey
        .map(
          ([label, metric]) =>
            `<div><strong>${escapeHtml(formatMetricValue(metric))}</strong><span>${escapeHtml(label)}</span></div>`,
        )
        .join("")}
      <div><strong>${escapeHtml(continuation)}</strong><span>Continued after 30 days</span></div>
    </div>
    <h2>Product reach</h2>
    <ul>${reach}</ul>
    <div class="next">
      <p><strong>Recommended next action</strong></p>
      <p>${escapeHtml(snapshot.nextAction.label)}</p>
      <p>${escapeHtml(snapshot.nextAction.detail)}</p>
    </div>
  </section>
  <section class="page">
    <p class="sample">${escapeHtml(snapshot.sampleLabel)}</p>
    <h1>Reporting coverage and privacy</h1>
    <p><strong>${escapeHtml(snapshot.coverage.label)}</strong></p>
    <p>${escapeHtml(snapshot.coverage.detail)}</p>
    <dl class="defs">
      <div><dt>Data through</dt><dd>${escapeHtml(snapshot.coverage.dataThrough)}</dd></div>
      <div><dt>Definition version</dt><dd>${escapeHtml(snapshot.definitionVersion)}</dd></div>
      <div><dt>Days with sponsored use</dt><dd>${escapeHtml(formatMetricValue(snapshot.adoption.daysWithSponsoredUse))}</dd></div>
      <div><dt>Privacy posture</dt><dd>${escapeHtml(snapshot.privacyReceipt.postureLabel)}</dd></div>
    </dl>
    <p>${escapeHtml(snapshot.privacyReceipt.body)}</p>
    <p>${escapeHtml(snapshot.privacyReceipt.withheldRule)}</p>
    <ul class="never">${never}</ul>
    <p><strong>${escapeHtml(snapshot.brandLines.privacy)}</strong></p>
  </section>
</body>
</html>`;
}
