import { expect, test, type Page } from "@playwright/test";

async function menu(page: Page, label: string) {
  await page.getByRole("button", { name: /Cari menu atau data/ }).click();
  const command = page.getByRole("dialog", { name: /Cari menu/ });
  await command.getByLabel("Cari menu operasi", { exact: true }).fill(label);
  await command.getByRole("button", { name: label, exact: true }).click();
}
test.describe("Batch 07 · operasi keuangan mock", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/admin");
  });

  test("reconciliation verifies event, stale version, and duplicate no-op", async ({ page }) => {
    await page.setViewportSize({ width: 1760, height: 1200 });
    await menu(page, "Rekonsiliasi provider");
    const table = page.getByRole("table", { name: "Rekonsiliasi KlikQRIS" });
    await expect(table.getByRole("row").filter({ hasText: "TX-8424" })).toContainText(
      "tidak dibayar",
    );
    await expect(page.getByText(/^Rp\s*2\.000\.000$/).first()).toBeVisible();
    await page.screenshot({
      path: "test-results/batch07-finance.png",
      fullPage: true,
      caret: "initial",
    });
    await menu(page, "Webhook & idempotensi");
    const drawer = page.getByRole("dialog", { name: "TX-8423 · telusuri event" });
    const apply = drawer.getByRole("button", { name: "Sinkronkan status terverifikasi" });
    await expect(drawer.getByRole("checkbox")).not.toBeChecked();
    await apply.click();
    await expect(drawer.getByRole("status")).toContainText("centang konfirmasi");
    await drawer.getByRole("checkbox").check();
    await drawer.getByLabel("Skenario webhook mock").selectOption("signature");
    await apply.click();
    await expect(drawer.getByRole("status")).toContainText("tidak valid");
    await drawer.getByLabel("Skenario webhook mock").selectOption("stale");
    await apply.click();
    await expect(drawer.getByRole("status")).toContainText("Versi transaksi berubah");
    await drawer.getByLabel("Skenario webhook mock").selectOption("valid");
    await apply.click();
    await expect(drawer.getByRole("status")).toContainText("tidak ada penagihan baru");
    await apply.click();
    await expect(drawer.getByRole("status")).toContainText("Tidak ada tindakan atau jurnal kedua");
  });

  test("payout holds block ineligible requests and scheduling does not complete transfer", async ({
    page,
  }) => {
    await menu(page, "Antrean payout");
    for (const id of ["WD-106", "WD-107", "WD-108"]) {
      await page.getByRole("button", { name: id, exact: true }).click();
      await expect(
        page.getByRole("button", { name: `Jadwalkan ${id}`, exact: true }),
      ).toBeDisabled();
    }
    await page.getByRole("button", { name: "WD-105", exact: true }).click();
    const review = page.getByRole("table", { name: "Review kelayakan payout" });
    const hold = review.getByRole("row").filter({ hasText: "Hold dana" });
    await expect(hold).toContainText(/Rp\s*5\.000\.000/);
    await expect(
      page.getByLabel("Saya meninjau tujuan, kelayakan dan jadwal ini."),
    ).not.toBeChecked();
    await page.getByLabel("Saya meninjau tujuan, kelayakan dan jadwal ini.").check();
    await page.getByRole("button", { name: "Jadwalkan WD-105", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Dijadwalkan · belum transfer", exact: true }),
    ).toBeDisabled();
    await expect(hold).toContainText(/Rp\s*5\.000\.000/);
    await expect(page.getByRole("status").first()).toContainText("hold tidak dipotong lagi");
  });

  test("unknown refund remains one reserved request with the original method and fee split", async ({
    page,
  }) => {
    await menu(page, "Review refund");
    const review = page.getByRole("dialog", { name: /Tinjau refund Rp\s*5\.000\.000/ });
    await expect(review.getByText(/250.000.*4.750.000/)).toBeVisible();
    await expect(review.getByRole("checkbox")).not.toBeChecked();
    await review.getByRole("checkbox").check();
    await review.getByLabel("Respons provider mock").selectOption("unknown");
    await review.getByRole("button", { name: "Ajukan refund", exact: true }).click();
    await expect(review.getByRole("status")).toContainText("jangan buat refund kedua");
    await review.getByRole("button", { name: "Periksa permintaan yang sama" }).click();
    await expect(review.getByRole("status")).toContainText("Tidak ada tindakan atau jurnal kedua");
    await review.getByRole("button", { name: "Kembali", exact: true }).click();
    await expect(
      page.getByText("Hasil belum diketahui · periksa request sama", { exact: true }),
    ).toBeVisible();
    await menu(page, "Audit & Riwayat Rilis");
    await expect(
      page.getByRole("table", { name: "Audit keuangan sesi aktif" }).getByRole("row"),
    ).toHaveCount(2);
    await page
      .getByText("Scope pratinjau internal · tanpa akses produksi", { exact: true })
      .click();
    await page.getByLabel("Scope operator contoh").selectOption("support");
    await page.getByLabel("Scope operator contoh").selectOption("superadmin");
    await menu(page, "Audit & Riwayat Rilis");
    await expect(
      page.getByRole("table", { name: "Audit keuangan sesi aktif" }).getByRole("row"),
    ).toHaveCount(2);
  });

  test("OTP opens review only; permission, bank validation, ack and version still gate config", async ({
    page,
  }) => {
    await menu(page, "Pengaturan keuangan");
    await page.getByRole("button", { name: "Verifikasi untuk perubahan" }).click();
    const otp = page.getByRole("dialog", { name: "Verifikasi Admin Keuangan" });
    await otp.getByLabel("Kode OTP enam digit").fill("882016");
    await otp.getByRole("button", { name: "Verifikasi & tinjau" }).click();
    let review = page.getByRole("dialog", { name: "Tinjau perubahan v17 → v18" });
    await expect(review.getByRole("checkbox", { name: /Saya meninjau bank/ })).not.toBeChecked();
    await page.keyboard.press("Escape");
    await page.getByText("Simulasi ketahanan sesi lokal", { exact: true }).click();
    await page.getByLabel("Izin tindakan dicabut", { exact: true }).check();
    await expect(page.getByRole("button", { name: "Verifikasi untuk perubahan" })).toBeDisabled();
    await expect(
      page.getByRole("heading", { name: "Konfigurasi aktif · v17", exact: true }),
    ).toBeVisible();
    await page.getByLabel("Izin tindakan dicabut", { exact: true }).uncheck();
    await page.getByRole("button", { name: "Verifikasi untuk perubahan" }).click();
    review = page.getByRole("dialog", { name: "Tinjau perubahan v17 → v18" });
    await review.getByRole("button", { name: "Konfirmasi perubahan" }).click();
    await expect(review.getByRole("status")).toContainText("centang konfirmasi");
    await review.getByText("Skenario review mock", { exact: true }).click();
    await review.getByRole("checkbox", { name: /Saya meninjau bank/ }).check();
    await review.getByLabel("Simulasikan versi review kedaluwarsa").check();
    await review.getByRole("button", { name: "Konfirmasi perubahan" }).click();
    await expect(review.getByRole("status")).toContainText("Versi konfigurasi berubah");
    await review.getByLabel("Simulasikan versi review kedaluwarsa").uncheck();
    await review.getByLabel("Rekening usulan tervalidasi di sandbox").uncheck();
    await review.getByRole("button", { name: "Konfirmasi perubahan" }).click();
    await expect(review.getByRole("status")).toContainText("belum tervalidasi");
    await review.getByLabel("Rekening usulan tervalidasi di sandbox").check();
    await review.getByRole("button", { name: "Konfirmasi perubahan" }).click();
    await expect(
      page.getByRole("heading", { name: "Konfigurasi aktif · v18", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("table", { name: "Konfigurasi keuangan terkunci" })).toContainText(
      "Mandiri ••6610",
    );
  });
  test("finance reads locked settings; support has no financial menu", async ({ page }) => {
    await page
      .getByText("Scope pratinjau internal · tanpa akses produksi", { exact: true })
      .click();
    await page.getByLabel("Scope operator contoh").selectOption("finance");
    await menu(page, "Pengaturan keuangan");
    await expect(page.getByRole("button", { name: "Verifikasi untuk perubahan" })).toBeDisabled();
    await expect(page.getByRole("table", { name: "Konfigurasi keuangan terkunci" })).toContainText(
      "BCA ••9087",
    );
    await page.getByLabel("Scope operator contoh").selectOption("support");
    await page.getByRole("button", { name: /Cari menu atau data/ }).click();
    const command = page.getByRole("dialog", { name: "Cari menu SUPPORT" });
    await command.getByLabel("Cari menu operasi").fill("Pengaturan keuangan");
    await expect(command.getByRole("status")).toContainText("Tidak ada hasil pada scope ini");
  });
});
