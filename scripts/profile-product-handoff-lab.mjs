import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseURL =
  process.env.HANDOFF_LAB_BASE_URL ?? "http://127.0.0.1:4387";
const outputDir = path.resolve(
  process.env.HANDOFF_EVIDENCE_DIR ??
    path.join(process.cwd(), "experience", "output", "product-handoff"),
);
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  colorScheme: "light",
  locale: "en-GB",
  timezoneId: "Europe/London",
  reducedMotion: "no-preference",
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const client = await context.newCDPSession(page);
const traceEvents = [];
let traceComplete;
const traceDone = new Promise((resolve) => {
  traceComplete = resolve;
});
client.on("Tracing.dataCollected", ({ value }) => traceEvents.push(...value));
client.on("Tracing.tracingComplete", () => traceComplete());

try {
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await client.send("Performance.enable");
  await page.goto(
    `${baseURL}/__design-lab/product-handoff?option=a&product=notes&progress=0&motion=auto&viewport=auto`,
    { waitUntil: "networkidle" },
  );
  await page.getByTestId("handoff-preview").scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const element of document.querySelectorAll(
      "main > header, main > section, main > nav",
    )) {
      element.style.display = "none";
    }
    document.querySelector("main").style.padding = "0";
  });
  await page.waitForTimeout(1_500);

  await page.evaluate(() => {
    window.__handoffProfile = {
      frames: [],
      longTasks: [],
      layoutShifts: [],
    };
    let previous = performance.now();
    const sample = (now) => {
      window.__handoffProfile.frames.push(now - previous);
      previous = now;
      window.__handoffProfile.frameHandle = requestAnimationFrame(sample);
    };
    window.__handoffProfile.frameHandle = requestAnimationFrame(sample);

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__handoffProfile.longTasks.push({
          startTime: entry.startTime,
          duration: entry.duration,
        });
      }
    }).observe({ type: "longtask", buffered: false });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__handoffProfile.layoutShifts.push({
            startTime: entry.startTime,
            value: entry.value,
          });
        }
      }
    }).observe({ type: "layout-shift", buffered: false });
  });

  await page
    .locator("button")
    .filter({ hasText: "Replay" })
    .first()
    .evaluate((button) => button.click());
  // Exclude the hidden lab control's Play → Pause label update. The measured
  // window covers the scene choreography itself, not the review chrome.
  await page.waitForTimeout(100);

  const before = await client.send("Performance.getMetrics");
  await client.send("Tracing.start", {
    categories: [
      "devtools.timeline",
      "disabled-by-default-devtools.timeline",
      "blink.user_timing",
      "v8",
    ].join(","),
    transferMode: "ReportEvents",
  });
  await page.evaluate(() => {
    cancelAnimationFrame(window.__handoffProfile.frameHandle);
    window.__handoffProfile.frames = [];
    window.__handoffProfile.longTasks = [];
    window.__handoffProfile.layoutShifts = [];
    let previous = performance.now();
    const sample = (now) => {
      window.__handoffProfile.frames.push(now - previous);
      previous = now;
      window.__handoffProfile.frameHandle = requestAnimationFrame(sample);
    };
    window.__handoffProfile.frameHandle = requestAnimationFrame(sample);
  });

  await page.waitForTimeout(3_500);

  await client.send("Tracing.end");
  await traceDone;
  const after = await client.send("Performance.getMetrics");
  const samples = await page.evaluate(() => {
    cancelAnimationFrame(window.__handoffProfile.frameHandle);
    return window.__handoffProfile;
  });

  const metricMap = (metrics) =>
    Object.fromEntries(metrics.metrics.map(({ name, value }) => [name, value]));
  const beforeMap = metricMap(before);
  const afterMap = metricMap(after);
  const deltas = Object.fromEntries(
    ["LayoutCount", "RecalcStyleCount", "TaskDuration", "ScriptDuration"].map(
      (name) => [name, (afterMap[name] ?? 0) - (beforeMap[name] ?? 0)],
    ),
  );

  let consecutive = 0;
  let maxConsecutiveDropped = 0;
  for (const frame of samples.frames) {
    consecutive = frame > 34 ? consecutive + 1 : 0;
    maxConsecutiveDropped = Math.max(maxConsecutiveDropped, consecutive);
  }

  const report = {
    schemaVersion: "signal-product-handoff-performance/1",
    createdAt: new Date().toISOString(),
    route: "option=a&product=notes",
    viewport: { width: 390, height: 844 },
    cpuThrottle: 4,
    animationSeconds: 3.2,
    profileWindowStartsAfterControlSettlesMs: 100,
    frameCount: samples.frames.length,
    worstFrameMs: Math.max(...samples.frames),
    framesOver34Ms: samples.frames.filter((value) => value > 34).length,
    maxConsecutiveFramesOver34Ms: maxConsecutiveDropped,
    longTasks: samples.longTasks,
    layoutShifts: samples.layoutShifts,
    metricDeltas: deltas,
    verdict: {
      noLongTaskOver50Ms: samples.longTasks.every(
        ({ duration }) => duration <= 50,
      ),
      noRepeatedDroppedFrameSequence: maxConsecutiveDropped < 3,
      noAnimatedLayout: deltas.LayoutCount === 0,
      noLayoutShift:
        samples.layoutShifts.reduce((total, item) => total + item.value, 0) ===
        0,
    },
  };

  await writeFile(
    path.join(outputDir, "performance-4x-mobile.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    path.join(outputDir, "performance-trace-4x-mobile.json"),
    `${JSON.stringify({ traceEvents })}\n`,
    "utf8",
  );
  console.log(JSON.stringify(report, null, 2));
} finally {
  await client.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  await context.close();
  await browser.close();
}
