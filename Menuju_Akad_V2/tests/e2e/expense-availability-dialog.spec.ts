import { expect, test } from "@playwright/test";

test("a linked budget description is hidden while its source is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "menuju-akad:guest-trial:v2",
      JSON.stringify({
        version: 2,
        revision: 1,
        used: { seserahan: 1 },
        resources: {
          seserahan: [{ id: "gift", title: "Hadiah pribadi", quantity: 1, unitCost: 100 }],
        },
      }),
    );
  });
  let available = true;
  await page.route("**/api/workspace/feature-availability", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, json: { ...(await response.json()), seserahan: available } });
  });
  await page.goto("/planner/finance");
  await page.getByRole("tab", { name: "Anggaran", exact: true }).click();
  await page.getByRole("button", { name: "Lihat deskripsi Hadiah pribadi" }).click();
  const dialog = page.getByRole("dialog", { name: "Deskripsi kebutuhan", includeHidden: true });
  await expect(dialog).toContainText("Hadiah pribadi");
  available = false;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Lihat deskripsi Hadiah pribadi" })).toHaveCount(0);
  available = true;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Hadiah pribadi");
  await dialog.getByRole("button", { name: "Tutup dialog" }).click();
  await page.getByRole("button", { name: "Edit Hadiah pribadi" }).click();
  const editor = page.getByRole("dialog", { name: "Edit anggaran", includeHidden: true });
  await editor.getByLabel("Tujuan anggaran").fill("Draf yang dijaga");
  available = false;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(editor).toBeHidden();
  available = true;
  await page.evaluate(() => window.dispatchEvent(new Event("feature-availability-changed")));
  await expect(editor).toBeVisible();
  await expect(editor.getByLabel("Tujuan anggaran")).toHaveValue("Draf yang dijaga");
});
