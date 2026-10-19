import { expect, test, type Page } from "@playwright/test";

async function vendorMenu(page: Page, name: string) {
  await page.getByRole("button", { name: /Cari menu atau data/ }).click();
  await page
    .getByRole("dialog", { name: "Cari di ruang vendor", exact: true })
    .getByRole("button", { name, exact: true })
    .click();
}
const amount = (page: Page, label: string) =>
  page.getByRole("heading", { name: label, exact: true }).locator("..");

test.describe("Batch07 · Vendor dan Brand Ambassador sandbox", () => {
  test("katalog tersimpan tanpa mengubah snapshot kontrak pesanan", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1160 });
    await page.goto("/dev/vendor");
    await expect(page.getByRole("heading", { name: "Karya yang siap ditemukan." })).toBeVisible();
    await expect
      .poll(
        () =>
          page
            .locator("main img")
            .evaluateAll((images) =>
              images.every(
                (image) =>
                  (image as HTMLImageElement).complete &&
                  (image as HTMLImageElement).naturalWidth > 0,
              ),
            ),
        { timeout: 20_000 },
      )
      .toBe(true);
    await page.screenshot({
      path: "test-results/batch07-vendor-desktop.png",
      fullPage: true,
      caret: "initial",
    });
    await page.getByRole("button", { name: "Edit paket Wedding full day", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Edit paket layanan", exact: true });
    await dialog.getByLabel("Harga paket (IDR)", { exact: true }).fill("16000000");
    await dialog.getByRole("button", { name: "Terapkan ke draf katalog", exact: true }).click();
    await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
    await expect(
      page
        .getByRole("main")
        .getByRole("status")
        .filter({ hasText: /Katalog tersimpan/ }),
    ).toBeVisible();
    await vendorMenu(page, "Pesanan & Kontrak");
    await expect(page.getByRole("complementary", { name: "Detail item ITM-2041" })).toContainText(
      /15\.000\.000/,
    );
    await page.reload();
    await expect(page.getByRole("row").filter({ hasText: "Wedding full day" })).toContainText(
      /16\.000\.000/,
    );
  });

  test("KYB meminta bukti pengganti dan tidak mengganti rekening aktif", async ({ page }) => {
    await page.goto("/dev/vendor");
    await vendorMenu(page, "Dokumen & KYB");
    const submit = page.getByRole("button", { name: "Kirim revisi untuk ditinjau", exact: true });
    await expect(submit).toBeDisabled();
    await page.getByLabel("Nomor rekening baru", { exact: true }).fill("1234567896402");
    await page.getByLabel("Ketik ulang nomor rekening", { exact: true }).fill("1234567896402");
    await page
      .getByLabel("Ketik ulang nama pemilik rekening", { exact: true })
      .fill("Kalyana Photography & Cinema");
    await page.getByLabel("Ganti bukti rekening privat", { exact: true }).setInputFiles({
      name: "rekening-utuh.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF"),
    });
    const ack = page.getByRole("checkbox", { name: /Saya memastikan rekening milik usaha/ });
    await expect(ack).toBeEnabled();
    await expect(ack).not.toBeChecked();
    await expect(submit).toBeDisabled();
    await ack.check();
    await submit.click();
    await expect(
      page.getByRole("heading", { name: "Revisi rekening menunggu peninjauan" }),
    ).toBeVisible();
    await expect(page.locator("main footer")).toContainText(/BCA.*1188/);
    await expect(page.locator("main footer")).toContainText("Mandiri belum memenuhi syarat");
  });

  test("keputusan memeriksa ulang slot dan hanya menerima satu item", async ({ page }) => {
    await page.goto("/dev/vendor");
    await vendorMenu(page, "Pesanan & Kontrak");
    const inspector = page.getByRole("complementary", { name: "Detail item ITM-2041" });
    await inspector
      .getByRole("combobox", { name: "Keputusan item", exact: true })
      .selectOption("reject");
    await expect(inspector.getByRole("button", { name: "Tolak…", exact: true })).toBeDisabled();
    await inspector
      .getByRole("combobox", { name: "Keputusan item", exact: true })
      .selectOption("accept");
    await inspector.getByRole("button", { name: "Terima item", exact: true }).click();
    const review = page.getByRole("dialog", { name: "Konfirmasi penerimaan item", exact: true });
    const confirm = review.getByRole("button", { name: "Konfirmasi terima item", exact: true });
    await expect(confirm).toBeDisabled();
    await review.getByRole("button", { name: "Periksa ulang slot & versi", exact: true }).click();
    await expect(review.getByRole("checkbox")).not.toBeChecked();
    await review.getByRole("checkbox").check();
    await confirm.click();
    await expect(page.getByRole("row").filter({ hasText: "Rama & Sinta" })).toContainText(
      "Diterima",
    );
    await expect(page.getByRole("row").filter({ hasText: "Dara & Reza" })).toContainText(
      "Menunggu review",
    );
    await expect(page.getByRole("main")).toContainText("3 permintaan menunggu");
  });

  test("payout unknown tetap satu hold dan dapat diperiksa lagi pada375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/dev/vendor");
    await vendorMenu(page, "Dompet & Pencairan");
    await expect(amount(page, "Saldo siap dicairkan")).toContainText(/18\.500\.000/);
    await expect(amount(page, "Dana ditahan escrow")).toContainText(/45\.000\.000/);
    await page.getByRole("button", { name: "Ajukan pencairan", exact: true }).click();
    let dialog = page.getByRole("dialog", { name: "Tinjau pencairan vendor", exact: true });
    await dialog
      .getByRole("combobox", { name: "Respons adapter sandbox", exact: true })
      .selectOption("unknown");
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Konfirmasi permohonan", exact: true }).click();
    await dialog.getByRole("button", { name: "Tutup", exact: true }).click();
    await expect(amount(page, "Saldo siap dicairkan")).toContainText(/13\.500\.000/);
    await page.getByRole("button", { name: "Ajukan pencairan", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Tinjau pencairan vendor", exact: true });
    await expect(dialog.getByLabel("Nominal diminta (Rp)", { exact: true })).toBeDisabled();
    await dialog
      .getByRole("button", { name: "Periksa status permohonan yang sama", exact: true })
      .click();
    await dialog.getByRole("button", { name: "Tutup", exact: true }).click();
    await expect(page.getByRole("row").filter({ hasText: "WD-105" })).toHaveCount(1);
    await expect(amount(page, "Saldo siap dicairkan")).toContainText(/13\.500\.000/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: "test-results/batch07-vendor-mobile.png",
      fullPage: true,
      caret: "initial",
    });
  });

  test("BA memisahkan kode program serta saldo pending dari penarikan", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/dev/ba");
    await expect(page.getByText("BA-SINTA-2026", { exact: true })).toBeVisible();
    await expect(page.getByText("SINTA2026", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Cari menu atau data/ }).click();
    await page
      .getByRole("dialog", { name: "Cari menu BRAND AMBASSADOR", exact: true })
      .getByRole("button", { name: "Jurnal komisi", exact: true })
      .click();
    await expect(amount(page, "Siap ditarik")).toContainText(/6\.400\.000/);
    await expect(amount(page, "Belum tersedia")).toContainText(/300\.000/);
    await page.getByRole("button", { name: "Ajukan penarikan", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Tinjau penarikan komisi", exact: true });
    await expect(dialog).toContainText(/4029/);
    await dialog.getByRole("checkbox").check();
    await dialog.getByRole("button", { name: "Konfirmasi permohonan", exact: true }).click();
    await dialog.getByRole("button", { name: "Tutup", exact: true }).click();
    await expect(amount(page, "Siap ditarik")).toContainText(/5\.400\.000/);
    await expect(amount(page, "Belum tersedia")).toContainText(/300\.000/);
    await expect(page.getByRole("row").filter({ hasText: "BA-WD-105" })).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
});
