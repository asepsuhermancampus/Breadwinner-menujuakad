import { test, expect } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
const key = "menuju-akad:guest-trial:v2";
const guests = ["Keluarga", "Teman"].map((name, index) => ({
  id: `guest-${index}`,
  name,
  group: "Teman",
  quota: 100,
  attendingCount: 0,
  rsvpStatus: "PENDING",
  waConsent: false,
  personalToken: `guest-token-${index}`,
}));
const legacy = { id: "legacy", title: "Menu lama", portions: 2, unitCost: 25000 };
for (const mode of ["guest", "account"] as const) {
  test(`${mode} catering catalog and vendor package retain totals and guest estimates`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (mode === "guest") {
      await context.addInitScript(
        ({ key, guests, legacy }) => {
          if (!localStorage.getItem(key))
            localStorage.setItem(
              key,
              JSON.stringify({
                version: 2,
                revision: 0,
                used: {},
                resources: { guests, catering: [legacy] },
              }),
            );
        },
        { key, guests, legacy },
      );
    } else {
      await customerSession(context, baseURL!, "catering-options");
      const workspace = (await (await context.request.get(`${baseURL}/api/workspace`)).json())
        .workspace;
      for (const [kind, data] of [
        ["guests", guests],
        ["catering", [legacy]],
      ] as const) {
        const response = await context.request.put(
          `${baseURL}/api/workspace/resources/${kind}?workspace=${workspace.id}`,
          { headers: { Origin: baseURL! }, data: { revision: 0, data } },
        );
        expect(response.ok(), await response.text()).toBe(true);
      }
    }
    await page.goto("/planner/catering");
    await expect(page.getByText("220", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("checkbox", { name: "Gunakan daftar tamu otomatis" }),
    ).toBeChecked();
    const add = page.getByRole("button", { name: "+ Menu katering", exact: true });
    await add.click();
    const dialog = page.getByRole("dialog", { name: "Tambah menu katering", exact: true });
    await dialog.getByRole("button", { name: "+ Nasi putih", exact: true }).click();
    await expect(dialog.getByRole("button", { name: "✓ Nasi putih", exact: true })).toBeDisabled();
    await dialog
      .getByRole("combobox", { name: "Kategori menu", exact: true })
      .selectOption("dessert");
    await dialog.getByRole("button", { name: "+ Es krim", exact: true }).click();
    for (const [index, price] of ["10000", "5000"].entries()) {
      const row = dialog.getByRole("region", { name: `Menu ${index + 1}`, exact: true });
      await expect(row.getByLabel("Porsi", { exact: true })).toHaveValue("220");
      await row.getByLabel("Biaya per porsi (Rp)", { exact: true }).fill(price);
      await expect(row.getByLabel("Biaya per porsi (Rp)", { exact: true })).toHaveValue(
        index ? "5.000" : "10.000",
      );
    }
    await dialog.getByRole("button", { name: "Simpan 2 menu", exact: true }).click();
    await expect(dialog).toBeHidden();
    await page.reload();
    const list = page.getByRole("region", { name: "Daftar menu katering", exact: true });
    await expect(list).toContainText("Rp 3.350.000");
    await expect(list.getByText("Menu lama", { exact: true })).toBeVisible();
    await add.click();
    await dialog.getByRole("tab", { name: "Paket vendor", exact: true }).click();
    await dialog.getByLabel("Nama paket", { exact: true }).fill("Paket lengkap resepsi");
    await dialog.getByLabel("Nama vendor (opsional)", { exact: true }).fill("Dapur Bersama");
    await dialog
      .getByLabel("Daftar menu dalam paket", { exact: true })
      .fill("Nasi, ayam, bakso, es krim, air mineral");
    await expect(dialog.getByLabel("Jumlah tamu paket", { exact: true })).toHaveValue("220");
    await dialog.getByLabel("Total harga paket (Rp)", { exact: true }).fill("20000000");
    await dialog.getByRole("button", { name: "Simpan", exact: true }).click();
    await expect(dialog).toBeHidden();
    await page.reload();
    await expect(list).toContainText("Rp 23.350.000");
    await page
      .getByRole("button", { name: "Edit menu Paket lengkap resepsi", exact: true })
      .click();
    const edit = page.getByRole("dialog", { name: "Edit menu katering", exact: true });
    await expect(edit.getByLabel("Nama vendor (opsional)", { exact: true })).toHaveValue(
      "Dapur Bersama",
    );
    await expect(
      edit.getByRole("textbox", { name: "Daftar menu dalam paket", exact: true }),
    ).toHaveValue("Nasi, ayam, bakso, es krim, air mineral");
    await edit
      .getByRole("combobox", { name: "Perhitungan harga", exact: true })
      .selectOption("per-person");
    await edit.getByLabel("Harga per tamu (Rp)", { exact: true }).fill("50000");
    await edit.getByRole("button", { name: "Simpan", exact: true }).click();
    await expect(edit).toBeHidden();
    await page.reload();
    await expect(list).toContainText("Rp 14.350.000");
    await page.getByRole("checkbox", { name: "Gunakan daftar tamu otomatis" }).uncheck();
    await page.getByLabel("Jumlah undangan", { exact: true }).fill("50");
    await expect(page.getByText("110", { exact: true })).toBeVisible();
    await add.click();
    await dialog.getByRole("tab", { name: "Paket vendor", exact: true }).click();
    await expect(dialog.getByLabel("Jumlah tamu paket", { exact: true })).toHaveValue("110");
    await page.setViewportSize({ width: 375, height: 812 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(add).toBeFocused();
    await page
      .getByRole("button", { name: "Hapus menu Paket lengkap resepsi", exact: true })
      .click();
    await page.reload();
    await expect(list).toContainText("Rp 3.350.000");
  });
}
