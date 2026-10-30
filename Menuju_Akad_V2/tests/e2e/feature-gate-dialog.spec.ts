import { expect, test } from "@playwright/test";

test("a feature restriction closes an open modal without discarding its draft", async ({
  page,
}) => {
  let available = true;
  await page.route("**/api/workspace/feature-availability", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, json: { ...(await response.json()), tasks: available } });
  });
  await page.goto("/planner/tasks");
  await page.getByRole("button", { name: "Tambah tugas", exact: true }).click();
  const dialog = page.locator("dialog").filter({ has: page.getByLabel("Nama tugas") });
  await page.getByLabel("Nama tugas").fill("Draf tetap ada");
  await expect(dialog).toHaveAttribute("open", "");
  available = false;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(page.getByRole("heading", { name: "Tugas belum tersedia" })).toBeVisible();
  await expect(dialog).not.toHaveAttribute("open", "");
  const dashboardLink = page.locator('a[href="/dashboard"]').first();
  await dashboardLink.focus();
  await expect(dashboardLink).toBeFocused();
  available = true;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(page.getByLabel("Nama tugas")).toHaveValue("Draf tetap ada");
  await expect(dialog).toHaveAttribute("open", "");
});
