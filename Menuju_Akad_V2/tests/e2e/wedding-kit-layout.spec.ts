import { expect, test } from "@playwright/test";
import { customerSession, seedCustomerPayment } from "../helpers/customer-session";

for (const mode of ["trial", "premium"] as const) {
  for (const width of [1440, 375]) {
    test(`Wedding Kit panels are aligned and ornamented for ${mode} at ${width}px`, async ({
      page,
      context,
      baseURL,
    }) => {
      if (mode === "premium") {
        const owner = await customerSession(context, baseURL!, `kit-layout-${width}`);
        seedCustomerPayment(owner, "premium", true);
      }
      await page.setViewportSize({ width, height: 1100 });
      await page.goto("/planner/wedding-kit");
      if (mode === "premium")
        await page.getByRole("button", { name: "Nanti saja", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "Wedding Kit", exact: true, level: 1 }),
      ).toHaveCount(1);
      const feature = page.locator("#feature-pdf");
      await expect(feature.locator("[data-card-ornament]")).toHaveCount(2);
      await expect(page.getByText(/DOKUMEN RENCANA/)).toHaveCount(0);
      const preview = page.getByRole("complementary", {
        name: "Pratinjau Wedding Kit",
        exact: true,
      });
      await expect(preview).toBeVisible();
      const content = feature.locator("section").first();
      const left = await content.boundingBox(),
        right = await preview.boundingBox();
      if (width > 1024) {
        expect(left!.y).toBe(right!.y);
        expect(Math.abs(left!.height - right!.height)).toBeLessThan(1);
      } else expect(right!.y).toBeGreaterThan(left!.y);
      expect(
        await page.evaluate(() => window.document.documentElement.scrollWidth <= innerWidth),
      ).toBe(true);
      await page.screenshot({
        path: `.review-tmp/wedding-kit-${mode}-${width}.png`,
        fullPage: true,
      });
      const popup = page.waitForEvent("popup");
      await page
        .getByRole("button", { name: "Buka dokumen cetak", exact: true })
        .or(page.getByRole("link", { name: "Buka dokumen cetak", exact: true }))
        .click();
      const document = await popup;
      await expect(
        document.getByRole("heading", { name: "Rencana kalian", exact: true }),
      ).toBeVisible();
      await expect(document.locator("body")).toContainText("Anggaran");
      await document.close();
    });
  }
}
