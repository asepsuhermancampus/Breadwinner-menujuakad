import { expect, test } from "@playwright/test";

test("Lifetime ditinjau sebagai penawaran dan paket Premium tetap aktif", async ({ page }) => {
  await page.goto("/account/plans");
  const premium = page.locator('[data-plan="premium"]');
  const lifetime = page.locator('[data-plan="lifetime"]');
  await expect(premium.getByText("Aktif", { exact: true })).toBeVisible();
  await expect(lifetime.getByText("Aktif", { exact: true })).not.toBeVisible();
  await page.getByRole("button", { name: "Aktifkan Lifetime", exact: true }).click();
  const review = page.getByRole("dialog", { name: "Tinjau paket Lifetime", exact: true });
  await expect(review.getByText(/Paket aktif: Premium/)).toBeVisible();
  const submit = review.getByRole("button", { name: "Simulasikan permintaan", exact: true });
  await expect(submit).toBeDisabled();
  await review.getByRole("checkbox", { name: /Saya memahami ini simulasi/ }).check();
  await submit.click();
  await expect(
    review.getByText("Pratinjau upgrade siap. Pembayaran belum tersedia; paketmu tetap Premium."),
  ).toBeVisible();
  await review.getByRole("button", { name: "Tutup", exact: true }).click();
  await expect(premium.getByText("Aktif", { exact: true })).toBeVisible();
  await expect(lifetime.getByText("Aktif", { exact: true })).not.toBeVisible();
  await page.reload();
  await expect(premium.getByText("Aktif", { exact: true })).toBeVisible();
  await expect(lifetime.getByText("Aktif", { exact: true })).not.toBeVisible();
});
