import { expect, test } from "@playwright/test";

test("preferensi tersimpan dan pencabutan sesi tetap melindungi perangkat ini", async ({
  page,
}) => {
  await page.goto("/preview-ui/account/security");
  const whatsApp = page.getByRole("switch", { name: /^Pengingat WhatsApp/ });
  await expect(whatsApp).not.toBeChecked();
  await whatsApp.check();
  await page.getByRole("button", { name: "Simpan preferensi", exact: true }).click();
  await expect(
    page.getByText("Preferensi disimpan pada pratinjau. Tidak ada pesan yang dikirim."),
  ).toBeVisible();
  await page.reload();
  await expect(whatsApp).toBeChecked();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Keluar dari perangkat?", exact: true });
  await confirmation.getByRole("button", { name: "Batalkan", exact: true }).click();
  await expect(page.getByText("Safari · iPhone", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await confirmation.getByRole("button", { name: "Ya, keluar", exact: true }).click();
  await expect(page.getByText("Safari · iPhone", { exact: true })).not.toBeVisible();
  await expect(page.getByText("Chrome · Windows", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Keluar dari perangkat lain" })).toBeDisabled();
  await page.reload();
  await expect(page.getByText("Safari · iPhone", { exact: true })).not.toBeVisible();
  await expect(page.getByText("Chrome · Windows", { exact: true })).toBeVisible();
});

test("penghapusan memerlukan konfirmasi eksplisit dan kode simulasi yang benar", async ({
  page,
}) => {
  await page.goto("/preview-ui/account/security");
  await page.getByRole("button", { name: "Hapus akun…", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Konfirmasi hapus akun", exact: true });
  const next = confirmation.getByRole("button", { name: "Lanjut ke verifikasi", exact: true });
  await expect(next).toBeDisabled();
  await confirmation.getByLabel("Ketik HAPUS AKUN untuk melanjutkan").fill("HAPUS AKUN");
  await expect(next).toBeDisabled();
  await confirmation
    .getByRole("checkbox", { name: "Saya memahami dampak penghapusan akun ini." })
    .check();
  await next.click();
  const verification = page.getByRole("dialog", { name: "Verifikasi penghapusan", exact: true });
  await expect(verification).toBeVisible();
  await verification.getByLabel("Kode verifikasi simulasi", { exact: true }).fill("111111");
  await verification.getByRole("button", { name: "Konfirmasi hapus akun simulasi" }).click();
  await expect(verification.getByText("Kode tidak valid.", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("ma-v2-account-deleted"))).toBeNull();
  await verification.getByLabel("Kode verifikasi simulasi", { exact: true }).fill("882016");
  await verification.getByRole("button", { name: "Konfirmasi hapus akun simulasi" }).click();
  await expect(
    page.getByText("Simulasi penghapusan selesai. Akun produksi tidak berubah.", { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("ma-v2-account-deleted"))).toBe("true");
});
