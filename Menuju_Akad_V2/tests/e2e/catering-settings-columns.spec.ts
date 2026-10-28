import { expect, test } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";

for (const mode of ["guest", "account"] as const) {
  test(`${mode} catering settings persist and source deadlines reach column-filtered budgets`, async ({
    page,
    context,
    baseURL,
  }) => {
    if (mode === "account") await customerSession(context, baseURL!, "catering-settings");
    await page.goto("/planner/catering");
    const invitations = page.getByLabel("Jumlah undangan", { exact: true });
    await expect(invitations).toHaveAttribute("type", "text");
    await invitations.fill("040");
    await expect(invitations).toHaveValue("40");
    const save = page.getByRole("button", { name: "Simpan perhitungan", exact: true });
    await save.click();
    await expect(save).toBeDisabled();
    await page.reload();
    await expect(invitations).toHaveValue("40");
    await page.getByRole("tab", { name: "Menu katering tersimpan", exact: true }).click();
    await page.getByRole("button", { name: "+ Menu katering", exact: true }).click();
    let dialog = page.getByRole("dialog", { name: "Tambah menu katering", exact: true });
    await expect(dialog).toContainText("Daftar tamu saat ini: 0 orang");
    await dialog.getByLabel("Nama menu", { exact: true }).fill("Menu tenggat uji");
    const portions = dialog.getByLabel("Porsi", { exact: true });
    await expect(portions).toHaveValue("88");
    await expect(portions).toHaveAttribute("readonly", "");
    await dialog.getByLabel("Pengisian porsi", { exact: true }).selectOption("manual");
    await portions.fill("012");
    await expect(portions).toHaveValue("12");
    await dialog.getByLabel("Biaya per porsi (Rp)", { exact: true }).fill("10000");
    await dialog.getByLabel("Tenggat pembayaran", { exact: true }).fill("2026-12-15");
    await dialog.getByRole("button", { name: "Simpan", exact: true }).click();
    await expect(dialog).toBeHidden();
    await page.getByRole("link", { name: "Buka anggaran katering", exact: true }).click();
    const row = page.getByRole("row").filter({ hasText: "Menu tenggat uji" });
    await expect(row).toContainText("15 Des 2026");
    await expect(row.getByText("Tidak ada catatan", { exact: true })).toHaveCSS(
      "font-style",
      "italic",
    );
    await row
      .getByRole("button", { name: "Lihat deskripsi Menu tenggat uji", exact: true })
      .click();
    const description = page.getByRole("dialog", { name: "Deskripsi kebutuhan", exact: true });
    await expect(description.getByText("Harga total", { exact: true })).toBeVisible();
    await expect(description.getByText("Rp 120.000", { exact: true })).toBeVisible();
    const notes = description.getByRole("region", { name: "Catatan", exact: true });
    await expect(notes).toContainText("Tidak ada catatan");
    expect(await notes.evaluate((el) => getComputedStyle(el).borderTopStyle)).toBe("solid");
    expect(await description.evaluate((el) => getComputedStyle(el, "::before").opacity)).toBe(
      "0.04",
    );
    expect(await description.evaluate((el) => getComputedStyle(el, "::before").zIndex)).toBe("0");
    await page.evaluate(async () => {
      const art = new Image();
      art.src = "/assets/finance/description-flowers.svg";
      await art.decode();
    });
    await page.screenshot({ path: `.review-tmp/description-production-${mode}.png` });
    await description.getByRole("button", { name: "Tutup dialog", exact: true }).click();
    await expect(
      page.getByRole("columnheader", { name: "Rencana Anggaran", exact: true }).getByRole("button"),
    ).toHaveCount(0);
    const statuses = page.getByRole("group", { name: "Filter status anggaran", exact: true });
    await expect(statuses.getByRole("button")).toHaveCount(3);
    await statuses.getByRole("button", { name: /^Tercapai/ }).click();
    await expect(row).toHaveCount(0);
    await statuses.getByRole("button", { name: /^Semua/ }).click();
    await expect(row).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Status", exact: true }).getByRole("button"),
    ).toHaveCount(0);
    await expect(row.getByText(/^Dibuat /)).toHaveCount(0);
    await expect(row.getByRole("button", { name: /^Duplikat / })).toHaveCount(0);
    await page.getByRole("button", { name: "Filter Kategori", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Filter Kategori", exact: true });
    await dialog.getByRole("radio", { name: "Dekorasi", exact: true }).click();
    await expect(row).toHaveCount(0);
    await dialog.getByRole("button", { name: "Reset filter", exact: true }).click();
    await page.getByRole("button", { name: "Filter Target (Rp)", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Filter Target (Rp)", exact: true });
    await expect(dialog.getByText(/Besar ke kecil|A ke Z|Lama ke baru/)).toHaveCount(0);
    await expect(dialog.locator("input")).toHaveCount(0);
    await dialog.getByRole("radio", { name: "Rp500 Ribu – <Rp1 Juta", exact: true }).click();
    await expect(row).toHaveCount(0);
    await dialog.getByRole("button", { name: "Reset filter", exact: true }).click();
    await page.getByRole("button", { name: "Filter Tenggat", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Filter Tenggat", exact: true });
    await expect(dialog.locator("input")).toHaveCount(0);
    await dialog.getByRole("radio", { name: "Tanpa Tenggat", exact: true }).click();
    await expect(row).toHaveCount(0);
    await expect(page.getByRole("columnheader", { name: "Tenggat", exact: true })).toBeVisible();
    await dialog.getByRole("button", { name: "Reset filter", exact: true }).click();
    await expect(row).toBeVisible();
    await page.reload();
    await expect(row).toContainText("15 Des 2026");
    await page.setViewportSize({ width: 375, height: 1000 });
    const scroll = page.getByRole("region", { name: "Daftar target anggaran", exact: true });
    expect(await scroll.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    await scroll.scrollIntoViewIfNeeded();
    await scroll.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
    });
    await expect(
      row.getByRole("button", { name: "Edit Menu tenggat uji", exact: true }),
    ).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await row.getByRole("button", { name: "Hapus Menu tenggat uji", exact: true }).click();
    dialog = page.getByRole("dialog", { name: "Hapus anggaran?", exact: true });
    await expect(dialog).toContainText("juga akan menghapus item asalnya");
    await dialog.getByRole("button", { name: "Hapus anggaran", exact: true }).click();
    await expect(dialog).toBeHidden();
    await expect(row).toHaveCount(0);
    await page.reload();
    await expect(row).toHaveCount(0);
    await page.goto("/planner/catering");
    await page.getByRole("tab", { name: "Menu katering tersimpan", exact: true }).click();
    await expect(
      page
        .getByRole("region", { name: "Pilihan menu katering", exact: true })
        .getByText("Menu tenggat uji", { exact: true }),
    ).toHaveCount(0);
  });
}
