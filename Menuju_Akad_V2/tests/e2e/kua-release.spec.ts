import { expect, test } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
import { documentOptions } from "../../src/features/kua-documents/domain/document-template";
const custom = { id: "own-document", title: "Dokumen khusus keluarga", group: "additional" };
for (const mode of ["guest", "account"] as const) {
  test(`${mode} card menus reset their own checks and release their own templates`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (mode === "guest") {
      await page.setViewportSize({ width: 375, height: 950 });
      await context.addInitScript((document) => {
        const key = "menuju-akad:guest-trial:v2";
        if (!localStorage.getItem(key))
          localStorage.setItem(
            key,
            JSON.stringify({
              version: 2,
              revision: 0,
              used: {},
              resources: { documents: [document] },
            }),
          );
      }, custom);
    } else {
      await customerSession(context, baseURL!, "kua-card-actions");
      const seed = await context.request.put("/api/workspace/resources/documents", {
        headers: { Origin: baseURL! },
        data: { revision: 0, data: [custom] },
      });
      expect(seed.ok()).toBe(true);
    }
    await page.goto("/planner/kua");
    const nav = page.getByRole("navigation", { name: "Tampilan berkas KUA", exact: true });
    const main = page.getByRole("region", { name: "Berkas wajib", exact: true });
    const optional = page.getByRole("region", { name: "Berkas opsional", exact: true });
    async function apply(index: number) {
      await nav.getByRole("button", { name: "Pilih template", exact: true }).click();
      await page
        .getByRole("region", { name: "Template berkas", exact: true })
        .getByRole("article")
        .nth(index)
        .getByRole("button", { name: "Gunakan template", exact: true })
        .click();
    }
    async function action(
      group: "wajib" | "opsional",
      label: "Reset centang" | "Lepaskan template",
    ) {
      await page.getByRole("button", { name: `Aksi berkas ${group}`, exact: true }).click();
      await page
        .getByRole("menu", { name: `Aksi berkas ${group}`, exact: true })
        .getByRole("menuitem", { name: label, exact: true })
        .click();
      return page.getByRole("dialog", { name: `${label} berkas ${group}?`, exact: true });
    }
    async function release(group: "wajib" | "opsional") {
      const dialog = await action(group, "Lepaskan template");
      await dialog.getByRole("button", { name: "Ya, lepaskan template", exact: true }).click();
      await expect(dialog).toBeHidden();
    }
    await apply(0);
    await apply(1);
    const additionalCount = documentOptions().filter((item) => item.group === "additional").length;
    await expect(main.getByRole("checkbox")).toHaveCount(11);
    await expect(optional.getByRole("checkbox")).toHaveCount(additionalCount + 1);
    await expect(
      page.getByRole("button", { name: "Kosongkan checklist", exact: true }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Reset centang", exact: true })).toHaveCount(0);
    const count = await main.locator('[aria-label="Progres berkas wajib"]').boundingBox();
    const dots = await main
      .getByRole("button", { name: "Aksi berkas wajib", exact: true })
      .boundingBox();
    expect(dots!.x).toBeGreaterThan(count!.x + count!.width);
    expect(Math.abs(dots!.y + dots!.height / 2 - count!.y - count!.height / 2)).toBeLessThan(2);
    await main.getByRole("checkbox").first().click();
    await expect(main.getByRole("checkbox").first()).toBeChecked();
    await optional.getByRole("checkbox").first().click();
    await expect(optional.getByRole("checkbox").first()).toBeChecked();
    const trigger = main.getByRole("button", { name: "Aksi berkas wajib", exact: true });
    await trigger.focus();
    await page.keyboard.press("ArrowDown");
    const menu = page.getByRole("menu", { name: "Aksi berkas wajib", exact: true });
    await expect(menu.getByRole("menuitem", { name: "Reset centang", exact: true })).toBeFocused();
    const bounds = await menu.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
    await page.keyboard.press("ArrowDown");
    await expect(
      menu.getByRole("menuitem", { name: "Lepaskan template", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    const resetMain = await action("wajib", "Reset centang");
    await resetMain.getByRole("button", { name: "Ya, reset centang", exact: true }).click();
    await expect(resetMain).toBeHidden();
    await expect(main.getByRole("checkbox").first()).not.toBeChecked();
    await expect(optional.getByRole("checkbox").first()).toBeChecked();
    await page.reload();
    await expect(main.getByRole("checkbox").first()).not.toBeChecked();
    await expect(optional.getByRole("checkbox").first()).toBeChecked();
    const resetOptional = await action("opsional", "Reset centang");
    await resetOptional.getByRole("button", { name: "Ya, reset centang", exact: true }).click();
    await expect(resetOptional).toBeHidden();
    await expect(optional.getByRole("checkbox").first()).not.toBeChecked();
    const cancel = await action("wajib", "Lepaskan template");
    await cancel.getByRole("button", { name: "Batal", exact: true }).click();
    await expect(main.getByRole("checkbox")).toHaveCount(11);
    if (mode === "account") {
      await page.route("**/api/workspace/resources/documents?*", (route) =>
        route.request().method() === "PUT"
          ? route.fulfill({ status: 500, json: { error: "Gagal menyimpan uji" } })
          : route.continue(),
      );
      const failed = await action("wajib", "Lepaskan template");
      await failed.getByRole("button", { name: "Ya, lepaskan template", exact: true }).click();
      await expect(failed.getByRole("alert")).toBeVisible();
      await failed.getByRole("button", { name: "Batal", exact: true }).click();
      await expect(main.getByRole("checkbox")).toHaveCount(11);
      await page.unrouteAll();
    }
    await release("wajib");
    await expect(main.getByRole("checkbox")).toHaveCount(0);
    await expect(optional.getByRole("checkbox")).toHaveCount(additionalCount + 1);
    await page.reload();
    await expect(main.getByRole("checkbox")).toHaveCount(0);
    await apply(0);
    await release("opsional");
    await expect(optional.getByRole("checkbox")).toHaveCount(1);
    await expect(optional).toContainText(custom.title);
    await apply(1);
    await release("wajib");
    await release("opsional");
    await optional.getByRole("button", { name: `Hapus ${custom.title}`, exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
    ).toBeVisible();
    await apply(0);
    await expect(main.getByRole("checkbox")).toHaveCount(11);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (process.env["E2E_UI_SNAPSHOTS"]) {
      await main.getByRole("button", { name: "Aksi berkas wajib", exact: true }).click();
      await page.screenshot({ path: `.review-tmp/kua-card-actions-${mode}.png` });
    }
  });
}

test("archived optional template can still be released from its card menu", async ({
  page,
  context,
}) => {
  await context.addInitScript(
    (documents) => {
      const key = "menuju-akad:guest-trial:v2";
      if (!localStorage.getItem(key))
        localStorage.setItem(
          key,
          JSON.stringify({ version: 2, revision: 0, used: {}, resources: { documents } }),
        );
    },
    documentOptions()
      .filter((item) => item.group === "additional")
      .map((item) => ({ ...item, archived: true })),
  );
  await page.goto("/planner/kua");
  await page.getByRole("button", { name: "Aksi berkas opsional", exact: true }).click();
  await page.getByRole("menuitem", { name: "Lepaskan template", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Lepaskan template berkas opsional?",
    exact: true,
  });
  await dialog.getByRole("button", { name: "Ya, lepaskan template", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Belum ada berkas di checklist kalian", exact: true }),
  ).toBeVisible();
});
