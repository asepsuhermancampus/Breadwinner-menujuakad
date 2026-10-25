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
        await page.getByLabel("Nama", { exact: true }).fill("Rencana " + kind);
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
        await expect(page.getByText("Rencana " + kind, { exact: true }).first()).toBeVisible();
        await page.reload();
        await expect(page.getByText("Rencana " + kind, { exact: true }).first()).toBeVisible();
        await page
          .getByRole("button", {
            name: kind === "calendar" ? "Lihat detail jadwal" : "Edit",
            exact: true,
          })
          .click();
        await page.getByLabel("Nama", { exact: true }).fill("Revisi " + kind);
        await page.getByRole("button", { name: "Simpan", exact: true }).click();
        await expect(page.getByText("Revisi " + kind, { exact: true }).first()).toBeVisible();
        await page.reload();
        await page.getByRole("button", { name: "Hapus", exact: true }).click();
        await expect(page.getByText("Revisi " + kind, { exact: true }).first()).toHaveCount(0);
        await page.reload();
        await expect(
          page.getByRole("button", {
            name: kind === "calendar" ? "Lihat detail jadwal" : "Edit",
            exact: true,
          }),
        ).toHaveCount(0);
      },
    );
  }
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
