import { expect, test, type Page } from "@playwright/test";

let errors: string[] = [];
test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});
test.afterEach(() => expect(errors).toEqual([]));

async function pasteCode(page: Page, code: string) {
  await page.getByLabel("Digit 1 dari 6", { exact: true }).evaluate((element, text) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData("text", text);
    element.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData, bubbles: true, cancelable: true }),
    );
  }, code);
}
async function beginEmailLogin(page: Page) {
  await page.goto("/preview-ui/auth/login");
  await page.getByLabel("Alamat email", { exact: true }).fill("risa@example.com");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Rahasia123");
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Verifikasi akunmu" })).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}

test("email login validates, guards pending, rejects wrong OTP and accepts a pasted code", async ({
  page,
}) => {
  await page.goto("/preview-ui/auth/login");
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByText("Periksa format alamat email.", { exact: true })).toBeVisible();
  await expect(page.getByText("Masukkan kata sandi Anda.", { exact: true })).toBeVisible();
  await page.getByLabel("Alamat email", { exact: true }).fill("risa@example.com");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Rahasia123");
  await page.getByRole("button", { name: "Tampilkan kata sandi", exact: true }).click();
  await expect(page.getByLabel("Kata sandi", { exact: true })).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByRole("button", { name: "Memeriksa akses…" })).toBeDisabled();
  const dialog = page.getByRole("dialog", { name: "Verifikasi akunmu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: /Kirim ulang dalam/ })).toBeDisabled();
  await page.getByLabel("Digit 1 dari 6", { exact: true }).fill("000000");
  await expect(page.getByLabel("Digit 6 dari 6", { exact: true })).toHaveValue("0");
  await dialog.getByRole("button", { name: "Verifikasi & lanjutkan" }).click();
  await expect(
    dialog.getByText("Kode belum cocok. Periksa keenam digit dan coba kembali."),
  ).toBeVisible();
  await expect(page.getByLabel("Digit 1 dari 6", { exact: true })).toBeFocused();
  await pasteCode(page, "882 016");
  await expect(page.getByLabel("Digit 6 dari 6", { exact: true })).toHaveValue("6");
  await dialog.getByRole("button", { name: "Verifikasi & lanjutkan" }).click();
  await expect(page).toHaveURL(/\/preview-ui\/account$/);
});

test("phone login normalizes a local number and validates a six digit PIN", async ({ page }) => {
  await page.goto("/preview-ui/auth/login");
  await page.getByRole("button", { name: "Nomor telepon", exact: true }).click();
  await page.getByLabel("Nomor telepon", { exact: true }).fill("0812 3456 7890");
  await page.getByLabel("PIN keamanan · 6 digit", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByText("PIN harus terdiri dari 6 angka.", { exact: true })).toBeVisible();
  await page.getByLabel("PIN keamanan · 6 digit", { exact: true }).fill("123456");
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Verifikasi akunmu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "WhatsApp", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await pasteCode(page, "882016");
  await page.getByRole("button", { name: "Verifikasi & lanjutkan" }).click();
  await expect(page).toHaveURL(/\/preview-ui\/account$/);
});

test("offline login preserves form values and offers a safe retry", async ({ page }) => {
  await page.goto("/preview-ui/auth/login");
  await page.getByLabel("Alamat email", { exact: true }).fill("risa@example.com");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Rahasia123");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByLabel("Kondisi adapter", { exact: true }).selectOption("offline");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByText(/Koneksi terputus. Isian tetap tersimpan/)).toBeVisible();
  await expect(page.getByLabel("Alamat email", { exact: true })).toHaveValue("risa@example.com");
  await expect(page.getByLabel("Kata sandi", { exact: true })).toHaveValue("Rahasia123");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByLabel("Kondisi adapter", { exact: true }).selectOption("ready");
  await page.getByText("Skenario uji", { exact: true }).click();
  await page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Verifikasi akunmu" })).toBeVisible();
});

test("recovery stays generic and resets only after verified code and matching secrets", async ({
  page,
}) => {
  await page.goto("/preview-ui/auth/recovery");
  await page.getByLabel("Alamat email", { exact: true }).fill("unknown@example.com");
  await page.getByRole("button", { name: "Lanjutkan pemulihan" }).click();
  const dialog = page.getByRole("dialog", { name: "Verifikasi akunmu" });
  await expect(dialog.getByText(/Respons ini tidak mengungkap status akun/)).toBeVisible();
  await expect(dialog.getByText("kanal pemulihan terdaftar", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Kata sandi baru", { exact: true })).toHaveCount(0);
  await pasteCode(page, "882016");
  await dialog.getByRole("button", { name: "Verifikasi & lanjutkan" }).click();
  await page.getByLabel("Kata sandi baru", { exact: true }).fill("Rahasia123");
  await page.getByLabel("Konfirmasi kata sandi", { exact: true }).fill("Berbeda123");
  await page.getByRole("button", { name: "Simpan kata sandi baru" }).click();
  await expect(page.getByText("Konfirmasi kata sandi belum cocok.", { exact: true })).toBeVisible();
  await page.getByLabel("Konfirmasi kata sandi", { exact: true }).fill("Rahasia123");
  await page.getByRole("button", { name: "Simpan kata sandi baru" }).click();
  await expect(
    page.getByText("Simulasi perubahan akses selesai. Akun produksi tidak berubah."),
  ).toBeVisible();
});

test("registration verifies then opens onboarding without losing accessibility labels", async ({
  page,
}) => {
  await page.goto("/preview-ui/auth/register");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Risa Pratiwi");
  await page.getByLabel("Alamat email", { exact: true }).fill("risa@example.com");
  await page.getByLabel("Kata sandi", { exact: true }).fill("Rahasia123");
  await page.getByRole("checkbox", { name: /Saya menyetujui/ }).check();
  await page.getByRole("button", { name: "Buat akun & mulai rencana" }).click();
  await expect(page.getByRole("dialog", { name: "Verifikasi akunmu" })).toBeVisible();
  await pasteCode(page, "882016");
  await page.getByRole("button", { name: "Verifikasi & lanjutkan" }).click();
  await expect(page).toHaveURL(/\/preview-ui\/onboarding\/profile$/);
});

test("mobile layout reflows during keyboard resize and returns focus after OTP dismissal", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await beginEmailLogin(page);
  await page.getByLabel("Digit 1 dari 6", { exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Tutup dialog", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Ubah email / nomor telepon" })).toBeFocused();
  await page.getByLabel("Digit 1 dari 6", { exact: true }).focus();
  await page.setViewportSize({ width: 375, height: 460 });
  await noOverflow(page);
  await pasteCode(page, "882016");
  await page.getByRole("button", { name: "Ubah email / nomor telepon" }).click();
  await expect(page.getByRole("dialog", { name: "Verifikasi akunmu" })).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Masuk ke ruang kita", exact: true }),
  ).toBeFocused();
  await expect(page.getByLabel("Alamat email", { exact: true })).toHaveValue("risa@example.com");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.screenshot({ path: "test-results/visual/auth-mobile375.png", fullPage: true });
  await noOverflow(page);
});

test("desktop auth preserves the source editorial crop and form proportions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/preview-ui/auth/login");
  await expect(
    page.getByRole("heading", { name: "Selamat datang kembali", exact: true }),
  ).toBeVisible();
  await expect(page.getByAltText("", { exact: true })).toBeVisible();
  await page.screenshot({ path: "test-results/visual/auth-desktop1440.png", fullPage: true });
  await noOverflow(page);
});
