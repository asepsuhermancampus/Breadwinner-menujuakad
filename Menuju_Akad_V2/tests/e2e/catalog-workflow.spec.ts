import { test, expect } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
test("operator creates real vendor, customer requests private quote, unauthorized changes denied", async ({
  page,
  context,
  baseURL,
  browser,
}) => {
  await customerSession(context, baseURL!, "catalog-operator");
  await page.goto("/marketplace");
  await page.getByRole("button", { name: "Tambah vendor", exact: true }).click();
  await page.getByLabel("Nama vendor", { exact: true }).fill("Vendor terdaftar");
  await page.getByLabel("Kategori", { exact: true }).fill("Dekorasi");
  await page.getByLabel("Harga penawaran (Rp)").fill("250000");
  await page.getByLabel("Deskripsi", { exact: true }).fill("Layanan dekorasi sesuai kesepakatan");
  await page.getByRole("button", { name: "Simpan vendor" }).click();
  await expect(page.getByRole("heading", { name: "Vendor terdaftar" })).toBeVisible();
  await context.clearCookies();
  await customerSession(context, baseURL!, "catalog-customer");
  await page.goto("/marketplace");
  await expect(page.getByRole("button", { name: "Tambah vendor", exact: true })).toHaveCount(0);
  const denied = await context.request.post("/api/marketplace/vendors", {
    headers: { Origin: baseURL! },
    data: { name: "Forbidden" },
  });
  expect(denied.status()).toBe(403);
  await page.getByLabel("Pilih Vendor terdaftar", { exact: true }).click();
  await expect(page.getByLabel("Pilih Vendor terdaftar", { exact: true })).toBeChecked();
  await page.getByLabel("Kebutuhan acara").fill("Acara keluarga");
  await page.getByRole("button", { name: "Kirim permintaan penawaran" }).click();
  await expect(page).toHaveURL(/\/orders\/[a-f0-9-]+$/);
  await expect(page.getByRole("heading", { name: "Permintaan penawaran diterima" })).toBeVisible();
  await expect(page.getByText(/Belum ada pembayaran/)).toBeVisible();
  const orderURL = page.url();
  const other = await browser.newContext({ baseURL: baseURL! });
  await customerSession(other, baseURL!, "catalog-stranger");
  const otherPage = await other.newPage();
  const res = await otherPage.goto(orderURL);
  expect(res?.status()).toBe(404);
  await other.close();
  await context.clearCookies();
  await customerSession(context, baseURL!, "catalog-operator");
  const inbox = await context.request.get("/api/marketplace/requests");
  expect(inbox.ok()).toBe(true);
  expect((await inbox.json()).orders).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ message: "Acara keluarga", status: "requested" }),
    ]),
  );
});
