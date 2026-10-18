import { expect, test } from "@playwright/test";

test.describe("Batch 06 · studio dan siklus publikasi", () => {
  test("Visual/Form, zoom dan recovery memakai satu dokumen", async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1160 });
    await page.goto("/planner/invitations/studio");
    await expect(page.getByTestId("studio-canvas")).toBeVisible();
    await page.screenshot({ path: "test-results/batch06-studio-desktop.png", fullPage: true });
    await page.getByRole("button", { name: "Pilih layer Nama pasangan", exact: true }).dblclick();
    await page.getByLabel("Edit judul langsung").fill("Judul dari kanvas");
    await page.getByLabel("Edit judul langsung").press("Enter");
    await expect(page.getByTestId("studio-canvas")).toContainText("Judul dari kanvas");
    await page.getByRole("button", { name: "Form", exact: true }).click();
    await expect(page.getByLabel("Judul pasangan", { exact: true })).toHaveValue(
      "Judul dari kanvas",
    );
    await page.getByLabel("Judul pasangan", { exact: true }).fill("Andi & Risa Bahagia");
    await page.getByRole("button", { name: "Visual", exact: true }).click();
    await expect(page.getByTestId("studio-canvas")).toContainText("Andi & Risa Bahagia");
    await page.getByLabel("Zoom kanvas").selectOption("125");
    await expect(page.getByTestId("studio-canvas")).toHaveAttribute("data-model-width", "375");
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("ma-studio-v1:inv-wedding-main") ?? "{}").dirty,
        ),
      )
      .toBe(false);
    await page.reload();
    await page.getByRole("button", { name: "Form", exact: true }).click();
    await expect(page.getByLabel("Judul pasangan", { exact: true })).toHaveValue(
      "Andi & Risa Bahagia",
    );
  });

  test("layer terkunci, transform, undo dan redo bekerja tanpa drag", async ({ page }) => {
    await page.goto("/planner/invitations/studio");
    await page.getByRole("button", { name: "Layer", exact: true }).click();
    await page.getByRole("option", { name: /Foto sampul/ }).click();
    await expect(page.getByLabel("X", { exact: true })).toBeDisabled();
    await page.getByRole("option", { name: /Nama pasangan/ }).click();
    await page.getByRole("button", { name: "Balik H", exact: true }).click();
    await expect(page.getByRole("button", { name: "Balik H", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Urungkan", exact: true }).click();
    await expect(page.getByRole("button", { name: "Balik H", exact: true })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await page.getByRole("button", { name: "Ulangi perubahan", exact: true }).click();
    await expect(page.getByRole("button", { name: "Balik H", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await page.getByRole("button", { name: "Kunci layer", exact: true }).click();
    await expect(page.getByLabel("Teks", { exact: true })).toBeDisabled();
  });

  test("offline dan konflik mempertahankan field lain saat resolusi", async ({ page }) => {
    await page.goto("/planner/invitations/studio");
    await page.getByRole("button", { name: "Status", exact: true }).click();
    await page.getByLabel("Terhubung", { exact: true }).uncheck();
    await page.getByRole("button", { name: "Form", exact: true }).click();
    await page.getByLabel("Nama mempelai pria").fill("Andi Ramadhan Baru");
    await page.getByLabel("Lokasi", { exact: true }).fill("Hall");
    await page.getByRole("button", { name: "Status", exact: true }).click();
    await page.getByRole("button", { name: "Simulasikan konflik versi" }).click();
    await page.getByLabel("Terhubung", { exact: true }).check();
    await page.getByRole("button", { name: "Gunakan nilai server" }).click();
    await page.getByRole("button", { name: "Form", exact: true }).click();
    await expect(page.getByLabel("Lokasi", { exact: true })).toHaveValue("Garden");
    await expect(page.getByLabel("Nama mempelai pria")).toHaveValue("Andi Ramadhan Baru");
  });

  test("review memerlukan ack dan restore tidak mengubah snapshot aktif", async ({ page }) => {
    await page.goto("/planner/invitations/studio");
    await page.getByRole("button", { name: "Review & publikasi" }).click();
    const review = page.getByRole("dialog");
    await expect(review.getByRole("button", { name: "Konfirmasi & terbitkan v4" })).toBeDisabled();
    await review.getByLabel(/Saya sudah meninjau konten/).check();
    await review.getByRole("button", { name: "Konfirmasi & terbitkan v4" }).click();
    await expect(review.getByText(/Snapshot v4 diterbitkan/)).toBeVisible();
    await review.getByRole("button", { name: "Kembali ke studio" }).click();
    await page.getByRole("button", { name: "Riwayat versi", exact: true }).click();
    await page.getByRole("dialog").getByRole("checkbox").check();
    await page.getByRole("button", { name: "Pulihkan v2 sebagai draf baru" }).click();
    await expect(page.getByText("Draf v6 · versi aktif v4", { exact: true })).toBeVisible();
  });

  test("pin yang belum lengkap menghalangi publikasi", async ({ page }) => {
    await page.goto("/planner/invitations/studio");
    await page.getByRole("button", { name: "Form", exact: true }).click();
    await page.getByLabel("Pin venue sudah ditinjau").uncheck();
    await page.getByRole("button", { name: "Review & publikasi" }).click();
    await expect(page.getByRole("dialog").getByText("Tetapkan pin lokasi acara.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Konfirmasi & terbitkan v4" })).toBeDisabled();
  });

  test("proyek lamaran terisolasi dan tombol lanjut draf membuka proyeknya", async ({ page }) => {
    await page.goto("/planner/invitations");
    await page
      .getByRole("article")
      .filter({ hasText: "Lamaran keluarga" })
      .getByRole("button", { name: /Lanjutkan draf/ })
      .click();
    await expect(page).toHaveURL(/project=inv-engagement/);
    await page.getByRole("button", { name: "Form", exact: true }).click();
    await expect(page.getByLabel("Tanggal acara", { exact: true })).toHaveValue("2026-11-22");
    await expect(page.getByText("Draf v1 · versi aktif belum ada", { exact: true })).toBeVisible();
  });

  for (const width of [375, 768, 1280])
    test(`reflow ${width}px dan iframe memakai viewport aktual`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/planner/invitations/studio");
      await page.getByRole("button", { name: "Form", exact: true }).click();
      await expect(page.getByLabel("Nama mempelai pria")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.getByLabel("Ukuran preview").selectOption(String(width));
      await page.getByRole("button", { name: "Preview tamu", exact: true }).click();
      const frame = page.getByRole("dialog").locator("iframe");
      await expect(frame).toHaveAttribute("title", `Undangan preview ${width}`);
      await expect(frame).toHaveJSProperty("width", String(width));
      await expect(
        page.getByRole("dialog").getByText(`Viewport aktual ${width} CSS px.`, { exact: false }),
      ).toBeVisible();
    });
});
