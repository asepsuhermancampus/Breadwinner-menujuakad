import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "batch07-*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: {
    baseURL: "http://127.0.0.1:3201",
    viewport: { width: 1760, height: 1200 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3201",
    url: "http://127.0.0.1:3201/dev/operations",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
