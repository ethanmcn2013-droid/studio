/**
 * Produces the committed review artifacts for the email design system:
 *
 *   docs/email-system/renders/html/<template>--<direction>.html   24 renders
 *   docs/email-system/renders/text/<template>--<direction>.txt    24 plain-text twins
 *   docs/email-system/renders/png/...                             screenshots
 *
 * Screenshots cover the four review-critical templates (sign-in code,
 * deletion scheduled, venue outreach, school outreach) in all three
 * directions at desktop (700) and mobile (390) widths, plus dark-mode
 * and images-blocked samples. Every screenshot goes through the same
 * renderEmail() the Lab and the tests use.
 *
 * Run: npx tsx scripts/screenshot-email-renders.ts
 */

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { DIRECTION_IDS } from "../src/emails/directions";
import { TEMPLATES } from "../src/emails/registry";
import { blockImages, forceDark, renderEmail } from "../src/emails/render";

const root = process.cwd();
const out = path.join(root, "docs", "email-system", "renders", "v2");
for (const dir of ["html", "text", "png"]) {
  mkdirSync(path.join(out, dir), { recursive: true });
}

async function loadChromium() {
  try {
    // Non-literal specifier: playwright is an optional, transitive install
    // and must not become a typecheck-time dependency of the app build.
    const local = "playwright-core";
    return (await import(local)).chromium;
  } catch {
    const collateral = pathToFileURL(
      path.join(root, "..", "collateral", "node_modules", "playwright", "index.mjs"),
    ).href;
    return (await import(collateral)).chromium;
  }
}

/** Email images use site-relative paths; inline them for offline renders. */
function inlineImages(html: string): string {
  return html.replace(/src="\/email-assets\/([^"]+)"/g, (_, file) => {
    const png = readFileSync(path.join(root, "public", "email-assets", file));
    return `src="data:image/png;base64,${png.toString("base64")}"`;
  });
}

const SCREENSHOT_TEMPLATES = [
  "auth.sign-in-code",
  "account.deletion-scheduled",
  "outreach.venue-first",
  "outreach.school-first",
];

async function main() {
  const chromium = await loadChromium();
  const browser = await chromium.launch();

  let shots = 0;
  for (const t of TEMPLATES) {
    for (const directionId of DIRECTION_IDS) {
      const r = await renderEmail(t.id, directionId, "default");
      const stem = `${t.id.replace(/\./g, "_")}--${directionId}`;
      const html = inlineImages(r.html);
      writeFileSync(path.join(out, "html", `${stem}.html`), html);
      writeFileSync(
        path.join(out, "text", `${stem}.txt`),
        `Subject: ${r.subject}\nPreheader: ${r.preheader}\n\n${r.text}`,
      );

      if (!SCREENSHOT_TEMPLATES.includes(t.id)) continue;

      for (const [widthName, width] of [
        ["desktop", 700],
        ["mobile", 390],
      ] as const) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.setContent(html, { waitUntil: "networkidle" });
        await page.screenshot({
          path: path.join(out, "png", `${stem}--${widthName}.png`),
          fullPage: true,
        });
        await page.close();
        shots += 1;
      }
    }
  }

  // Dark-mode samples: one utility email per direction, forced dark.
  for (const directionId of DIRECTION_IDS) {
    const r = await renderEmail("account.deletion-scheduled", directionId, "default");
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    await page.setContent(forceDark(inlineImages(r.html)), { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(out, "png", `account_deletion-scheduled--${directionId}--dark.png`),
      fullPage: true,
    });
    await page.close();
    shots += 1;
  }

  // Images-blocked sample: the poster email must survive on alt text.
  {
    const r = await renderEmail("outreach.venue-first", "letterhead", "default");
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    await page.setContent(blockImages(r.html), { waitUntil: "domcontentloaded" });
    await page.screenshot({
      path: path.join(out, "png", "outreach_venue-first--letterhead--images-blocked.png"),
      fullPage: true,
    });
    await page.close();
    shots += 1;
  }

  // Geist-ideal samples: the default screenshots on this machine ARE the
  // system-font fallback (Geist is not installed); these three show the
  // ideal by injecting the variable font, for fallback-vs-ideal evidence.
  const geistCss = (() => {
    const font = (f: string) =>
      readFileSync(path.join(root, "..", "collateral", "fonts", f)).toString("base64");
    return `<style>@font-face{font-family:Geist;src:url("data:font/woff2;base64,${font("Geist-Variable.woff2")}") format("woff2");font-weight:100 900;}@font-face{font-family:"Geist Mono";src:url("data:font/woff2;base64,${font("GeistMono-Variable.woff2")}") format("woff2");font-weight:100 900;}</style>`;
  })();
  for (const [tpl, directionId] of [
    ["auth.sign-in-code", "hairline"],
    ["editorial.dispatch-issue", "broadsheet"],
    ["outreach.venue-first", "letterhead"],
  ] as const) {
    const r = await renderEmail(tpl, directionId, "default");
    const page = await browser.newPage({ viewport: { width: 700, height: 900 } });
    await page.setContent(
      inlineImages(r.html).replace("</head>", `${geistCss}</head>`),
      { waitUntil: "networkidle" },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: path.join(out, "png", `${tpl.replace(/\./g, "_")}--${directionId}--geist.png`),
      fullPage: true,
    });
    await page.close();
    shots += 1;
  }

  await browser.close();
  console.log(`wrote ${TEMPLATES.length * DIRECTION_IDS.length} html + text renders, ${shots} screenshots`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
