import { defineConfig } from "@playwright/test";
import { randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";

const baseURL = process.env["E2E_REVIEWS_URL"] || "http://localhost:3227";
const database =
  process.env["E2E_REVIEWS_DB"] ||
  path.join(os.tmpdir(), `menuju-akad-reviews-${randomUUID()}.sqlite`);
process.env["E2E_REVIEWS_DB"] = database;
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "reviews.spec.ts",
  outputDir: "test-results/reviews",
  workers: 1,
  fullyParallel: false,
  timeout: 60000,
  use: { baseURL, screenshot: "only-on-failure", trace: "off" },
  ...(process.env["E2E_REVIEWS_URL"]
    ? {}
    : {
        webServer: {
          command: "node node_modules/next/dist/bin/next start --hostname localhost --port 3227",
          url: `${baseURL}/api/health/live`,
          reuseExistingServer: false,
          env: {
            NEXT_DIST_DIR: ".next-reviews",
            REVIEWS_DATABASE_PATH: database,
            AUTH_DATABASE_PATH: `${database}.auth`,
            PAYMENT_DATABASE_PATH: `${database}.payments`,
            AUTH_URL: baseURL,
            SUPERADMIN_EMAIL: "superadmin@menujuakad.test",
            SUPERADMIN_PASSWORD: "AkadReview!2026",
            REVIEWS_SEED_DATA: "true",
          },
        },
      }),
});
