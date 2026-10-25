import { defineConfig } from "@playwright/test";
import customer from "./playwright.customer.config";
export default defineConfig({
  ...customer,
  testMatch: ["operations-live.spec.ts", "batch07-styles.spec.ts"],
});
