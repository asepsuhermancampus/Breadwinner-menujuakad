import { test } from "@playwright/test";
import { assertPageStylesAndAssets } from "../helpers/style-assets";

const ROUTES = ["/login", "/dashboard", "/planner/finance", "/marketplace"] as const;

const VIEWPORTS = [
  { name: "desktop 1440px", width: 1440, height: 900 },
  { name: "tablet 768px", width: 768, height: 1024 },
  { name: "mobile 375px", width: 375, height: 667 },
] as const;

for (const viewport of VIEWPORTS) {
  test(`core routes render styles without asset failure on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    for (const route of ROUTES) {
      await assertPageStylesAndAssets(page, route);
    }
  });
}
