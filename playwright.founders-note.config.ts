import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/experience",
  reporter: "line",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4388",
    browserName: "chromium",
    locale: "en-GB",
    timezoneId: "Europe/London",
    colorScheme: "light",
    trace: "retain-on-failure",
  },
});
