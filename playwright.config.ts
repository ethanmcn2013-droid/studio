import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/experience",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["line"], ["html", { outputFolder: "experience/output/playwright-report", open: "never" }]],
  outputDir: "experience/output/playwright-results",
  use: {
    browserName: "chromium",
    locale: "en-GB",
    timezoneId: "Europe/London",
    colorScheme: "light",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
});
