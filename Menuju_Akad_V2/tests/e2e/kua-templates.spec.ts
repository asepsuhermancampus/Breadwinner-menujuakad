import { expect, test } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
import { documentOptions } from "../../src/features/kua-documents/domain/document-template";

for (const width of [375, 1600]) {
  test(`KUA starts empty, selects manually and applies two templates at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await context.addInitScript(() => {
      window.print = () => {};
    });
    await page.goto("/planner/kua");
    const nav = page.getByRole("navigation", { name: "Tampilan berkas KUA", exact: true });
    await expect(nav.getByRole("button", { name: "Checklist saya", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(
      page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("region", { name: "Berkas wajib", exact: true })).toHaveCount(0);
    const start = page.getByRole("button", { name: "Mulai berkas utama", exact: true });
    const exportButton = page.getByRole("button", { name: "Export berkas", exact: true });
    await expect(exportButton).toBeDisabled();
    if (width > 1000) {
      const tabsBox = await nav.boundingBox(),
        actionBox = await start.boundingBox();
      expect(Math.abs(tabsBox!.y - actionBox!.y)).toBeLessThan(5);
      expect(actionBox!.x).toBeGreaterThan(tabsBox!.x + tabsBox!.width);
    }
    await start.click();
    const chooser = page.getByRole("dialog", {
      name: "Pilih berkas yang ingin disiapkan",
      exact: true,
    });
    await chooser.getByRole("checkbox").nth(0).check();
    await chooser.getByRole("checkbox").nth(2).check();
    await chooser.getByRole("button", { name: "Tambahkan", exact: true }).click();
    await expect(chooser).toBeHidden();
    const main = page.getByRole("region", { name: "Berkas wajib", exact: true });
    const optional = page.getByRole("region", { name: "Berkas opsional", exact: true });
    await expect(main.getByRole("checkbox")).toHaveCount(2);
    await expect(main.getByRole("button", { name: /^Edit / })).toHaveCount(0);
    await main.getByRole("checkbox").first().click();
    await expect(main.getByRole("checkbox").first()).toBeChecked();
    await page.reload();
    await expect(main.getByRole("checkbox").first()).toBeChecked();
    await nav.getByRole("button", { name: "Pilih template", exact: true }).click();
    const templates = page.getByRole("region", { name: "Template berkas", exact: true });
    await expect(templates.getByRole("article")).toHaveCount(2);
    if (width > 1000) {
      const left = await templates.getByRole("article").first().boundingBox(),
        right = await templates.getByRole("article").last().boundingBox();
      expect(left!.y).toBe(right!.y);
      expect(right!.x).toBeGreaterThan(left!.x);
    }
    await templates
      .getByRole("article")
      .first()
      .getByRole("button", { name: "Gunakan template", exact: true })
      .click();
    await expect(main.getByRole("checkbox")).toHaveCount(11);
    await expect(main.getByRole("checkbox").first()).toBeChecked();
    await nav.getByRole("button", { name: "Pilih template", exact: true }).click();
    await templates
      .getByRole("article")
      .last()
      .getByRole("button", { name: "Gunakan template", exact: true })
      .click();
    await expect(optional.getByRole("checkbox")).toHaveCount(
      documentOptions().filter((item) => item.group === "additional").length,
    );
    await optional
      .getByRole("button", { name: /^Edit / })
      .first()
      .click();
    const edit = page.getByRole("dialog", { name: "Edit berkas tambahan", exact: true });
    await edit
      .getByRole("textbox", { name: "Nama dokumen", exact: true })
      .fill("Berkas sesuai kebutuhan keluarga");
    await edit.getByRole("button", { name: "Simpan dokumen", exact: true }).click();
    await expect(edit).toBeHidden();
    await page.reload();
    await expect(optional).toContainText("Berkas sesuai kebutuhan keluarga");
    await exportButton.click();
    const exportDialog = page.getByRole("dialog", { name: "Export checklist KUA", exact: true });
    const downloadEvent = page.waitForEvent("download");
    await exportDialog.getByRole("button", { name: "Unduh CSV", exact: true }).click();
    expect((await downloadEvent).suggestedFilename()).toBe("checklist-persyaratan-kua.csv");
    const popupEvent = page.waitForEvent("popup");
    await exportDialog.getByRole("button", { name: "Simpan PDF", exact: true }).click();
    const report = await popupEvent;
    await expect(
      report.getByRole("heading", { name: "Checklist persyaratan KUA", exact: true }),
    ).toBeVisible();
    await expect(
      report.getByRole("cell").filter({ hasText: "Berkas sesuai kebutuhan keluarga" }),
    ).toBeVisible();
    await report.close();
    await exportDialog.getByRole("button", { name: "Tutup dialog", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (process.env["E2E_UI_SNAPSHOTS"])
      await page.screenshot({ path: `.review-tmp/kua-new-${width}.png` });
  });
}

test("account starts empty and rejects changing or removing mandatory documents", async ({
  page,
  context,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "kua-new-flow");
  await page.goto("/planner/kua");
  await expect(
    page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Tampilan berkas KUA", exact: true })
    .getByRole("button", { name: "Pilih template", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Template berkas", exact: true })
    .getByRole("article")
    .first()
    .getByRole("button", { name: "Gunakan template", exact: true })
    .click();
  const main = page.getByRole("region", { name: "Berkas wajib", exact: true });
  await expect(main.getByRole("checkbox")).toHaveCount(11);
  const endpoint = "/api/workspace/resources/documents";
  const current = await (await context.request.get(endpoint)).json();
  expect(current.data).toHaveLength(11);
  for (const data of [
    current.data.slice(1),
    current.data.map((row: object) => ({ ...row, title: "Tidak boleh diubah" })),
  ]) {
    const rejected = await context.request.put(endpoint, {
      headers: { origin: baseURL! },
      data: { revision: current.revision, data },
    });
    expect(rejected.status()).toBe(400);
  }
  await main.getByRole("checkbox").first().click();
  await expect(main.getByRole("checkbox").first()).toBeChecked();
  await page.reload();
  await expect(main.getByRole("checkbox").first()).toBeChecked();
});
