import { expect, test } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date());
    const later = new Date(`${today}T00:00:00Z`);
    later.setUTCDate(later.getUTCDate() + 3);
    localStorage.setItem(
      "menuju-akad:guest-trial:v2",
      JSON.stringify({
        version: 2,
        revision: 0,
        used: {},
        resources: {
          finance: [
            {
              id: "a",
              title: "Katering kecil",
              amount: 499999,
              category: "Katering",
              purpose: "DP",
              priority: "Tinggi",
              notes: "Tanpa pedas",
              dueDate: today,
            },
            {
              id: "b",
              title: "Dekorasi sedang",
              amount: 500000,
              category: "Dekorasi",
              purpose: "DP gedung",
              priority: "Normal",
              dueDate: later.toISOString().slice(0, 10),
            },
            {
              id: "c",
              title: "Busana besar",
              amount: 1500000,
              category: "Busana",
              priority: "Rendah",
            },
          ],
        },
      }),
    );
  });
  await page.goto("/planner/finance?tab=Anggaran");
  await expect(page.getByRole("rowheader", { name: "Katering kecil", exact: true })).toBeVisible();
});
test("column filters contain rounded choices without text or date inputs", async ({ page }) => {
  for (const label of ["Target (Rp)", "Kategori", "Tujuan", "Detail", "Prioritas", "Tenggat"]) {
    await page.getByRole("button", { name: `Filter ${label}`, exact: true }).click();
    const panel = page.getByRole("dialog", { name: `Filter ${label}`, exact: true });
    await expect(panel.locator("input, select, textarea")).toHaveCount(0);
    const selected = panel.getByRole("radio", { checked: true });
    await expect(selected).toBeFocused();
    await expect(selected).toHaveCSS("outline-style", "none");
    await expect(selected).toHaveCSS("border-radius", "10px");
    await panel.getByRole("button", { name: "Tutup pengaturan kolom", exact: true }).click();
  }
});
test("quick choices filter rows, compose, reset, and support colored keyboard priority selection", async ({
  page,
}) => {
  const row = (name: string) => page.getByRole("rowheader", { name, exact: true });
  async function select(label: string, value: string) {
    await page.getByRole("button", { name: `Filter ${label}`, exact: true }).click();
    const panel = page.getByRole("dialog", { name: `Filter ${label}`, exact: true });
    await panel.getByRole("radio", { name: value, exact: true }).click();
    return panel;
  }
  let panel = await select("Target (Rp)", "Di Bawah Rp500 Ribu");
  await expect(row("Katering kecil")).toBeVisible();
  await expect(row("Dekorasi sedang")).toHaveCount(0);
  await panel.getByRole("button", { name: "Reset filter", exact: true }).click();
  panel = await select("Tujuan", "DP");
  await expect(row("Katering kecil")).toBeVisible();
  await expect(row("Dekorasi sedang")).toHaveCount(0);
  await panel.getByRole("button", { name: "Reset filter", exact: true }).click();
  panel = await select("Tujuan", "Tanpa Tujuan");
  await expect(row("Busana besar")).toBeVisible();
  await expect(row("Katering kecil")).toHaveCount(0);
  await panel.getByRole("button", { name: "Reset filter", exact: true }).click();
  panel = await select("Detail", "Ada Catatan");
  await expect(row("Katering kecil")).toBeVisible();
  await expect(row("Busana besar")).toHaveCount(0);
  await panel.getByRole("button", { name: "Tutup pengaturan kolom", exact: true }).click();
  panel = await select("Tenggat", "Hari Ini");
  await expect(row("Katering kecil")).toBeVisible();
  await panel.getByRole("radio", { name: "7 Hari ke Depan", exact: true }).click();
  await expect(page.getByRole("rowheader")).toHaveCount(0);
  await panel.getByRole("button", { name: "Tutup pengaturan kolom", exact: true }).click();
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  panel = await select("Tenggat", "7 Hari ke Depan");
  await expect(row("Dekorasi sedang")).toBeVisible();
  await expect(row("Katering kecil")).toHaveCount(0);
  await panel.getByRole("button", { name: "Reset filter", exact: true }).click();
  await page.getByRole("button", { name: "Filter Prioritas", exact: true }).click();
  panel = page.getByRole("dialog", { name: "Filter Prioritas", exact: true });
  const colors = await panel
    .locator("[data-tone]")
    .evaluateAll((elements) => elements.map((el) => getComputedStyle(el).backgroundColor));
  expect(new Set(colors).size).toBe(3);
  await panel.getByRole("radio", { name: "Semua Prioritas", exact: true }).press("ArrowDown");
  await expect(panel.getByRole("radio", { name: "Tinggi", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(row("Katering kecil")).toBeVisible();
  await expect(row("Dekorasi sedang")).toHaveCount(0);
  await page.screenshot({ path: ".review-tmp/budget-priority-quick-desktop.png" });
  await page.setViewportSize({ width: 375, height: 900 });
  await expect(panel).toBeInViewport();
  await page.screenshot({ path: ".review-tmp/budget-priority-quick-mobile.png" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
