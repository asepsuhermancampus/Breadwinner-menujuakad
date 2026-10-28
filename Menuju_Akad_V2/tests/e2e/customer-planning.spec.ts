import { test, expect } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";
for (const mode of ["guest", "account"] as const)
  for (const kind of ["calendar", "rundown", "seserahan", "emergency", "catering"] as const) {
    test(
      mode + " " + kind + " saves edits and deletes persistently",
      async ({ page, context, baseURL }) => {
        if (mode === "account") await customerSession(context, baseURL!, "planning-" + kind);
        await page.goto("/planner/" + kind);
        await page
          .getByRole("button", {
            name: {
              calendar: "+ Jadwal baru",
              rundown: "+ Kegiatan baru",
              seserahan: "+ Barang seserahan",
              emergency: "+ Tambah barang",
              catering: "+ Menu katering",
            }[kind],
            exact: true,
          })
          .click();
        const dialog = page.getByRole("dialog", {
          name: {
            calendar: "Tambah jadwal",
            rundown: "Tambah kegiatan",
            emergency: "Tambah perlengkapan darurat",
            seserahan: "Tambah barang seserahan",
            catering: "Tambah menu katering",
          }[kind],
          exact: true,
        });
        await expect(dialog).toBeVisible();
        await page
          .getByLabel(kind === "catering" ? "Nama menu" : "Nama", { exact: true })
          .fill("Rencana " + kind);
        if (kind === "calendar") {
          const date = new Date().toISOString().slice(0, 10);
          await page.getByLabel("Tanggal", { exact: true }).fill(date);
          await page.getByLabel("Mulai", { exact: true }).fill("09:00");
          await page.getByLabel("Selesai", { exact: true }).fill("10:00");
        }
        if (kind === "rundown") {
          await page.getByLabel("Urutan", { exact: true }).fill("1");
          await page.getByLabel("Waktu", { exact: true }).fill("09:00");
          await page.getByLabel("Penanggung jawab", { exact: true }).fill("Pasangan");
        }
        if (kind === "seserahan") {
          await page.getByLabel("Jumlah", { exact: true }).fill("2");
          await page.getByLabel("Harga satuan (Rp)", { exact: true }).fill("10000");
        }
        if (kind === "catering") {
          await page.getByLabel("Porsi", { exact: true }).fill("20");
          await page.getByLabel("Biaya per porsi (Rp)", { exact: true }).fill("5000");
        }
        await page.getByRole("button", { name: "Simpan", exact: true }).click();
        await expect(dialog).not.toBeVisible();
        await expect(page.getByText("Rencana " + kind, { exact: true }).first()).toBeVisible();
        await page.reload();
        await expect(page.getByText("Rencana " + kind, { exact: true }).first()).toBeVisible();
        await page
          .getByRole("button", {
            name:
              kind === "calendar"
                ? "Lihat detail jadwal"
                : kind === "catering"
                  ? "Edit menu Rencana catering"
                  : "Edit",
            exact: true,
          })
          .click();
        await expect(page.getByRole("dialog", { name: /^Edit / })).toBeVisible();
        await page
          .getByLabel(kind === "catering" ? "Nama menu" : "Nama", { exact: true })
          .fill("Revisi " + kind);
        await page.getByRole("button", { name: "Simpan", exact: true }).click();
        await expect(page.getByText("Revisi " + kind, { exact: true }).first()).toBeVisible();
        await page.reload();
        await page
          .getByRole("button", {
            name: kind === "catering" ? "Hapus menu Revisi catering" : "Hapus",
            exact: true,
          })
          .click();
        await expect(page.getByText("Revisi " + kind, { exact: true }).first()).toHaveCount(0);
        await page.reload();
        await expect(
          page.getByRole("button", {
            name:
              kind === "calendar"
                ? "Lihat detail jadwal"
                : kind === "catering"
                  ? "Edit menu Revisi catering"
                  : "Edit",
            exact: true,
          }),
        ).toHaveCount(0);
      },
    );
  }
test("planning popup protects a pending save and retains a rejected draft", async ({
  page,
  context,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "planning-popup-rejection");
  await page.goto("/planner/emergency");
  const gate = Promise.withResolvers<void>();
  await page.route("**/api/workspace/resources/emergency?*", async (route) => {
    if (route.request().method() !== "PUT") return route.continue();
    await gate.promise;
    await route.fulfill({ status: 500, json: { error: "Penyimpanan ditolak untuk pengujian" } });
  });
  await page.getByRole("button", { name: "+ Tambah barang", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Tambah perlengkapan darurat", exact: true });
  await dialog.getByLabel("Nama", { exact: true }).fill("Draf perlengkapan tetap tersedia");
  await dialog.getByRole("button", { name: "Simpan", exact: true }).click();
  try {
    await expect(dialog.getByLabel("Nama", { exact: true })).toBeDisabled();
    await page.keyboard.press("Escape");
    await dialog.getByRole("button", { name: "Tutup dialog" }).click();
    await expect(dialog).toBeVisible();
  } finally {
    gate.resolve();
  }
  await expect(dialog.getByRole("alert")).toContainText("Belum tersimpan");
  await expect(dialog.getByLabel("Nama", { exact: true })).toHaveValue(
    "Draf perlengkapan tetap tersedia",
  );
  await dialog.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(page.getByText("Draf perlengkapan tetap tersedia", { exact: true })).toHaveCount(0);
});

test("guest claim prompts real login without reservation", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.method() === "POST" && r.url().includes("/api/payments/plans")) posts.push(r.url());
  });
  await page.goto("/#paket");
  await page
    .getByTestId("plan-premium")
    .getByRole("button", { name: /klaim diskon/i })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Masuk untuk klaim diskon tambahan" }),
  ).toBeVisible();
  expect(posts).toEqual([]);
});
