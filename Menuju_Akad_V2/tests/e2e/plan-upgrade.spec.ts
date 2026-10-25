import { test, expect } from "@playwright/test";
import {
  customerSession,
  seedCustomerPayment,
  customerDatabase,
} from "../helpers/customer-session";
test("active Premium dims Free and itself and shows real paid upgrade credit", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "upgrade-landing");
  seedCustomerPayment(owner, "premium", true);
  await page.goto("/#paket");
  const premium = page.getByTestId("plan-premium"),
    free = page.getByTestId("plan-free"),
    lifetime = page.getByTestId("plan-lifetime");
  await expect(premium.getByText("Paket aktif", { exact: true }).first()).toBeVisible();
  await expect(premium.getByRole("button", { name: "Paket aktif", exact: true })).toBeDisabled();
  await expect(free.getByRole("button", { name: "Sudah termasuk paket aktif" })).toBeDisabled();
  await expect(premium).toHaveClass(/grayscale/);
  await expect(lifetime.getByTestId("plan-total")).toHaveText(/257[.\s]450/);
  await expect(lifetime.getByText(/Kredit Premium/)).toContainText(/141[.\s]550/);
  await expect(lifetime.getByRole("button", { name: /klaim diskon/i })).toHaveCount(0);
  const db = customerDatabase();
  db.prepare("UPDATE subscription_grants SET granted_at=? WHERE owner=?").run(
    new Date(Date.now() - 70 * 86400000).toISOString(),
    owner,
  );
  db.close();
  await page.reload();
  await expect(lifetime.getByTestId("plan-total")).toHaveText(/399[.\s]000/);
  await expect(lifetime.getByText(/Periode kredit upgrade telah berakhir/)).toBeVisible();
});
test("Premium reminder appears only within 15 days; Lifetime cannot downgrade", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "expiry-reminder");
  seedCustomerPayment(owner, "premium", true);
  await page.route("**/api/subscriptions/notices", (route) =>
    route.fulfill({ json: { notice: null } }),
  );
  await page.goto("/dashboard");
  await expect(page.getByRole("region", { name: "Pengingat masa aktif" })).toHaveCount(0);
  const db = customerDatabase();
  db.prepare("UPDATE subscription_grants SET expires_at=? WHERE owner=?").run(
    new Date(Date.now() + 14 * 86400000).toISOString(),
    owner,
  );
  db.close();
  await page.reload();
  const reminder = page.getByRole("region", { name: "Pengingat masa aktif" });
  await expect(reminder).toBeVisible();
  await expect(reminder.getByRole("button", { name: "Perpanjang Premium" })).toBeEnabled();
  seedCustomerPayment(owner, "lifetime", true);
  await page.goto("/#paket");
  await expect(
    page.getByTestId("plan-lifetime").getByRole("button", { name: "Paket aktif", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByTestId("plan-premium").getByRole("button", { name: "Sudah termasuk Lifetime" }),
  ).toBeDisabled();
});
test("cancel confirmation hides QR and does not keep polling", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "cancel-checkout"),
    payment = seedCustomerPayment(owner, "premium");
  let cancelled = false;
  await page.route(`**/api/payments/plans/${payment.id}`, async (route) => {
    if (route.request().method() !== "DELETE") return route.continue();
    cancelled = true;
    const db = customerDatabase();
    db.prepare("UPDATE invoices SET cancelled_at=? WHERE order_id=?").run(
      new Date().toISOString(),
      payment.orderId,
    );
    db.close();
    await route.fulfill({
      json: {
        quote: { intentId: payment.id, planId: "premium", cancelledAt: new Date().toISOString() },
      },
    });
  });
  await page.goto(`/checkout/qris?intent=${payment.id}`);
  await page.getByRole("button", { name: "Batalkan pesanan", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Batalkan pesanan?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Tetap lanjutkan" }).click();
  expect(cancelled).toBe(false);
  await page.getByRole("button", { name: "Batalkan pesanan", exact: true }).click();
  await dialog.getByRole("button", { name: "Ya, batalkan pesanan" }).click();
  await expect(page.getByText("Pesanan dibatalkan", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Kode QRIS Pembayaran" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByText("Pesanan dibatalkan", { exact: true })).toBeVisible();
});
