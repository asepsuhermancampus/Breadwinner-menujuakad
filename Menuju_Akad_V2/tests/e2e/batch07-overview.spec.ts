import { expect, test, type Page } from "@playwright/test";

async function navigate(page: Page, label: string) {
  await page.getByRole("button", { name: /Cari menu atau data/ }).click();
  const dialog = page.getByRole("dialog", { name: "Cari menu SUPERADMIN" });
  await dialog.getByLabel("Cari menu operasi").fill(label);
  await dialog.getByRole("button", { name: label, exact: true }).click();
}

test("executive separates the cohort and calendar filters without changing orders", async ({
  page,
}) => {
  await page.goto("/dev/admin");
  await expect(
    page.getByRole("heading", { name: "Gambaran bisnis, keputusan berikutnya." }),
  ).toBeVisible();
  await expect(
    page.getByText("Kohort registrasi 1–25 Okt · 1.000 akun · 32% sampai publikasi"),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/batch07-admin-overview.png",
    fullPage: true,
    caret: "initial",
  });
  await navigate(page, "Kalender Vendor");
  const table = page.getByRole("table", { name: "Agenda lintas vendor dalam WIB" });
  await expect(table.getByRole("row")).toHaveCount(7);
  await page.getByLabel("Kota", { exact: true }).selectOption("Jakarta");
  await expect(page.getByText("Tidak ada agenda pada filter ini.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ekspor jadwal terbatas" })).toBeDisabled();
  await page.getByLabel("Kota", { exact: true }).selectOption("Bandung");
  await expect(table.getByRole("row")).toHaveCount(7);
});

test("KYB rejects approval of incomplete proof and protects a stale decision draft", async ({
  page,
}) => {
  await page.goto("/dev/admin");
  await navigate(page, "Tinjauan KYB");
  await page.getByLabel("Keputusan", { exact: true }).selectOption("approved");
  await expect(page.getByRole("button", { name: "Setujui", exact: true })).toBeDisabled();
  await page.getByLabel("Keputusan", { exact: true }).selectOption("revision");
  await page.getByRole("button", { name: "Kirim catatan revisi", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Tinjau KYB-341 · v3" });
  await dialog.getByLabel("Alasan keputusan").fill("Nama pemilik pada bukti perlu dilengkapi.");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "Cari menu SUPERADMIN" })).not.toBeVisible();
  await expect(dialog.getByLabel("Alasan keputusan")).toHaveValue(
    "Nama pemilik pada bukti perlu dilengkapi.",
  );
  await dialog.getByRole("checkbox").check();
  await dialog.getByText("Skenario internal", { exact: true }).click();
  await dialog.getByRole("button", { name: "Simulasikan versi baru saat review" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Versi berubah saat review");
  await expect(dialog.getByRole("button", { name: "Konfirmasi keputusan" })).toBeDisabled();
  await dialog.getByRole("button", { name: "Kembali", exact: true }).click();
  const discard = page.getByRole("dialog", { name: "Tutup draf keputusan?" });
  await discard.getByRole("button", { name: "Lanjutkan tinjauan" }).click();
  await expect(dialog.getByLabel("Alasan keputusan")).toHaveValue(
    "Nama pemilik pada bukti perlu dilengkapi.",
  );
});

test("moderation false positive records the content decision and retains KYB queue", async ({
  page,
}) => {
  await page.goto("/dev/admin");
  await navigate(page, "Moderasi konten");
  await page.getByRole("button", { name: "Tinjau Luma", exact: true }).click();
  await page.getByLabel("Keputusan", { exact: true }).selectOption("false-positive");
  await page.getByRole("button", { name: "False positive…", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Tinjau M-403 · v2" });
  await dialog
    .getByLabel("Alasan keputusan")
    .fill("20 × 30 cm adalah ukuran album, bukan nomor kontak.");
  await dialog.getByRole("checkbox").check();
  await dialog.getByRole("button", { name: "Konfirmasi keputusan" }).click();
  await expect(dialog.getByRole("status")).toContainText("audit simulasi lokal");
  await dialog.getByRole("button", { name: "Selesai", exact: true }).click();
  await expect(page.getByRole("row").filter({ hasText: "Luma" })).toContainText("False positive");
  await navigate(page, "Tinjauan KYB");
  await expect(page.getByRole("row").filter({ hasText: "Kalyana Photography" })).toContainText(
    "Perlu revisi",
  );
});

test("compact admin navigation is keyboard usable without page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/dev/admin");
  await page.getByRole("button", { name: "Buka navigasi SUPERADMIN" }).click();
  const dialog = page.getByRole("dialog", { name: "Navigasi SUPERADMIN" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Kalender Vendor", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Satu agenda lintas mitra." })).toBeVisible();
  const city = await page.getByLabel("Kota", { exact: true }).boundingBox();
  expect(city).not.toBeNull();
  expect(city!.x + city!.width).toBeLessThanOrEqual(375);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({
    path: "test-results/batch07-admin-compact.png",
    fullPage: true,
    caret: "initial",
  });
});
