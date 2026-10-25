import { test, expect } from "@playwright/test";
for (const path of [
  "/dashboard",
  "/planner/calendar",
  "/planner/rundown",
  "/planner/seserahan",
  "/planner/emergency",
  "/planner/catering",
  "/marketplace",
  "/marketplace/favorites",
  "/marketplace/bundles",
  "/checkout/services",
  "/checkin",
  "/login",
]) {
  test("real product route " + path, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("body")).not.toContainText(
      /PRATINJAU INTERNAL|Data contoh untuk meninjau|ORD-SIM-204|Budi Santoso & Partner|Andi Ramadhan|Coming Soon/,
    );
    await expect(page.getByText("Pratinjau fitur", { exact: true })).toHaveCount(0);
  });
}
test("sample guest URLs no longer expose fictional invitations", async ({ page }) => {
  await page.goto("/i/token-budi-a7c6");
  await expect(page.locator("body")).not.toContainText("Budi Santoso");
  await expect(page.getByRole("button", { name: "Simpan konfirmasi" })).toHaveCount(0);
});
