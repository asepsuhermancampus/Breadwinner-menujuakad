import { expect, test } from "@playwright/test";

test("profil memvalidasi lalu menyimpan dan memuat ulang perubahan", async ({ page }) => {
  await page.goto("/preview-ui/account");
  const email = page.getByLabel("Alamat email", { exact: true });
  await email.fill("email-belum-valid");
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByText("Periksa kembali alamat email.", { exact: true })).toBeVisible();
  await expect(email).toBeFocused();
  await expect(page.getByLabel("Nama lengkap")).toHaveValue("Risa Pratiwi");

  await email.fill("risa.pratiwi@gmail.com");
  await page.getByLabel("Nomor WhatsApp", { exact: true }).fill("0812 3456 7890");
  await page.getByLabel("Preferensi adat").fill("Sunda modern");
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByText("Perubahan profil disimpan pada pratinjau.")).toBeVisible();
  await expect(page.getByLabel("Nomor WhatsApp", { exact: true })).toHaveValue("+6281234567890");
  await expect(page.getByRole("button", { name: "Simpan perubahan", exact: true })).toBeDisabled();
  await page.reload();
  await expect(page.getByLabel("Preferensi adat")).toHaveValue("Sunda modern");
});

test("offline mempertahankan draf profil hingga simpan ulang berhasil", async ({ page }) => {
  await page.goto("/preview-ui/account");
  await page.getByLabel("Nama lengkap").fill("Risa Pratiwi Draf");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByLabel("Kondisi adapter").selectOption("offline");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByText("Kamu sedang offline. Draf belum disimpan.")).toBeVisible();
  await expect(page.getByLabel("Nama lengkap")).toHaveValue("Risa Pratiwi Draf");
  expect(await page.evaluate(() => localStorage.getItem("ma-v2-account"))).toBeNull();

  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByLabel("Kondisi adapter").selectOption("ready");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  await expect(page.getByText("Perubahan profil disimpan pada pratinjau.")).toBeVisible();
  await expect(page.getByLabel("Nama lengkap")).toHaveValue("Risa Pratiwi Draf");
});

test("inspector menjaga draf, membatalkan edit, dan mengembalikan fokus pemicu", async ({
  page,
}) => {
  await page.goto("/preview-ui/account");
  const trigger = page.getByRole("button", { name: "Kelola pasangan", exact: true });
  await trigger.click();
  const inspector = page.getByRole("dialog", { name: "Detail pasangan", exact: true });
  const nickname = inspector.getByLabel("Nama panggilan");
  await nickname.fill("Andi draf");
  await inspector.getByRole("button", { name: "Tutup dialog", exact: true }).click();
  const confirmation = page.getByRole("dialog", { name: "Simpan perubahanmu?", exact: true });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "Lanjut edit", exact: true }).click();
  await expect(nickname).toHaveValue("Andi draf");
  await nickname.press("Escape");
  await expect(nickname).toHaveValue("Andi");
  await expect(inspector).toBeVisible();
  await nickname.fill("Andi belum disimpan");
  await inspector.getByRole("button", { name: "Tutup dialog", exact: true }).click();
  await confirmation.getByRole("button", { name: "Buang perubahan", exact: true }).click();
  await expect(inspector).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(page.getByLabel("Nama panggilan")).toHaveValue("Andi");
});
