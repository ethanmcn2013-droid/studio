/**
 * Renders the email-prototype image assets into public/email-assets/:
 *
 *   poster-venues.png   1072×604  film poster, venue film (locked line)
 *   poster-schools.png  1072×604  film poster, school film (live /teachers line)
 *   product-still.png   1072×670  designed workspace prop for guided mail
 *
 * The product windows are designed props in the suite's visual grammar,
 * deliberately impressionistic rather than fake screenshots, matching the
 * motion guidance that in-flight surfaces must not read as recordings.
 *
 * Run: node scripts/render-email-assets.mjs
 * Requires the repo's own devDependencies (playwright ships transitively).
 */

import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// The renderer prefers a local playwright; the collateral repo (the suite's
// asset pipeline) carries the canonical install as a fallback.
async function loadChromium() {
  try {
    return (await import("playwright-core")).chromium;
  } catch {
    const collateral = pathToFileURL(
      path.join(root, "..", "collateral", "node_modules", "playwright", "index.mjs"),
    ).href;
    return (await import(collateral)).chromium;
  }
}
const outDir = path.join(root, "public", "email-assets");
mkdirSync(outDir, { recursive: true });

// Fonts are embedded as data URLs: chromium blocks file:// font loads
// from setContent pages, and the poster must render in real Geist.
const fontData = (f) =>
  "data:font/woff2;base64," +
  readFileSync(path.join(root, "..", "collateral", "fonts", f)).toString("base64");

const baseCss = `
  @font-face {
    font-family: "Geist";
    src: url("${fontData("Geist-Variable.woff2")}") format("woff2");
    font-weight: 100 900;
  }
  @font-face {
    font-family: "Geist Mono";
    src: url("${fontData("GeistMono-Variable.woff2")}") format("woff2");
    font-weight: 100 900;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Geist", -apple-system, "Segoe UI", sans-serif;
    background: #ffffff;
    color: #111111;
    -webkit-font-smoothing: antialiased;
  }
  .mono {
    font-family: "Geist Mono", ui-monospace, monospace;
    text-transform: uppercase;
  }
`;

/** A quiet product window: hairline frame, rows, one indigo provenance rail. */
function productWindow({ rows, railRow, width, title }) {
  const rowsHtml = rows
    .map(
      (r, i) => `
      <div style="position:relative;display:flex;align-items:center;gap:14px;
                  padding:13px 18px;border-top:${i === 0 ? "none" : "1px solid #f1f1f3"};
                  background:${i === railRow ? "#fbfbfe" : "#ffffff"};">
        ${i === railRow ? '<div style="position:absolute;left:0;top:0;bottom:0;width:2px;background:#4f46e5;"></div>' : ""}
        <div style="width:9px;height:9px;border-radius:99px;
                    background:${r.state === "done" || r.state === "complete" ? "#111111" : r.state === "live" ? "#4f46e5" : "#ffffff"};
                    border:1.5px solid ${r.state === "todo" ? "#d4d4d8" : r.state === "live" ? "#4f46e5" : "#111111"};"></div>
        <div style="flex:1;font-size:14.5px;letter-spacing:-0.01em;
                    color:${r.state === "done" ? "#a1a1aa" : "#111111"};
                    ${r.state === "done" ? "text-decoration:line-through;text-decoration-color:#d4d4d8;" : ""}">
          ${r.text}
        </div>
        ${r.meta ? `<div class="mono" style="font-size:9.5px;letter-spacing:0.08em;color:#71717a;">${r.meta}</div>` : ""}
      </div>`,
    )
    .join("");
  return `
    <div style="width:${width}px;background:#ffffff;border:1px solid #e7e7e9;border-radius:10px;overflow:hidden;
                box-shadow:0 18px 44px rgba(17,17,17,0.07);">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 18px;border-bottom:1px solid #f1f1f3;">
        <div style="font-size:12.5px;font-weight:600;letter-spacing:-0.02em;">${title}</div>
        <div class="mono" style="font-size:9.5px;letter-spacing:0.1em;color:#71717a;">THIS WEEK</div>
      </div>
      ${rowsHtml}
    </div>`;
}

/**
 * Poster grammar locked in docs/film-system/film-system.md §21:
 * paper field, product window upper two thirds, primary line lower left
 * in Geist 600 ink, small lowercase wordmark, thin indigo play ring,
 * 6% safe margins (64px on a 1072-wide frame).
 */
function posterHtml({ eyebrow, line, film, windowHtml }) {
  return `<!doctype html><html><head><style>${baseCss}</style></head>
  <body>
  <div style="position:relative;width:1072px;height:604px;background:#ffffff;overflow:hidden;">
    <!-- upper two thirds: the product window -->
    <div style="position:absolute;left:50%;top:48px;transform:translateX(-50%);">
      ${windowHtml}
    </div>
    <!-- thin indigo play ring, centred on the window -->
    <div style="position:absolute;left:50%;top:174px;transform:translateX(-50%);
                width:56px;height:56px;border-radius:99px;border:1.5px solid #4f46e5;
                background:rgba(255,255,255,0.88);display:flex;align-items:center;justify-content:center;">
      <div style="width:0;height:0;border-left:15px solid #4f46e5;border-top:10px solid transparent;border-bottom:10px solid transparent;margin-left:5px;"></div>
    </div>
    <!-- lower left: eyebrow + primary line -->
    <div style="position:absolute;left:64px;bottom:56px;width:560px;">
      <div class="mono" style="font-size:11px;letter-spacing:0.16em;color:#71717a;">${eyebrow}</div>
      <div style="margin-top:12px;font-size:34px;line-height:1.16;font-weight:600;letter-spacing:-0.025em;">
        ${line}
      </div>
    </div>
    <!-- lower right: wordmark + film id -->
    <div style="position:absolute;right:64px;bottom:56px;text-align:right;">
      <div style="font-size:16px;font-weight:600;letter-spacing:-0.025em;">
        signal studio<span style="color:#4f46e5;">.</span>
      </div>
      <div class="mono" style="margin-top:8px;font-size:10px;letter-spacing:0.12em;color:#71717a;">${film}</div>
    </div>
  </div>
  </body></html>`;
}

const venuePoster = posterHtml({
  eyebrow: "SIGNAL STUDIO · THE VENUE FILM · 60 SECONDS",
  line: "Make the planning feel as considered as the day.",
  film: "FILM-VEN · 16:9",
  windowHtml: productWindow({
    title: "Brennan · Walsh wedding",
    width: 760,
    railRow: 2,
    rows: [
      { text: "Confirm ceremony music with the quartet", state: "done", meta: "DONE" },
      { text: "Table plan, final draft to the venue", state: "done", meta: "DONE" },
      { text: "Send final guest count to catering", state: "complete", meta: "AOIFE · FRI 12 SEP" },
      { text: "Seat covers, decide and book", state: "todo", meta: "NEXT WEEK" },
      { text: "Flowers, confirm delivery window", state: "todo", meta: "20 SEP" },
    ],
  }),
});

const schoolPoster = posterHtml({
  eyebrow: "SIGNAL STUDIO · THE SCHOOL FILM · 60 SECONDS",
  line: "Plan the classes, not the pupils.",
  film: "FILM-SCH · 16:9",
  windowHtml: productWindow({
    title: "The school year · 2026 to 2027",
    width: 760,
    railRow: 2,
    rows: [
      { text: "Autumn term · schemes of work, six classes", state: "done", meta: "PLANNED" },
      { text: "Fifth year · poetry unit, weeks 4 to 9", state: "done", meta: "PLANNED" },
      { text: "Spring term plan · published to the class page", state: "complete", meta: "PUBLISHED" },
      { text: "Second year · field trip, permissions window", state: "todo", meta: "OCT" },
      { text: "Summer term · revision shape, teacher’s own", state: "todo", meta: "PRIVATE" },
    ],
  }),
});

const productStill = `<!doctype html><html><head><style>${baseCss}</style></head>
<body>
<div style="position:relative;width:1072px;height:670px;background:#fafafa;overflow:hidden;">
  <div style="position:absolute;left:56px;top:96px;">
    ${productWindow({
      title: "This week",
      width: 520,
      railRow: 1,
      rows: [
        { text: "Send the draft to Claire for a read", state: "done", meta: "DONE" },
        { text: "Final guest count to catering", state: "live", meta: "NEEDS ATTENTION" },
        { text: "Book the van for Saturday morning", state: "todo", meta: "FRI" },
        { text: "Invoice · O’Brien kitchen fit-out", state: "todo", meta: "MON" },
        { text: "Quiet thinking · stays in Notes", state: "todo", meta: "PRIVATE" },
        { text: "Confirm Saturday start time with Dara", state: "todo", meta: "SAT" },
      ],
    })}
  </div>
  <div style="position:absolute;right:56px;top:210px;width:400px;background:#ffffff;border:1px solid #e7e7e9;border-radius:10px;overflow:hidden;box-shadow:0 18px 44px rgba(17,17,17,0.07);">
    <div style="padding:12px 18px;border-bottom:1px solid #f1f1f3;display:flex;justify-content:space-between;align-items:center;">
      <div style="font-size:12.5px;font-weight:600;letter-spacing:-0.02em;">The plan, as others see it</div>
      <div class="mono" style="font-size:9.5px;letter-spacing:0.1em;color:#71717a;">SHARED</div>
    </div>
    <div style="padding:18px;">
      ${["September", "October", "November"]
        .map(
          (m, i) => `
        <div style="display:flex;align-items:center;gap:12px;margin-top:${i === 0 ? 0 : 14}px;">
          <div class="mono" style="width:74px;font-size:9.5px;letter-spacing:0.1em;color:#71717a;">${m.toUpperCase()}</div>
          <div style="flex:1;height:10px;border-radius:99px;background:#f4f4f5;position:relative;">
            <div style="position:absolute;left:${8 + i * 14}%;width:${44 - i * 8}%;top:0;bottom:0;border-radius:99px;background:${i === 1 ? "#4f46e5" : "#d4d4d8"};"></div>
          </div>
        </div>`,
        )
        .join("")}
      <div class="mono" style="margin-top:18px;font-size:9.5px;letter-spacing:0.1em;color:#71717a;">READABLE BY ANYONE YOU CHOOSE</div>
    </div>
  </div>
  <div style="position:absolute;left:56px;bottom:48px;font-size:15px;font-weight:600;letter-spacing:-0.025em;">
    signal studio<span style="color:#4f46e5;">.</span>
  </div>
  <div class="mono" style="position:absolute;right:56px;bottom:50px;font-size:10px;letter-spacing:0.12em;color:#71717a;">
    A DESIGNED VIEW, NOT A RECORDING
  </div>
</div>
</body></html>`;

const jobs = [
  { name: "poster-venues.png", html: venuePoster, width: 1072, height: 604 },
  { name: "poster-schools.png", html: schoolPoster, width: 1072, height: 604 },
  { name: "product-still.png", html: productStill, width: 1072, height: 670 },
];

const chromium = await loadChromium();
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1100, height: 700 },
  deviceScaleFactor: 1,
});

for (const job of jobs) {
  await page.setContent(job.html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: path.join(outDir, job.name),
    clip: { x: 0, y: 0, width: job.width, height: job.height },
  });
  console.log(`rendered ${job.name}`);
}

await browser.close();
