import { defineConfig } from "@playwright/test";

const port =
  process.env.E2E_PORT ||
  process.env.PORT ||
  (process.env.E2E_BASE_URL ? new URL(process.env.E2E_BASE_URL).port : "") ||
  "3202";
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  testIgnore: ["batch07-*.spec.ts", "audit-operations.spec.ts", "plan-*.spec.ts"],
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL,
    trace: "off",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/api/health/live`,
    reuseExistingServer: !process.env.CI,
  },
});
