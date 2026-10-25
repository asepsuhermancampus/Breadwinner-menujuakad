import { test, expect } from "@playwright/test";
import {
  customerSession,
  seedCustomerPayment,
  markCustomerPaid,
} from "../helpers/customer-session";
test("empty profile pays, status gives feedback, access and guide persist", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "plan-checkout"),
    payment = seedCustomerPayment(owner, "premium");
  let paid = false;
  await page.route(`**/api/payments/klikqris/${payment.orderId}*`, async (route) => {
    if (paid) markCustomerPaid(payment.orderId);
    await route.fulfill({
      json: { invoice: { orderId: payment.orderId, status: paid ? "paid" : "pending" } },
    });
  });
  await page.goto(`/checkout/qris?intent=${payment.id}`);
  await expect(page.getByRole("img", { name: "Kode QRIS Pembayaran" })).toBeVisible();
  await page.getByRole("button", { name: "Cek Status", exact: true }).click();
  await expect(page.getByText(/Pemeriksaan selesai.*masih menunggu/)).toBeVisible();
  paid = true;
  await page.getByRole("button", { name: "Cek Status", exact: true }).click();
  const success = page.getByRole("dialog", { name: "Pembayaran berhasil" });
  await expect(success).toBeVisible();
  await success.getByRole("link", { name: "Buka dashboard dan fitur paket" }).click();
  await expect(page).toHaveURL(/\/dashboard\?tour=features$/);
  await expect(
    page.getByText("Kalian sudah dapat memakai fitur paket.", { exact: false }),
  ).toBeVisible();
  await expect(page.locator("#feature-unlimited-guests")).toBeFocused();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page).toHaveURL(/\/planner\/tasks$/);
  await expect(page.locator("#feature-unlimited-tasks")).toBeFocused();
  await page.getByRole("button", { name: "Tutup panduan", exact: true }).click();
  await page.reload();
  await expect(page.getByLabel("Panduan fitur paket")).toHaveCount(0);
});
test("background checks keep the manual button idle and open success only after verified settlement", async ({
  context,
  page,
  baseURL,
}) => {
  const owner = await customerSession(context, baseURL!, "background-check"),
    payment = seedCustomerPayment(owner, "premium");
  let polls = 0,
    release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(`**/api/payments/klikqris/${payment.orderId}*`, async (route) => {
    polls++;
    await gate;
    markCustomerPaid(payment.orderId);
    await route.fulfill({ json: { invoice: { orderId: payment.orderId, status: "paid" } } });
  });
  await page.clock.install();
  await page.goto(`/checkout/qris?intent=${payment.id}`);
  await expect(page.getByRole("img", { name: "Kode QRIS Pembayaran" })).toBeVisible();
  await page.clock.runFor(5100);
  await expect.poll(() => polls).toBe(1);
  await expect(page.getByRole("button", { name: "Cek Status", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Memeriksa...", exact: true })).toHaveCount(0);
  await page.clock.runFor(10000);
  expect(polls).toBe(1);
  release();
  await expect(page.getByRole("dialog", { name: "Pembayaran berhasil" })).toBeVisible();
  await page.clock.runFor(15000);
  expect(polls).toBe(1);
  await page.getByRole("button", { name: "Tutup dialog" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Buka dashboard dan fitur paket" })).toBeVisible();
});
test("unauthenticated checkout retains intent in login destination", async ({ page }) => {
  const id = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  await page.goto(`/checkout/qris?intent=${id}`);
  await expect(page).toHaveURL(new RegExp(`/login\\?callbackUrl=.*${id}`));
  const register = page.getByRole("link", { name: "Buat akun", exact: true });
  await expect(register).toHaveAttribute("href", new RegExp(`returnTo=.*${id}`));
});
