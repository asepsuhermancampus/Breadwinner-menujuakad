import { defineConfig } from "@playwright/test";
import { randomUUID } from "node:crypto";
import path from "node:path";
import os from "node:os";
const database =
  process.env["E2E_AUTH_DB"] ??
  path.join(os.tmpdir(), `menuju-akad-auth-e2e-${randomUUID()}.sqlite`);
process.env["E2E_AUTH_DB"] = database;
process.env["E2E_REVIEWS_DB"] = `${database}.reviews`;
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: ["unified-auth.spec.ts", "reviews.spec.ts", "auth-google.spec.ts"],
  workers: 1,
  fullyParallel: false,
  timeout: 60000,
  outputDir: "test-results/auth",
  use: { baseURL: "http://localhost:3229", trace: "off", screenshot: "only-on-failure" },
  webServer: {
    command: "node node_modules/next/dist/bin/next start --hostname localhost --port 3229",
    url: "http://localhost:3229/api/health/live",
    reuseExistingServer: false,
    env: {
      NEXT_DIST_DIR: process.env["E2E_AUTH_DIST_DIR"] || ".next-reviews",
      AUTH_URL: "http://localhost:3229",
      AUTH_SECRET: "isolated-auth-test-secret-32-characters",
      AUTH_DATABASE_PATH: database,
      REVIEWS_DATABASE_PATH: `${database}.reviews`,
      PAYMENT_DATABASE_PATH: `${database}.payments`,
      SUPERADMIN_EMAIL: "superadmin@menujuakad.test",
      SUPERADMIN_PASSWORD: "AkadReview!2026",
      REVIEWS_SEED_DATA: "true",
    },
  },
});
