import { expect, test } from "@playwright/test";

test.describe("Batch 02 · Planner Modules E2E", () => {
  test("dashboard switches between wedding and engagement context", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Selamat pagi, Andi & Risa.");
    await expect(page.getByText("H–112 · Menuju akad")).toBeVisible();
    await expect(page.getByText("21/25")).toBeVisible();
    await expect(page.getByText("Rp 112.500.000 terkumpul")).toBeVisible();

    // Switch to engagement
    await page.getByRole("tab", { name: "Mode Lamaran" }).click();
    await expect(page.getByText("H–28 · Menuju lamaran")).toBeVisible();
    await expect(page.getByText("6/10")).toBeVisible();
    await expect(page.getByText("Rp 12.000.000 dari Rp 20 jt")).toBeVisible();
  });

  test("task manager filters, searches, and edits via quick inspector", async ({ page }) => {
    await page.goto("/planner/tasks");
    await expect(page.locator("h1")).toContainText("Checklist & tugas");
    await expect(page.getByText("21 dari 25 tugas selesai")).toBeVisible();

    // Filter "Hari ini"
    await page.getByRole("tab", { name: /Hari ini/ }).click();
    await expect(page.getByText("Konfirmasi jadwal fitting ke-2")).toBeVisible();

    // Search
    await page.getByPlaceholder("Cari tugas…").fill("Elsimil");
    await expect(page.getByText("Unggah sertifikat Elsimil")).toBeVisible();

    // Open inspector
    await page.getByText("Unggah sertifikat Elsimil").click();
    const inspector = page.getByRole("dialog", { name: "Detail tugas" });
    await expect(inspector).toBeVisible();

    // Close inspector
    await inspector.getByRole("button", { name: "Tutup panel" }).click();
    await expect(inspector).not.toBeVisible();
  });

  test("kua documents displays spouse statuses and opens revision dialog", async ({ page }) => {
    await page.goto("/planner/kua");
    await expect(page.locator("h1")).toContainText("Dokumen KUA & syarat nikah");
    const spouseSection = page.getByRole("region", { name: "Ringkasan calon pengantin" });
    await expect(spouseSection.getByText("5/7")).toBeVisible(); // Andi
    await expect(spouseSection.getByText("7/7")).toBeVisible(); // Risa

    // Filter Perhatian
    await page.getByRole("tab", { name: /Perlu perhatian/ }).click();
    await expect(page.getByText("Sertifikat Elsimil & surat sehat")).toBeVisible();

    // Open revision dialog
    await page.getByText("Perlu revisi").first().click();
    await expect(page.getByRole("dialog", { name: "Unggah revisi berkas KUA" })).toBeVisible();
    await page.getByRole("button", { name: "Batal" }).click();
  });

  test("emergency checklist and rundown maintain sacral anchors", async ({ page }) => {
    await page.goto("/planner/emergency");
    await expect(page.locator("h1")).toContainText("Perlengkapan darurat Hari-H");
    await expect(page.getByText("18/24")).toBeVisible();

    await page.goto("/planner/rundown");
    await expect(page.locator("h1")).toContainText("Rundown acara");
    await expect(page.getByText("Kunci Sakral").first()).toBeVisible();
    await expect(page.getByText("08:00 – 09:00")).toBeVisible();
    await expect(page.getByText("10:00 – 14:00")).toBeVisible();
  });

  test("catering calculator verifies portions vs guests formula", async ({ page }) => {
    await page.goto("/planner/catering");
    await expect(page.locator("h1")).toContainText("Hitung porsi, tanpa menebak");
    await expect(page.getByText("Coming Soon")).toBeVisible();
    await expect(page.getByText("1.100 orang")).toBeVisible();
    await expect(page.getByText("660")).toBeVisible(); // Buffet 60%
    await expect(page.getByText("1.760")).toBeVisible(); // Stall 40% x 4
    await expect(page.getByText("2.420 Porsi")).toBeVisible();
  });

  test("seserahan, moodboard, and wedding kit display respective states", async ({ page }) => {
    await page.goto("/planner/seserahan");
    await expect(page.locator("h1")).toContainText("Seserahan, satu per satu");
    await expect(page.getByText("Rp 10.200.000")).toBeVisible();
    await expect(page.getByText("Rp 7.050.000")).toBeVisible();
    await expect(page.getByText("3/6 barang")).toBeVisible();

    await page.goto("/planner/moodboard");
    await expect(page.locator("h1")).toContainText("Bayangkan hari kalian");
    await expect(page.getByText("#1E3F32")).toBeVisible();

    await page.goto("/planner/wedding-kit");
    await expect(page.locator("h1")).toContainText("Wedding Kit");
    await expect(page.getByText("Maintenance", { exact: true })).toBeVisible();
  });

  test("digital product fulfillment simulates states and receipt", async ({ page }) => {
    await page.goto("/fulfillment/DIG-SIM-49");
    await expect(page.locator("h1")).toContainText("Produk digital · setelah pembayaran");
    await expect(page.getByText("AKSES MILIK PEMBELI")).toBeVisible();
    await expect(page.getByText("REC-49-882")).toBeVisible();

    // Toggle to Pending
    await page.getByRole("tab", { name: "1. Menunggu" }).click();
    await expect(page.getByRole("status").getByText("MENUNGGU", { exact: true })).toBeVisible();

    // Toggle to Failed Delivery
    await page.getByRole("tab", { name: "3. Gagal Kirim" }).click();
    await expect(
      page.getByRole("status").getByText("AKSES TETAP DIMILIKI", { exact: true }),
    ).toBeVisible();
  });
});
