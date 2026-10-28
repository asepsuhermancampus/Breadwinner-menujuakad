import { expect, test } from "@playwright/test";

test("sidebar matches the current Pencil dock without losing secondary destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1600, height: 1160 });
  await page.goto("/dashboard");
  const dock = page.getByRole("complementary", { name: "Navigasi ruang bersama" });
  const navigation = dock.getByRole("navigation", { name: "Navigasi dashboard" });
  await expect(navigation.locator(":scope > section > h2")).toHaveText([
    "Perencanaan",
    "Keuangan & vendor",
    "Tamu & undangan",
  ]);
  expect(
    await navigation
      .locator("a[data-sidebar-link]")
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label"))),
  ).toEqual([
    "Ringkasan & Kesiapan",
    "Checklist & Tugas",
    "Persyaratan KUA",
    "Rundown & Kepanitiaan",
    "Kalkulator Katering",
    "Seserahan & Moodboard",
    "Tabungan & Anggaran",
    "Catatan Vendor Manual",
    "Pesanan & Kontrak",
    "CRM Tamu & WhatsApp",
    "Studio Undangan",
    "Wedding Kit",
  ]);
  const active = navigation.getByRole("link", { name: "Ringkasan & Kesiapan", exact: true });
  await expect(active).toHaveCSS("height", "38px");
  await expect(active).toHaveCSS("font-size", "14px");
  await expect(active).toHaveCSS("background-color", "rgb(241, 245, 243)");
  await expect(dock.getByText("PASANGAN", { exact: true })).toHaveCount(0);
  await expect(dock.getByText("Ruang rencana bersama", { exact: true })).toHaveCount(0);
  await expect(dock.getByRole("link", { name: "Pengaturan", exact: true })).toBeVisible();
  await expect(dock.getByRole("button", { name: /^Pilihan / })).toHaveCount(0);
  await navigation.getByRole("link", { name: "Seserahan & Moodboard", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Bagian Seserahan & Moodboard" })
    .getByRole("link", { name: "Moodboard", exact: true })
    .click();
  await expect(page).toHaveURL(/\/planner\/moodboard$/);
  await expect(
    navigation.getByRole("link", { name: "Seserahan & Moodboard", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(dock.getByRole("button", { name: "Buka menu akun" })).toHaveCount(0);
  await dock.getByRole("link", { name: "Pengaturan", exact: true }).click();
  await page.waitForURL("**/account");
  await expect(
    page.getByRole("navigation", { name: "Pengaturan akun" }).getByRole("link"),
  ).toHaveCount(5);
  await dock.getByRole("button", { name: "Ringkas navigasi" }).click();
  await expect.poll(async () => (await dock.boundingBox())?.width).toBe(68);
  await expect(
    navigation.getByRole("link", { name: "Persyaratan KUA", exact: true }),
  ).toBeVisible();
  await dock.getByRole("button", { name: "Perluas navigasi" }).click();
  await expect.poll(async () => (await dock.boundingBox())?.width).toBe(272);
  await dock.getByRole("button", { name: "Ringkas navigasi" }).click();
  await expect.poll(async () => (await dock.boundingBox())?.width).toBe(68);
  await navigation.getByRole("link", { name: "Seserahan & Moodboard", exact: true }).click();
  await expect(page).toHaveURL(/\/planner\/seserahan$/);
});

test("mobile sidebar keeps contextual links and account actions reachable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Buka navigasi", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Ruang rencana kalian" });
  await expect(drawer.getByRole("link", { name: "Pengaturan", exact: true })).toBeVisible();
  await drawer.getByRole("link", { name: "Rundown & Kepanitiaan", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Bagian Rundown & Kepanitiaan" })
    .getByRole("link", { name: "Kalender Koordinasi" })
    .click();
  await expect(page).toHaveURL(/\/planner\/calendar$/);
  await expect(page.getByRole("dialog", { name: "Ruang rencana kalian" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
