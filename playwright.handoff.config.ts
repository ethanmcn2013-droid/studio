import { defineConfig } from "@playwright/test";

const port = Number(process.env.SIGNAL_TEST_PORT ?? "4387");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("SIGNAL_TEST_PORT must be an integer between 1 and 65535");
}
const baseURL = `http://127.0.0.1:${port}`;

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
    command: `pnpm exec next dev -H 127.0.0.1 -p ${port}`,
    env: {
      SIGNAL_ACCESS_MODE: "review",
      NEXT_PUBLIC_SIGNAL_ACCESS_MODE: "review",
    },
    url: `${baseURL}/__design-lab/product-handoff?progress=0`,
    // A responding server may belong to another checkout. Never reuse it.
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
