import { expect, test } from "@playwright/test";

test.describe("Audit Regression · KUA Document Uploads", () => {
  test("A07 & A08: file KUA >5MB ditolak dialog tetap buka, file valid berhasil, dan dokumen berikutnya tidak reuse file", async ({
    page,
  }) => {
    await page.goto("/planner/kua");
    const firstRow = page
      .locator("tbody tr")
      .filter({ has: page.getByText("Sertifikat Elsimil & surat sehat", { exact: true }) });
    const secondRow = page
      .locator("tbody tr")
      .filter({ has: page.getByText("Surat rekomendasi nikah KUA asal (N8)", { exact: true }) });

    const initialLengkapCount = await firstRow.getByText("Lengkap", { exact: true }).count();
    const initialSecondLengkapCount = await secondRow.getByText("Lengkap", { exact: true }).count();

    await firstRow.getByText(/Perlu revisi/i).click();
    const dialog = page.locator("dialog[open]").or(page.getByRole("dialog"));
    await dialog.locator("input[type=file]").setInputFiles({
      name: "too-large.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.alloc(6 * 1024 * 1024, 1),
    });
    await dialog.getByRole("button", { name: "Kirim berkas revisi", exact: true }).click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("Ukuran berkas melebihi batas maksimal 5MB.")).toBeVisible();
    await expect(firstRow.getByText("Lengkap", { exact: true })).toHaveCount(initialLengkapCount);

    await dialog.locator("input[type=file]").setInputFiles({
      name: "valid-elsimil.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 valid elsimil document"),
    });
    await dialog.getByRole("button", { name: "Kirim berkas revisi", exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(firstRow.getByText("Lengkap", { exact: true })).toHaveCount(
      initialLengkapCount + 1,
    );

    await secondRow.getByText(/Perlu revisi/i).click();
    const secondDialog = page.locator("dialog[open]").or(page.getByRole("dialog"));
    await expect(secondDialog).toBeVisible();
    const filesCount = await secondDialog
      .locator("input[type=file]")
      .evaluate((el: HTMLInputElement) => el.files?.length ?? 0);
    expect(filesCount).toBe(0);

    await secondDialog.getByRole("button", { name: "Kirim berkas revisi", exact: true }).click();
    await expect(secondDialog.getByText("Pilih berkas terlebih dahulu.")).toBeVisible();
    await expect(secondDialog).toBeVisible();
    await expect(secondRow.getByText("Lengkap", { exact: true })).toHaveCount(
      initialSecondLengkapCount,
    );
    await expect(secondRow.getByText(/Perlu revisi/i)).toBeVisible();
  });
});
