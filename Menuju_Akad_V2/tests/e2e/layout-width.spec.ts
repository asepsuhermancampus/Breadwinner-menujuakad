import { expect, test } from "@playwright/test";

for (const route of [
  "/dashboard",
  "/planner/tasks",
  "/planner/finance",
  "/planner/guests",
  "/planner/invitations",
  "/account",
  "/marketplace",
  "/planner/invitations/studio",
]) {
  test(`${route} fills the viewport when zooming out`, async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.goto(route);
    if (route.endsWith("/studio"))
      await expect(
        page.getByRole("navigation", { name: "Fitur undangan", exact: true }),
      ).toBeVisible();
    const frame = route.endsWith("/studio")
      ? page.locator("main#main-content:visible").last()
      : page.getByTestId("customer-shell");
    await expect(frame).toBeVisible();
    if (!route.endsWith("/studio")) {
      await expect(frame).toHaveCSS("padding", "0px");
      const canvas = frame.locator("[data-app-canvas]");
      await expect(canvas).toHaveCSS("border-radius", "0px");
      await expect(canvas).toHaveCSS("border-top-width", "0px");
    }
    for (const width of [1600, 2000, 2400, 3200]) {
      await page.setViewportSize({ width, height: 1000 });
      await expect
        .poll(async () => {
          const box = await frame.boundingBox();
          return { width: box?.width, left: box?.x };
        })
        .toEqual({ width, left: 0 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (!route.endsWith("/studio")) {
        const dock = frame.getByRole("complementary", { name: "Navigasi ruang bersama" });
        await expect.poll(async () => (await dock.boundingBox())?.width).toBe(272);
        await expect(dock).toHaveCSS("border-radius", "0px");
        const dockBox = await dock.boundingBox();
        expect(dockBox?.y).toBe(0);
        expect(dockBox?.height).toBe(1000);
      }
    }
  });
}

test("full-width frames fit narrow screens without horizontal scrolling", async ({ page }) => {
  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/dashboard", "/planner/finance", "/planner/invitations/studio"]) {
      await page.goto(route);
      const frame = route.endsWith("/studio")
        ? page.locator("main#main-content")
        : page.getByTestId("customer-shell");
      await expect.poll(async () => (await frame.boundingBox())?.width).toBe(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
});
