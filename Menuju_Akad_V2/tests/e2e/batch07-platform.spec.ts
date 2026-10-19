import { expect, test, type Page } from "@playwright/test";

async function navigate(page: Page, label: string) {
  await page.getByRole("button", { name: /Cari menu atau data/ }).click();
  const command = page.getByRole("dialog", { name: /^Cari menu / });
  await command.getByLabel("Cari menu operasi").fill(label);
  await command.getByRole("button", { name: label, exact: true }).click();
}
async function scenario(page: Page, value: string) {
  await page.getByText("Simulasi state lokal", { exact: true }).click();
  await page.getByLabel("Kondisi saat tindakan").selectOption(value);
}

test.describe("Batch 07 · platform operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dev/admin");
  });

  test("unknown diperiksa pada sumber sama; delivered dan consent dicabut tidak retry", async ({
    page,
  }) => {
    await navigate(page, "Antrean notifikasi");
    await page.getByRole("button", { name: /N-2043/ }).click();
    await expect(page.getByRole("button", { name: "Jadwalkan ulang satu pesan" })).toBeDisabled();
    await page.getByRole("button", { name: /Periksa provider/ }).click();
    await expect(page.getByRole("status").filter({ hasText: /ID N-2043 yang sama/ })).toBeVisible();
    await expect(page.getByRole("row").filter({ hasText: "N-2043" })).toContainText("Terkirim");
    await expect(page.getByRole("button", { name: /Periksa provider/ })).toHaveCount(0);
    await page.getByRole("button", { name: /N-2042/ }).click();
    await expect(page.getByRole("button", { name: "Jadwalkan ulang satu pesan" })).toBeDisabled();
    await page.getByRole("button", { name: /N-2041/ }).click();
    await page.getByRole("button", { name: "Simulasikan izin penerima dicabut" }).click();
    await expect(page.getByRole("row").filter({ hasText: "N-2041" })).toContainText("Dibatalkan");
    await expect(page.getByRole("button", { name: "Jadwalkan ulang satu pesan" })).toBeDisabled();
    await page.getByLabel("Alasan retry").fill("Draf alasan tetap tersedia setelah navigasi.");
    await navigate(page, "CMS & Konten");
    await navigate(page, "Antrean notifikasi");
    await expect(page.getByRole("row").filter({ hasText: "N-2041" })).toContainText("Dibatalkan");
    await expect(page.getByLabel("Alasan retry")).toHaveValue(
      "Draf alasan tetap tersedia setelah navigasi.",
    );
    await scenario(page, "loading");
    await expect(page.getByRole("status").filter({ hasText: "Memuat data operasi" })).toBeVisible();
    await page.getByLabel("Kondisi saat tindakan").selectOption("ready");
    await expect(page.getByRole("row").filter({ hasText: "N-2041" })).toContainText("Dibatalkan");
    await expect(page.getByLabel("Alasan retry")).toHaveValue(
      "Draf alasan tetap tersedia setelah navigasi.",
    );
  });

  test("Support hanya menangani penugasan; internal note tidak muncul di tiket pribadi", async ({
    page,
  }) => {
    await page
      .getByText("Scope pratinjau internal · tanpa akses produksi", { exact: true })
      .click();
    await page.getByLabel("Scope operator contoh").selectOption("support");
    await navigate(page, "Tiket bantuan");
    await page.getByRole("button", { name: /TK-2051/ }).click();
    await expect(page.getByText(/Tiket belum ditugaskan kepada Anda/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Kirim balasan", exact: true })).toHaveCount(0);
    await page.getByRole("button", { name: /TK-2048/ }).click();
    await page.getByLabel("Jenis respons").selectOption("internal");
    await page.getByLabel("Draf catatan internal").fill("Catatan privat untuk Farah saja.");
    await page.getByRole("button", { name: "Simpan draf", exact: true }).click();
    await expect(
      page.getByRole("article").filter({ hasText: "Catatan privat untuk Farah saja." }),
    ).toHaveCount(0);
    await page.getByRole("button", { name: "Simpan catatan internal", exact: true }).click();
    await expect(
      page.getByRole("article").filter({ hasText: "Catatan privat untuk Farah saja." }),
    ).toBeVisible();
    await navigate(page, "Tiket pribadi pemilik");
    await page.getByRole("button", { name: "Buka percakapan", exact: true }).click();
    const owner = page.getByRole("dialog", { name: /TK-2048/ });
    await expect(owner).not.toContainText("Catatan privat untuk Farah saja.");
    await expect(owner.getByLabel("Jenis respons")).toHaveCount(0);
    await owner.getByRole("button", { name: "Tutup dialog" }).click();
    await page.getByRole("button", { name: /Cari menu atau data/ }).click();
    const command = page.getByRole("dialog", { name: "Cari menu SUPPORT" });
    await command.getByLabel("Cari menu operasi").fill("CMS");
    await expect(command.getByText("Tidak ada hasil pada scope ini.")).toBeVisible();
    await expect(page.getByRole("button", { name: /Ekspor.*(KTP|rekening|kontak)/ })).toHaveCount(
      0,
    );
  });

  test("CMS memerlukan SEO/legal/ack dan menolak versi stale tanpa mengubah aktif", async ({
    page,
  }) => {
    await navigate(page, "CMS & Konten");
    await scenario(page, "stale");
    await page.getByRole("button", { name: "Review publikasi konten", exact: true }).click();
    const review = page.getByRole("dialog", { name: /TPL-012/ });
    await review.getByRole("button", { name: "Review versi 13", exact: true }).click();
    const confirm = review.getByRole("button", { name: "Konfirmasi publikasi simulasi" });
    await expect(confirm).toBeDisabled();
    await review.getByLabel(/Metadata SEO/).check();
    await review.getByLabel(/Dampak legal/).check();
    await review.getByLabel("Alasan publikasi").fill("Konten dan kebijakan sudah direview.");
    await review.getByLabel(/Saya mengonfirmasi TPL-012/).check();
    await confirm.click();
    await expect(review.getByRole("alert")).toContainText("Versi berubah");
    const row = page.getByRole("row").filter({ hasText: "TPL-012" });
    await expect(row).toContainText("v12");
    await expect(row).toContainText("v13");
  });

  test("akun kosong menonaktifkan bulk; offline menolak perubahan sesi per objek", async ({
    page,
  }) => {
    await navigate(page, "Akun & Otorisasi");
    await expect(page.getByRole("button", { name: "Tinjau tindakan massal" })).toBeDisabled();
    await page.getByLabel("Pilih Farah", { exact: true }).check();
    await scenario(page, "offline");
    await page.getByRole("button", { name: "Tinjau tindakan massal" }).click();
    const review = page.getByRole("dialog", { name: "Review tindakan akun" });
    await review.getByLabel("Alasan tindakan").fill("Tinjau sesi akun sesuai penugasan.");
    await review.getByLabel(/Saya telah meninjau scope/).check();
    await review.getByRole("button", { name: "Konfirmasi tindakan simulasi" }).click();
    await expect(review.getByRole("alert")).toContainText("offline");
    await expect(review.getByText(/Farah · v4 · 2 sesi aktif/)).toBeVisible();
  });

  test("bantuan owner reflow 375/768/1280, browser install opsional dan dirty-dismiss", async ({
    page,
  }) => {
    await navigate(page, "Tiket pribadi pemilik");
    for (const width of [375, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.getByRole("heading", { name: /Ada yang bisa/ })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await expect(page.getByRole("button", { name: "Pasang", exact: true })).toBeDisabled();
    await page.getByRole("button", { name: "Buka percakapan", exact: true }).click();
    const owner = page.getByRole("dialog", { name: /TK-2048/ });
    await owner.getByLabel("Draf balasan").fill("Pertanyaan pribadi belum dikirim.");
    await owner.getByRole("button", { name: "Tutup dialog" }).click();
    await expect(owner.getByText("Draf belum disimpan. Buang perubahan?")).toBeVisible();
    await owner.getByRole("button", { name: "Kembali ke percakapan" }).click();
    await expect(owner.getByLabel("Draf balasan")).toHaveValue("Pertanyaan pribadi belum dikirim.");
    await owner.getByRole("button", { name: "Simpan draf", exact: true }).click();
    await expect(
      owner.getByRole("article").filter({ hasText: "Pertanyaan pribadi belum dikirim." }),
    ).toHaveCount(0);
  });
});
