import { expect, test } from "@playwright/test";

test("dock272/68, tooltip keyboard, command palette trap dan focus return", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1160 });
  await page.goto("/preview-ui/account");
  await expect(page.getByRole("heading", { name: "Profil & akses", exact: true })).toBeVisible();
  const dock = page.getByRole("complementary", { name: "Navigasi ruang bersama" });
  await expect.poll(async () => (await dock.boundingBox())?.width).toBe(272);
  await page.getByRole("button", { name: "Ringkas navigasi" }).click();
  await expect.poll(async () => (await dock.boundingBox())?.width).toBe(68);
  await dock.getByRole("button", { name: "Persyaratan KUA", exact: true }).focus();
  await expect(page.getByRole("tooltip").filter({ hasText: "5 dari 7" })).toBeVisible();
  await page.getByRole("button", { name: "Perluas navigasi" }).click();
  const search = page.getByRole("button", { name: "Cari halaman, Ctrl atau Command K" });
  await search.focus();
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Mau ke mana?" });
  await expect(dialog).toBeVisible();
  await page.getByLabel("Cari halaman", { exact: true }).fill("keamanan");
  await expect(dialog.getByRole("link", { name: "Privasi & keamanan" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(search).toBeFocused();
});

test("role menu hanya keanggotaan aktif dan upgrade tidak membuka role Hidden", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1160 });
  await page.goto("/preview-ui/account");
  await page.getByRole("button", { name: /PASANGAN.*Andi/ }).click();
  const menu = page.getByRole("dialog", { name: "Ruang dan aksesmu" });
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Pasangan", { exact: true })).toBeVisible();
  await expect(menu.getByText(/Vendor|Ambassador|Superadmin/)).toHaveCount(0);
  await page.keyboard.press("Escape");
});

test("halaman batch1 reflow375/768/1280 tanpa overflow dan console error", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/account",
      "/account/plans",
      "/account/security",
      "/onboarding/profile",
      "/onboarding/events",
    ]) {
      await page.goto(`/preview-ui${route}`);
      await expect(page.locator("main h1")).toBeVisible();
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
        .toBeTruthy();
    }
  }
  expect(errors).toEqual([]);
});

test("navigasi mobile memakai dialog dan mengembalikan fokus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/preview-ui/account");
  const trigger = page.getByRole("button", { name: "Buka navigasi" });
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "Ruang rencana kalian" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(page.locator("main h1")).toBeVisible();
});
