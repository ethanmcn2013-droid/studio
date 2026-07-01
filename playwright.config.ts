import { defineConfig, devices } from "@playwright/test";

const selectedJourney = process.env.UX_JOURNEY?.trim();
const selectedProject = process.env.UX_PROJECT?.trim() || "desktop-chromium";
const skipWebServer = process.env.UX_SKIP_WEBSERVER === "1";

const webServer = skipWebServer
  ? undefined
  : [
      {
        command: "node ux-tests/utils/start-product-server.mjs notes 4211",
        url: "http://localhost:4211",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
      {
        command: "node ux-tests/utils/start-product-server.mjs tasks 4212",
        url: "http://localhost:4212",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
      {
        command: "node ux-tests/utils/start-product-server.mjs timeline 4213",
        url: "http://localhost:4213",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
      {
        command: "node ux-tests/utils/start-product-server.mjs signal 4214",
        url: "http://localhost:4214",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
    ];

const projects = [
  {
    name: "desktop-chromium",
    use: { ...devices["Desktop Chrome"] },
  },
  {
    name: "mobile-chromium",
    use: { ...devices["Pixel 5"] },
  },
];

export default defineConfig({
  testDir: "./ux-tests/journeys",
  testMatch: selectedJourney ? [`${selectedJourney}.spec.ts`] : ["*.spec.ts"],
  testIgnore: selectedJourney ? [] : ["**/scenario.spec.ts"],
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["./ux-tests/utils/ux-reporter.ts"]],
  outputDir: "ux-tests/.playwright-results",
  webServer,
  use: {
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 1000 },
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },
  projects:
    selectedProject === "all"
      ? projects
      : projects.filter((project) => project.name === selectedProject),
});
