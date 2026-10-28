import { expect, test } from "@playwright/test";
import { linkedSession } from "../helpers/linked-session";
for (const ownerSide of ["groom", "bride"] as const) {
  test(`couple names put bride first when owner is ${ownerSide}`, async ({
    page,
    context,
    browser,
    baseURL,
  }) => {
    const child = await linkedSession(context, browser, baseURL!, `order-${ownerSide}`, ownerSide);
    await page.goto("/dashboard");
    await expect(
      page.getByRole("banner").getByText("Latifah & Suep", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("heading").filter({ hasText: "Latifah & Suep" })).toBeVisible();
    await page.goto("/account");
    await expect(page.getByLabel("Nama panggilan", { exact: true })).toHaveValue(
      ownerSide === "bride" ? "Latifah" : "Suep",
    );
    await expect(page.getByLabel("Nama panggilan pasangan", { exact: true })).toBeEnabled();
    await child.close();
  });
}
test("account nicknames persist and both partners can manage their profiles", async ({
  page,
  context,
  browser,
  baseURL,
}) => {
  const child = await linkedSession(
    context,
    browser,
    baseURL!,
    "nickname-owner",
    "bride",
    "Risa",
    "Dimas",
  );
  await page.goto("/account");
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Risa Pratiwi");
  const saved = page.waitForResponse(
    (r) => r.url().endsWith("/api/workspace") && r.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "Simpan perubahan", exact: true }).click();
  expect((await saved).ok()).toBe(true);
  await page.reload();
  await expect(page.getByLabel("Nama lengkap", { exact: true })).toHaveValue("Risa Pratiwi");
  await expect(page.getByLabel("Nama panggilan pasangan", { exact: true })).toHaveValue("Dimas");
  await expect(page.getByLabel("Nama panggilan pasangan", { exact: true })).toBeEnabled();
  await expect(page.getByRole("banner").getByText("Risa & Dimas", { exact: true })).toBeVisible();
  await page.goto("/planner/finance");
  await page.getByRole("tab", { name: "Tabungan", exact: true }).click();
  const own = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Risa", exact: true }) });
  const partner = page
    .locator("article")
    .filter({ has: page.getByRole("heading", { name: "Dimas", exact: true }) });
  await expect(own.getByRole("button", { name: "Tambah", exact: true })).toBeVisible();
  await expect(partner.getByRole("button", { name: "Tambah", exact: true })).toHaveCount(0);
  expect((await partner.boundingBox())!.x).toBeLessThan((await own.boundingBox())!.x);
  expect(
    (
      await child.request.patch("/api/workspace", {
        headers: { Origin: baseURL! },
        data: { fullName: "Dimas Putra", nickname: "Dim" },
      })
    ).ok(),
  ).toBe(true);
  await page.reload();
  await page.getByRole("tab", { name: "Tabungan", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Dim", exact: true })).toBeVisible();
  const popup = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Simpan laporan PDF", exact: true }).click();
  const report = await popup;
  await expect(report.locator("th").first()).toContainText("Dim");
  await expect(report.locator("th").last()).toContainText("Risa");
  await report.close();
  await page.setViewportSize({ width: 375, height: 950 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await child.close();
});
