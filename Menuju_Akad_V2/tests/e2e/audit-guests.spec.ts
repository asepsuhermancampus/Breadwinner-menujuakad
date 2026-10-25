import { expect, test } from "@playwright/test";

test.describe("Audit Regression · Guest CRM & Experience", () => {
  test("A09: kuota undangan Budi tidak dapat dikurangi di bawah kehadiran 2 orang", async ({
    page,
  }) => {
    await page.goto("/planner/guests");
    const search = page.getByRole("searchbox", { name: /Cari nama, grup, atau nomor/i });
    await search.fill("Budi Santoso");
    await page.getByRole("button", { name: "Detail", exact: true }).first().click();
    const dialog = page.getByRole("dialog", { name: "Detail Undangan & Tiket" });
    await expect(dialog).toContainText("Hadir (2 orang)");

    const minusBtn = dialog.getByRole("button", { name: "−", exact: true });
    await expect(minusBtn).toBeDisabled();
    await expect(dialog.locator("span.font-mono.font-bold")).toHaveText("2");
    await expect(dialog).toContainText("Hadir (2 orang)");
    await dialog.getByRole("button", { name: "Tutup dialog" }).click();
  });

  test("B02: pencarian nomor lokal 08 memberikan hasil setara dengan format +62", async ({
    page,
  }) => {
    await page.goto("/planner/guests");
    const search = page.getByRole("searchbox", { name: /Cari nama, grup, atau nomor/i });
    await search.fill("081234564601");
    await expect(page.locator("tbody:visible")).toContainText("Budi Santoso");

    await search.fill("+6281234564601");
    await expect(page.locator("tbody:visible")).toContainText("Budi Santoso");
  });

  test("A10: pengarsipan 3 tamu di halaman 2 memulihkan tampilan 8 tamu halaman pertama", async ({
    page,
  }) => {
    await page.goto("/planner/guests");
    const search = page.getByRole("searchbox", { name: /Cari nama, grup, atau nomor/i });
    await search.fill("Tamu Undangan 34");
    await page.getByRole("button", { name: "Berikutnya", exact: true }).click();

    for (let i = 0; i < 3; i++) {
      await page.getByRole("button", { name: "Detail", exact: true }).first().click();
      const dialog = page.getByRole("dialog", { name: "Detail Undangan & Tiket" });
      await dialog.getByRole("button", { name: /Arsipkan Undangan Ini/i }).click();
      await dialog.getByRole("button", { name: "Ya, Arsipkan", exact: true }).click();
    }

    await expect(page.locator("tbody:visible tr")).toHaveCount(8);
    await expect(page.getByText(/Menampilkan 9[–-]8/)).toHaveCount(0);
    await expect(page.getByText(/Menampilkan 1[–-]8 dari 8/i)).toBeVisible();
  });

  test("B04: review pengiriman WA kedua menyajikan kuota terkini 90 dan checkbox awal bersih", async ({
    page,
  }) => {
    await page.goto("/planner/guests");
    await page.getByRole("button", { name: "Pengiriman WA", exact: true }).click();
    await page.getByRole("button", { name: /Pilih 14 Penerima/i }).click();
    const dialog = page.getByRole("dialog", { name: "Tinjauan Pengiriman WhatsApp" });
    await dialog.getByRole("checkbox", { name: /Saya sudah meninjau/i }).check();
    await dialog.getByRole("button", { name: "Kirim 10 Pesan Sekarang", exact: true }).click();

    await page.getByRole("button", { name: "Kirim Undangan WA", exact: true }).click();
    await expect(page.getByText(/90 pesan/i)).toBeVisible();
    await page.getByRole("button", { name: /Pilih.*Penerima/i }).click();

    const secondDialog = page.getByRole("dialog", { name: "Tinjauan Pengiriman WhatsApp" });
    const ack = secondDialog.getByRole("checkbox", { name: /Saya sudah meninjau/i });
    await expect(ack).not.toBeChecked();
    await expect(secondDialog).toContainText("90 → 90");
    await expect(secondDialog).not.toContainText("100 → 90");
    await expect(secondDialog).toContainText("0 memenuhi syarat");
    await expect(
      secondDialog.getByRole("button", { name: /Kirim.*Pesan Sekarang/i }),
    ).toBeDisabled();
  });

  test("A11: retry online yang berhasil membersihkan banner error kegagalan offline", async ({
    page,
  }) => {
    await page.goto("/i/token-budi-a7c6/acara");
    await page.getByRole("button", { name: "RSVP per Sesi", exact: true }).click();
    const save = page.getByRole("button", { name: "Simpan jawaban per sesi", exact: true });

    await page.context().setOffline(true);
    try {
      await save.click();
      await expect(
        page.getByRole("alert").filter({ hasText: /offline|belum disimpan/i }),
      ).toBeVisible();
    } finally {
      await page.context().setOffline(false);
    }

    await save.click();
    await expect(
      page.getByRole("status").filter({ hasText: /Jawaban per sesi tersimpan/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("alert").filter({ hasText: /offline|belum disimpan/i }),
    ).toHaveCount(0);
  });
});
