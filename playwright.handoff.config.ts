import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4387";

export default defineConfig({
  testDir: "./tests/experience",
  testMatch: "product-handoff-lab.spec.ts",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["line"],
    [
      "html",
      {
        outputFolder: "experience/output/handoff-playwright-report",
        open: "never",
      },
    ],
  ],
  outputDir: "experience/output/handoff-playwright-results",
  use: {
    baseURL,
    locale: "en-GB",
    timezoneId: "Europe/London",
    colorScheme: "light",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
    { name: "firefox", use: { browserName: "firefox" } },
  ],
  webServer: {
    command: "pnpm exec next dev -H 127.0.0.1 -p 4387",
    env: {
      SIGNAL_ACCESS_MODE: "review",
      NEXT_PUBLIC_SIGNAL_ACCESS_MODE: "review",
    },
    url: `${baseURL}/__design-lab/product-handoff?progress=0`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
