import { expect, test } from "@playwright/test";

for (const width of [375, 1440]) {
  for (const step of ["profile", "events", "partner"] as const) {
    test(`${step} reflows at ${width}px and produces a review screenshot`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: width === 375 ? 812 : 1000 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`/onboarding/${step}`);
      if (step === "partner") {
        await page.getByRole("button", { name: "Buat tautan undangan", exact: true }).click();
        await expect(
          page.getByAltText("QR tautan simulasi pasangan pada perangkat ini"),
        ).toBeVisible();
      } else {
        await expect(
          page.locator(step === "profile" ? "#groom-name" : "#wedding-date"),
        ).toBeEnabled();
      }
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true);
      await page.screenshot({
        path: info.outputPath(`onboarding-${step}-${width}.png`),
        fullPage: true,
      });
      expect(errors).toEqual([]);
    });
  }
}
