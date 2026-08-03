/**
 * E12.14 — accessibility, responsive and reduced-motion sweep over the E12
 * surfaces. Ad hoc, run once, against a real production server. Not committed:
 * a permanent suite belongs in tests/experience and needs the founder's
 * capture-plan decision (I-014), which this run deliberately does not take.
 */
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";

const BASE = process.env.BASE ?? "http://127.0.0.1:3462";
const HQ_PASSWORD = process.env.SIGNAL_HQ_PASSWORD ?? "wp13-verify";
const hqToken = createHash("sha256")
  .update(`signal-hq-session:v1:${HQ_PASSWORD}`)
  .digest("hex");

const TOKEN = "Tzzzzzzzzzzzzzzzzzzzzzz1";
const ROUTES = [
  "/venues",
  "/venues/demo",
  "/venues/privacy",
  "/venues/questions",
  "/venues/couple-preview",
  "/venues/what-you-see",
  `/v/${TOKEN}`,
  "/hq/venue-proposal",
];

const BREAKPOINTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
  { name: "wide", width: 1600, height: 1000 },
];

const browser = await chromium.launch();
const results = [];

for (const route of ROUTES) {
  const row = { route, axe: {}, overflow: {}, headings: null, landmarks: null, focus: null, reducedMotion: null, error: null };
  try {
    for (const bp of BREAKPOINTS) {
      const context = await browser.newContext({
        viewport: { width: bp.width, height: bp.height },
        locale: "en-GB",
        colorScheme: "light",
        reducedMotion: bp.name === "desktop" ? "reduce" : "no-preference",
      });
      await context.addCookies([
        { name: "signal_hq_access", value: hqToken, url: BASE },
      ]);
      const page = await context.newPage();
      const response = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
      row.status = response?.status();

      // Horizontal overflow: the body must never scroll sideways.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      row.overflow[bp.name] = overflow.scrollWidth - overflow.clientWidth;

      // Settle: fonts resolved and every entry transition finished. Without
      // this, axe samples elements mid-fade and colour-contrast reports a
      // blended colour, which is why the first three runs of this script
      // disagreed with each other.
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);

      const styled = await page.evaluate(() => ({
        sheets: document.styleSheets.length,
        inkQuiet: getComputedStyle(document.documentElement).getPropertyValue("--ink-quiet").trim(),
        h1: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).fontSize : null,
      }));
      row.styled = row.styled || {};
      row.styled[bp.name] = styled;

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const impactful = axe.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact),
      );
      row.axe[bp.name] = {
        total: axe.violations.length,
        seriousOrCritical: impactful.length,
        ids: axe.violations.map((v) => `${v.id}(${v.impact}, ${v.nodes.length})`),
        detail: axe.violations.flatMap((v) => v.nodes.slice(0,4).map((n) => v.id + " :: " + JSON.stringify(n.target) + " :: " + String(n.failureSummary||"").split(String.fromCharCode(10)).join(" ").slice(0,200))),
      };

      if (bp.name === "desktop") {
        // Heading structure: exactly one h1, no skipped level.
        row.headings = await page.evaluate(() => {
          const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
            Number(h.tagName.slice(1)),
          );
          let skips = 0;
          for (let i = 1; i < hs.length; i += 1) {
            if (hs[i] - hs[i - 1] > 1) skips += 1;
          }
          return { h1Count: hs.filter((l) => l === 1).length, total: hs.length, skips };
        });

        row.landmarks = await page.evaluate(() => ({
          main: document.querySelectorAll("main").length,
          nav: document.querySelectorAll("nav").length,
          imagesMissingAlt: [...document.querySelectorAll("img")].filter(
            (img) => !img.hasAttribute("alt"),
          ).length,
        }));

        // Keyboard: walk the first 25 stops and record that focus is visible
        // and stays inside the document.
        row.focus = await (async () => {
          const seen = [];
          for (let i = 0; i < 25; i += 1) {
            await page.keyboard.press("Tab");
            const info = await page.evaluate(() => {
              const el = document.activeElement;
              if (!el || el === document.body) return null;
              const style = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return {
                tag: el.tagName.toLowerCase(),
                name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40),
                offscreen: rect.width === 0 && rect.height === 0,
                outline: style.outlineStyle !== "none" || style.boxShadow !== "none",
              };
            });
            if (!info) break;
            seen.push(info);
          }
          return {
            stops: seen.length,
            offscreenStops: seen.filter((s) => s.offscreen).length,
            firstThree: seen.slice(0, 3).map((s) => `${s.tag}:${s.name}`),
          };
        })();

        // Reduced motion: with prefers-reduced-motion: reduce, nothing may
        // still be running a non-trivial animation or transition.
        row.reducedMotion = await page.evaluate(() => {
          const moving = [...document.querySelectorAll("*")].filter((el) => {
            const s = getComputedStyle(el);
            const dur = (v) =>
              v.split(",").some((d) => parseFloat(d) > 0.05);
            return (
              (s.animationName !== "none" && dur(s.animationDuration)) ||
              (s.transitionProperty !== "none" && dur(s.transitionDuration) &&
                s.transitionProperty !== "opacity" &&
                s.transitionProperty !== "color")
            );
          });
          return { animatingElements: moving.length };
        });
      }

      await context.close();
    }
  } catch (error) {
    row.error = String(error).slice(0, 300);
  }
  results.push(row);
  console.log(JSON.stringify(row, null, 2));
}

await browser.close();

console.log("\n===== SUMMARY =====");
for (const r of results) {
  if (r.error) {
    console.log(`${r.route}\tERROR ${r.error}`);
    continue;
  }
  const serious = Object.values(r.axe).reduce((a, b) => a + b.seriousOrCritical, 0);
  const total = Object.values(r.axe).reduce((a, b) => a + b.total, 0);
  const overflow = Object.entries(r.overflow)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${k}+${v}px`)
    .join(",") || "none";
  console.log(
    `${r.route}\thttp=${r.status}\taxe_total=${total}\taxe_serious=${serious}\th1=${r.headings?.h1Count}\tskips=${r.headings?.skips}\tmain=${r.landmarks?.main}\timg_no_alt=${r.landmarks?.imagesMissingAlt}\ttab_stops=${r.focus?.stops}\toffscreen=${r.focus?.offscreenStops}\tanimating_reduced=${r.reducedMotion?.animatingElements}\th_overflow=${overflow}`,
  );
}
