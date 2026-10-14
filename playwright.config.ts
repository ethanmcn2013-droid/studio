import { defineConfig } from "@playwright/test";

const port = Number(process.env.SIGNAL_TEST_PORT ?? "4387");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("SIGNAL_TEST_PORT must be an integer between 1 and 65535");
}
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/experience",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["line"], ["html", { outputFolder: "experience/output/playwright-report", open: "never" }]],
  outputDir: "experience/output/playwright-results",
  use: {
    baseURL,
    browserName: "chromium",
    locale: "en-GB",
    timezoneId: "Europe/London",
    colorScheme: "light",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `pnpm exec next dev -H 127.0.0.1 -p ${port}`,
    env: {
      SIGNAL_ACCESS_MODE: "review",
      NEXT_PUBLIC_SIGNAL_ACCESS_MODE: "review",
    },
    // The readiness probe must be a page that exists: the design-lab pages
    // left with the estate cut, so the homepage answers for boot.
    url: `${baseURL}/`,
    // A responding server may belong to another checkout. Never reuse it.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
