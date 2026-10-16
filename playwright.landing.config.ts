import { defineConfig } from "@playwright/test";
import { resolve } from "node:path";
const port = 4398;
export default defineConfig({
  testDir: "./tests/experience",
  testMatch: ["landing-only.spec.ts", "home.spec.ts"],
  workers: 1,
  retries: 0,
  reporter: "line",
  outputDir: "experience/output/playwright-results/landing-only",
  use: { baseURL: `http://127.0.0.1:${port}`, browserName: "chromium", screenshot: "only-on-failure" },
  webServer: {
    command: `pnpm exec next start -H 127.0.0.1 -p ${port}`,
    url: `http://127.0.0.1:${port}/`,
    reuseExistingServer: false,
    env: {
      STUDIO_DATABASE_URL: `file:${resolve(".next/landing-waitlist-test.sqlite")}`,
      STUDIO_AUTH_TOKEN: "",
      SIGNAL_HQ_PASSWORD: "isolated-landing-review",
    },
    timeout: 120_000,
  },
});
