import { test, expect } from "@playwright/test";
import {
  customerSession,
  seedCustomerPayment,
  customerDatabase,
} from "../helpers/customer-session";
test("guide lists only newly unlocked features and restores next/back focus", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "plan-guide");
  seedCustomerPayment(owner, "lifetime", true);
  const db = customerDatabase();
  db.prepare("UPDATE subscription_notices SET capabilities=? WHERE owner=?").run(
    JSON.stringify(["custom-domain", "priority-support"]),
    owner,
  );
  db.close();
  await page.goto("/dashboard");
  const dialog = page.getByRole("dialog", { name: "Fitur paket kalian sudah terbuka" });
  await expect(dialog.getByRole("listitem")).toHaveCount(2);
  await page.getByRole("button", { name: "Mulai panduan" }).click();
  await expect(page.locator("#feature-custom-domain")).toBeFocused();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator("#feature-priority-support")).toBeFocused();
  await page.reload();
  await expect(page.locator("#feature-priority-support")).toBeFocused();
  await page.getByRole("button", { name: "Kembali", exact: true }).click();
  await expect(page.locator("#feature-custom-domain")).toBeFocused();
  await page.getByRole("button", { name: "Lewati", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("Panduan fitur paket")).toHaveCount(0);
});
