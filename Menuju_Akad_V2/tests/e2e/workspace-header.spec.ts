import { expect, test } from "@playwright/test";

for (const width of [375, 768, 1600]) {
  test(`header keeps only aligned search and plan controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dashboard");
    const header = page.getByTestId("customer-shell").locator("[data-app-canvas] > header");
    await expect(header.getByRole("button", { name: "Mode Lamaran", exact: true })).toHaveCount(0);
    await expect(header.getByRole("button", { name: "Akad & Resepsi", exact: true })).toHaveCount(
      0,
    );
    await expect(header.getByRole("link", { name: "Kalender acara", exact: true })).toHaveCount(0);
    const search = header.getByRole("button", { name: "Cari halaman, Ctrl atau Command K" });
    const plan = header.getByRole("link", { name: "Free", exact: true });
    await expect(search).toBeVisible();
    await expect(plan).toBeVisible();
    const searchBox = (await search.boundingBox())!;
    const planBox = (await plan.boundingBox())!;
    expect(searchBox.height).toBe(36);
    expect(planBox.height).toBe(searchBox.height);
    expect(planBox.y).toBe(searchBox.y);
    expect(planBox.x - (searchBox.x + searchBox.width)).toBe(8);
    await expect(header).toHaveCSS("height", "76px");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await search.click();
    const dialog = page.getByRole("dialog", { name: "Mau ke mana?" });
    await expect(dialog).toBeVisible();
    await page.getByLabel("Cari halaman", { exact: true }).fill("Kalender");
    await expect(
      dialog.getByRole("link", { name: "Kalender koordinasi", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await plan.click();
    await page.waitForURL("**/account/plans");
  });
}
