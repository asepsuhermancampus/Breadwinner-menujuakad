import { expect, test } from "@playwright/test";

test.describe("Batch 04 — CRM, Studio, Undangan, Check-in, Marketplace & Checkout", () => {
  test("4A: CRM Tamu, filter, detail, seating rombongan & WA review", async ({ page }) => {
    await page.goto("/planner/guests");
    await expect(page.getByRole("heading", { name: "Daftar Tamu & RSVP" })).toBeVisible();
    await expect(page.getByText("350 undangan").first()).toBeVisible();
    await expect(page.getByText("170 / 340 orang")).toBeVisible();

    // Search and detail inspector
    const search = page.getByPlaceholder("Cari nama, grup, atau nomor…");
    await search.fill("Budi Santoso");
    await page.getByRole("button", { name: "Detail" }).first().click();
    await expect(page.getByRole("heading", { name: "Detail Undangan & Tiket" })).toBeVisible();
    await expect(page.getByText(/Izin Diberikan/i)).toBeVisible();
    await page.getByRole("button", { name: "Tutup dialog" }).click();

    // Seating tab & overcapacity check
    await page.getByRole("button", { name: "Penempatan Meja" }).click();
    await expect(page.getByText("Penempatan Meja & Kapasitas Kursi")).toBeVisible();
    // Try to assign 3 pax to table 04 (sisa 2)
    const table04Btn = page.getByRole("button", { name: /Meja 04/i }).first();
    if (await table04Btn.isVisible()) {
      await table04Btn.click();
      await expect(page.getByText(/tidak cukup untuk Rafi/i)).toBeVisible();
    }

    // WA Composer & Review
    await page.getByRole("button", { name: "Pengiriman WA" }).click();
    await expect(page.getByText("Template Pesan").first()).toBeVisible();
    await page.getByRole("button", { name: /Pilih 14 Penerima & Tinjau/i }).click();
    await expect(page.getByText("Kirim ke 10 Undangan?")).toBeVisible();
    await expect(page.getByText(/4 dikecualikan/i)).toBeVisible();
  });

  test("4B: Studio Undangan dan publikasi draf", async ({ page }) => {
    await page.goto("/planner/invitations/studio");
    await expect(page.getByRole("heading", { name: "Studio Undangan" })).toBeVisible();
    await expect(page.getByText(/Draf v4/i).first()).toBeVisible();

    // Existing theme configuration is now inside the complete visual studio.
    await page.getByRole("button", { name: "RSVP & Privasi (Draf)" }).click();
    await page.getByText("Galeri Tema", { exact: true }).click();
    await expect(page.getByText("Editorial Light").first()).toBeVisible();
    await expect(page.getByText("Cypress Modern").first()).toBeVisible();

    // Publish review modal
    await page.getByRole("button", { name: /Publikasikan Draf/i }).click();
    await expect(page.getByRole("heading", { name: "Tinjau snapshot v4" })).toBeVisible();
  });

  test("4B: Public personal invitation at /i/[token] and ticket QR", async ({ page }) => {
    await page.goto("/i/token-budi-a7c6");
    await expect(page.getByText("THE WEDDING OF").first()).toBeVisible();
    await expect(page.getByRole("main").getByText("Budi Santoso & Partner")).toBeVisible();
    await expect(page.getByRole("main").getByText("Meja 04")).toBeVisible();

    // Open ticket card
    await page.getByRole("button", { name: /Lihat Tiket Masuk/i }).click();
    await expect(page.getByText(/QR DEMO/i)).toBeVisible();

    // Test invalid opaque token recovery (50D)
    await page.goto("/i/invalid-expired-token-999");
    await expect(page.getByRole("heading", { name: "Tautan Tidak Tersedia" })).toBeVisible();
    await expect(page.getByText(/Perlindungan Privasi/i)).toBeVisible();
  });

  test("4B: Konsol check-in hari-H and ticket scan commit", async ({ page }) => {
    await page.goto("/checkin");
    await expect(page.getByRole("heading", { name: "Pernikahan Andi & Risa" })).toBeVisible();
    await expect(page.getByText("Dina (Gerbang A)")).toBeVisible();
    await expect(page.getByText("214", { exact: true })).toBeVisible(); // Validated count

    // Open scanner and confirm 2 pax arrival
    await page.getByRole("button", { name: /Pindai Tiket Personal/i }).click();
    await expect(page.getByRole("heading", { name: "Budi Santoso & Partner" })).toBeVisible();
    await page.getByRole("button", { name: /Konfirmasi Kedatangan/i }).click();

    // Check count updated 214 -> 216
    await expect(page.getByText("216", { exact: true })).toBeVisible();
  });

  test("4C: Marketplace 11 kategori, same-date check & bundler", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(
      page.getByRole("heading", { name: "Temukan Tim untuk Hari Kalian" }),
    ).toBeVisible();

    // Verify 11 exact categories
    for (const cat of [
      "Prewedding",
      "Busana / Fitting",
      "MUA",
      "Seserahan / Mahar",
      "Dokumentasi",
      "Dekorasi / Florist",
      "Katering",
      "Kue / Dessert",
      "Souvenir",
      "Undangan Digital / Cetak / Hybrid",
      "Denah Ilustrasi",
    ]) {
      await expect(page.getByRole("button", { name: cat, exact: false }).first()).toBeVisible();
    }

    // Same-date check modal
    await page.getByRole("button", { name: /Cek Tanggal Serentak/i }).click();
    await expect(page.getByText("Satu Tanggal. Semua Vendor Diperiksa.")).toBeVisible();
    await expect(page.getByRole("dialog").getByText("Kalyana Photo")).toBeVisible();
    await page.getByRole("button", { name: "Selesai Meninjau" }).click();

    // Vendor detail
    await page.goto("/marketplace/vendor/lensa-teduh");
    await expect(page.getByRole("heading", { name: "Lensa Teduh Photo" })).toBeVisible();
    await expect(page.getByText("14 Feb 2027 Tersedia").first()).toBeVisible();

    // Bundler
    await page.goto("/marketplace/bundles");
    await expect(page.getByRole("heading", { name: /PKT-SIM-204/i })).toBeVisible();
    await expect(page.getByText("Rp 35.000.000").first()).toBeVisible();
  });

  test("4D: Checkout jasa tanpa akun, contract v9, payment & receipt", async ({ page }) => {
    await page.goto("/checkout/services");
    await expect(page.getByRole("heading", { name: /Paket Layanan: PKT-SIM-204/i })).toBeVisible();
    await expect(page.getByText("Hold Server: 14:52")).toBeVisible();

    // Proceed to Step 2: Contract & rejection resolution
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Lanjut ke Peninjauan/i }).click();

    // Step 2: Replace Luma with Rona
    await expect(page.getByText("Satu Item Ditolak, Paket Tetap Aman")).toBeVisible();
    await page.getByRole("button", { name: /Terapkan Pengganti Rona Dekor/i }).click();

    // Approve contract v9
    await expect(page.getByText("Kontrak Draf v9")).toBeVisible();
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: /Setujui Kontrak/i }).click();

    // Step 3: Payment choice
    await expect(page.getByText("Pilih Cara Pembayaran")).toBeVisible();
    await expect(page.getByText("DP 30%").first()).toBeVisible();
    await page.getByRole("button", { name: /Bayar Sekarang/i }).click();

    // Step 4: Status view
    await expect(page.getByText("Status Transaksi yang Tidak Menebak")).toBeVisible();

    // Order receipt and dispute at /orders/ORD-SIM-204
    await page.goto("/orders/ORD-SIM-204");
    await expect(page.getByRole("heading", { name: /INV-SIM-204-01/i })).toBeVisible();
    await expect(page.getByText("RCPT-SIM-204-01")).toBeVisible();
    await page.getByRole("button", { name: /Ajukan Sengketa/i }).click();
    await expect(page.getByText("Pengajuan Sengketa Terarah")).toBeVisible();
  });
});
