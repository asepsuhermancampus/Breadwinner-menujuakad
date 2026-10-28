import { defineConfig } from "@playwright/test";
import path from "node:path";
import os from "node:os";
import { randomUUID } from "node:crypto";
const database =
  process.env.E2E_CUSTOMER_DB ??
  path.join(os.tmpdir(), `menuju-akad-customer-e2e-${randomUUID()}.sqlite`);
process.env.E2E_CUSTOMER_DB = database;
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: [
    "pencil-layout.spec.ts",
    "pencil-sidebar.spec.ts",
    "customer-feature-tabs.spec.ts",
    "wedding-kit-layout.spec.ts",
    "layout-width.spec.ts",
    "dashboard-scroll.spec.ts",
    "workspace-header.spec.ts",
    "account-settings.spec.ts",
    "account-nicknames.spec.ts",
    "kua-templates.spec.ts",
    "locked-features.spec.ts",
    "functional-workflows.spec.ts",
    "catalog-workflow.spec.ts",
    "dashboard-trial.spec.ts",
    "customer-planning.spec.ts",
    "customer-budget.spec.ts",
    "couple-savings.spec.ts",
    "product-route-integrity.spec.ts",
    "dashboard-session.spec.ts",
    "plan-checkout.spec.ts",
    "plan-access.spec.ts",
    "plan-guide.spec.ts",
    "plan-claim.spec.ts",
    "plan-upgrade.spec.ts",
    "auth-google.spec.ts",
    "qris-payment.spec.ts",
    "qris-discount.spec.ts",
    "css-assets.spec.ts",
  ],
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: { baseURL: "http://localhost:3211", screenshot: "only-on-failure", trace: "off" },
  webServer: {
    command: "node node_modules/next/dist/bin/next start --hostname localhost --port 3211",
    url: "http://localhost:3211/api/health/live",
    reuseExistingServer: false,
    env: {
      PAYMENT_DATABASE_PATH: database,
      AUTH_DATABASE_PATH: `${database}.auth`,
      REVIEWS_DATABASE_PATH: `${database}.reviews`,
      AUTH_URL: "http://localhost:3211",
      OPERATIONS_EMAIL_ALLOWLIST: "catalog-operator@menuju-akad.invalid",
    },
  },
});
