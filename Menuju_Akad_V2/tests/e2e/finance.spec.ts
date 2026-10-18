import { expect, test } from "@playwright/test";

test.describe("Batch 03 · Finance & Ledger Modules E2E", () => {
  test("displays finance overview, metrics, and non-bank disclaimer", async ({ page }) => {
    await page.goto("/planner/finance");
    await expect(page).toHaveTitle(/Menuju Akad/);

    // Title & disclaimer
    await expect(page.getByRole("heading", { name: "Dana jelas, rencana tenang." })).toBeVisible();
    await expect(page.getByText("Bukan saldo bank otomatis.")).toBeVisible();

    // 4 Overview metrics
    await expect(page.getByText("Rp 150.000.000").first()).toBeVisible();
    await expect(page.getByText("Rp 57.500.000").first()).toBeVisible();
    await expect(page.getByText("Rp 55.000.000").first()).toBeVisible();
    await expect(page.getByText("Rp 92.500.000").first()).toBeVisible();

    // Joint funding progress 75%
    await expect(page.getByText("75% dari Rp 150.000.000")).toBeVisible();
    await expect(page.getByText("Pengingat Termin Terdekat")).toBeVisible();
  });

  test("tabungan manages deposits and funding target simulator", async ({ page }) => {
    await page.goto("/planner/finance");
    await page.getByRole("tab", { name: "Tabungan" }).click();

    await expect(page.getByRole("heading", { name: "Tabungan, dicatat bersama." })).toBeVisible();
    await expect(page.getByText("Kontribusi Andi")).toBeVisible();
    await expect(page.getByText("Kontribusi Risa")).toBeVisible();
    await expect(page.getByText("Kontribusi Keluarga")).toBeVisible();

    // Record deposit inspector
    await page.getByRole("button", { name: "Catat setoran" }).first().click();
    await expect(page.getByText("Catat Setoran Tabungan")).toBeVisible();
    await expect(page.getByText("Draf setoran Rp 5.000.000")).toBeVisible();
    await expect(page.getByText("Rp 117.500.000")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    // Target simulator
    await page.getByRole("button", { name: "Atur target & kontribusi" }).click();
    await expect(page.getByText("Bagi target, bukan beban.")).toBeVisible();
    await expect(page.getByText("Setoran tercatat · dari ledger (Read-only)")).toBeVisible();
    await expect(page.getByText("Kebutuhan: Rp 9.375.000 / periode")).toBeVisible();
    await expect(page.getByText("Rp 4.687.500").first()).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("anggaran supports inline edit and version conflict resolution", async ({ page }) => {
    await page.goto("/planner/finance");
    await page.getByRole("tab", { name: "Anggaran" }).click();

    await expect(
      page.getByRole("heading", { name: "Satu buku anggaran, tanpa teka-teki." }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "Venue", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Katering", exact: true })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Cincin & mahar", exact: true })).toBeVisible();

    // Version conflict dialog
    await page.getByRole("button", { name: "Simulasi Konflik Edit" }).click();
    await expect(page.getByText("Konflik Perubahan Anggaran (Venue)")).toBeVisible();
    await expect(page.getByText("Versi Awal (Base v17)")).toBeVisible();
    await expect(page.getByRole("button", { name: /Gunakan Versi Server/i })).toBeVisible();
    await page.getByRole("button", { name: /Gunakan Versi Server/i }).click();
    await expect(page.getByText("Konflik Perubahan Anggaran (Venue)")).not.toBeVisible();
  });

  test("pengeluaran details inspector and funding scope projection", async ({ page }) => {
    await page.goto("/planner/finance");
    await page.getByRole("tab", { name: "Pengeluaran" }).click();

    await expect(
      page.getByRole("heading", { name: "Semua pengeluaran, satu jejak." }),
    ).toBeVisible();
    await expect(page.getByRole("cell", { name: "DP Venue Bumi Samami" }).first()).toBeVisible();

    // Row click opens expense inspector
    await page.getByRole("cell", { name: "DP Venue Bumi Samami" }).first().click();
    await expect(page.getByText("Detail Pembayaran & Jejak Audit")).toBeVisible();
    await expect(page.getByText("kuitansi-venue-dp.pdf")).toBeVisible();
    await page.getByRole("button", { name: "Tutup", exact: true }).click();

    // Record expense funding scope projection
    await page.getByRole("button", { name: "Catat pengeluaran" }).first().click();
    await expect(page.getByText("Catat Pengeluaran Baru")).toBeVisible();
    await expect(page.getByText("Proyeksi Sisa Dana Acara:")).toBeVisible();
    await expect(page.getByText("Rp 54.500.000")).toBeVisible();

    // Switch to external private
    await page.getByRole("button", { name: "Pribadi Eksternal" }).click();
    await expect(page.getByRole("dialog").getByText("Rp 55.000.000")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("installments displays 13 manual items and vendor hidden note", async ({ page }) => {
    await page.goto("/planner/finance");
    await page.getByRole("tab", { name: "Jadwal termin" }).click();

    await expect(page.getByRole("heading", { name: /13 rencana termin/i })).toBeVisible();
    await expect(page.getByText("Vendor Hidden · catatan mandiri.")).toBeVisible();
    await expect(page.getByText("DP souvenir")).toBeVisible();
    await expect(page.getByText("Pelunasan katering")).toBeVisible();
  });

  test("reports and CSV wizard validates, repairs date and deduplicates", async ({ page }) => {
    await page.goto("/planner/finance");
    await page.getByRole("tab", { name: "Laporan" }).click();

    await expect(
      page.getByRole("heading", { name: "Lihat alurnya. Pahami posisinya." }),
    ).toBeVisible();

    // Export dialog
    await page.getByRole("button", { name: "Ekspor laporan" }).click();
    await expect(page.getByText("Ekspor Laporan Keuangan")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    // Import wizard
    await page.getByRole("button", { name: "Impor CSV" }).click();
    await expect(page.getByText("Impor Data Pengeluaran CSV")).toBeVisible();
    await expect(page.getByText("32 Okt 2026")).toBeVisible();
    await expect(page.getByText("Duplikat EX-1001 (Dikecualikan)")).toBeVisible();

    // Repair invalid date
    await page.getByRole("button", { name: "Perbaiki ke 24 Okt" }).click();
    await expect(page.getByText("Valid (Diperbaiki)")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("rekening verifies 3 allocation accounts, transfer and MT-009 correction", async ({
    page,
  }) => {
    await page.goto("/planner/finance");
    await page.getByRole("tab", { name: "Rekening & mutasi" }).click();

    await expect(page.getByRole("heading", { name: "Rekening dana acara & mutasi" })).toBeVisible();
    await expect(page.getByText("••4821", { exact: true })).toBeVisible();
    await expect(page.getByText("••9012", { exact: true })).toBeVisible();
    await expect(page.getByText("••7734", { exact: true })).toBeVisible();

    // Internal transfer modal
    await page.getByRole("button", { name: "Catat mutasi internal" }).click();
    await expect(page.getByText("Catat Mutasi, Bukan Kirim Uang")).toBeVisible();
    await expect(page.getByText("Total dana acara tetap Rp 55 jt.")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();

    // Correction modal
    await page.getByRole("button", { name: "Koreksi Catatan MT-009" }).click();
    await expect(page.getByText("Koreksi Mutasi · Pratinjau")).toBeVisible();
    await expect(page.getByText("Total kas tetap Rp 55 jt.")).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("engagement context displays isolated mode lamaran ledger", async ({ page }) => {
    await page.goto("/planner/finance");

    await page.getByRole("button", { name: "Beralih ke Mode Lamaran" }).click();
    await expect(
      page.getByRole("heading", { name: "Satu lamaran, satu rencana dana." }),
    ).toBeVisible();
    await expect(page.getByText("Konteks & Dana Terpisah.")).toBeVisible();
    await expect(page.getByText("Rp 20.000.000")).toBeVisible();
    await expect(page.getByText("Rp 12.000.000")).toBeVisible();
    await expect(page.getByText("Rp 7.000.000")).toBeVisible();
    await expect(page.getByText("Seserahan Lamaran")).toBeVisible();
  });

  test("reflow responsif pada mobile 375px tanpa overflow", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/planner/finance");
    await expect(page.getByRole("heading", { name: /Dana jelas/i })).toBeVisible();
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
