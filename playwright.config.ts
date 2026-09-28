import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", fullyParallel: true, workers: 2, timeout: 45000,
  use: { baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:3000", viewport: { width:390, height:844 }, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }, trace: "retain-on-failure" },
  webServer: { command: "npm run dev -- --hostname 127.0.0.1", url: "http://127.0.0.1:3000", reuseExistingServer: true },
});
