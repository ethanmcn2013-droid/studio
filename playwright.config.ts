import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4387";

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
    command: "pnpm exec next dev -H 127.0.0.1 -p 4387",
    env: {
      SIGNAL_ACCESS_MODE: "review",
      NEXT_PUBLIC_SIGNAL_ACCESS_MODE: "review",
    },
    // The readiness probe must be a page that exists: the design-lab pages
    // left with the estate cut, so the homepage answers for boot.
    url: `${baseURL}/`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
