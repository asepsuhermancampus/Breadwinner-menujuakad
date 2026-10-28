import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 1600, height: 720 },
  { width: 2560, height: 900 },
  { width: 375, height: 812 },
  { width: 1280, height: 400 },
]) {
  test(`header stays visible while dashboard content scrolls at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/dashboard");
    const shell = page.getByTestId("customer-shell");
    const header = shell.locator("[data-app-canvas] > header");
    const content = shell.locator("main#main-content");
    await expect(content).toBeVisible();
    await expect.poll(() => content.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
    const before = await header.boundingBox();
    const body = (await content.boundingBox())!;
    await page.mouse.move(body.x + body.width / 2, body.y + Math.min(100, body.height / 2));
    await page.mouse.wheel(0, 600);
    await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    await expect.poll(async () => (await header.boundingBox())?.y).toBe(before?.y);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(
      header.getByRole("button", { name: "Cari halaman, Ctrl atau Command K" }),
    ).toBeVisible();
    await header.getByRole("button", { name: "Cari halaman, Ctrl atau Command K" }).click();
    await expect(page.getByRole("dialog", { name: "Mau ke mana?" })).toBeVisible();
    await page.keyboard.press("Escape");
    await content.focus();
    await page.keyboard.press("Control+Home");
    await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBe(0);
    await page.keyboard.press("PageDown");
    await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test("navigating from scrolled content opens the next page at the top", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 720 });
  await page.goto("/dashboard");
  const content = page.getByTestId("customer-shell").locator("main#main-content");
  await content.evaluate((el) => {
    el.scrollTop = 500;
  });
  await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await page
    .getByRole("navigation", { name: "Navigasi dashboard" })
    .getByRole("link", { name: "Checklist & Tugas", exact: true })
    .click();
  await expect(page).toHaveURL(/\/planner\/tasks$/);
  await expect.poll(() => content.evaluate((el) => el.scrollTop)).toBe(0);
});
