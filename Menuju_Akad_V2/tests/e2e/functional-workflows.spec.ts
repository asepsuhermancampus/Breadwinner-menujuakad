import { test, expect } from "@playwright/test";
import { customerSession } from "../helpers/customer-session";

test("guest CSV, seating and check-in persist without account writes", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET" && r.url().includes("/api/workspace")) writes.push(r.url());
  });
  await page.goto("/planner/guests");
  await page.getByRole("button", { name: /Impor/i }).click();
  await page.getByLabel("Isi CSV").fill("nama,telepon,kuota,grup\nTamu CSV,081234567890,2,Teman");
  await page.getByRole("button", { name: "Impor tamu", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Impor CSV" })).toHaveCount(0);
  await page.getByRole("button", { name: "Penempatan Meja", exact: true }).click();
  await page.getByLabel("Nomor meja").fill("Meja 7");
  await page.getByRole("button", { name: "Simpan penempatan" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2")!).resources.guests[0]
            .tableNumber,
      ),
    )
    .toBe("Meja 7");
  await page.reload();
  await page.getByRole("button", { name: "Penempatan Meja", exact: true }).click();
  await expect(page.getByLabel("Nomor meja")).toHaveValue("Meja 7");
  await page.goto("/checkin");
  await page.getByLabel("Jumlah hadir Tamu CSV").fill("2");
  await page.getByRole("button", { name: "Simpan kehadiran" }).click();
  await expect(page.getByText("Tercatat: 2 dari 2 orang")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Tercatat: 2 dari 2 orang")).toBeVisible();
  expect(writes).toEqual([]);
});

test("guest Studio has five explicit saves and reloads actual content", async ({ page }) => {
  const writes: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET" && r.url().includes("/api/workspace")) writes.push(r.url());
  });
  await page.goto("/planner/invitations/studio");
  await page.getByRole("button", { name: "Form", exact: true }).click();
  await page.getByLabel("Judul pasangan", { exact: true }).fill("Belum disimpan");
  await page.waitForTimeout(1100);
  await page.getByRole("button", { name: "Kembali ke daftar undangan" }).click();
  await expect(page.getByRole("dialog", { name: "Perubahan belum tersinkron" })).toBeVisible();
  await page.getByRole("button", { name: "Lanjut mengedit" }).click();
  for (let i = 1; i <= 5; i++) {
    await page.getByLabel("Judul pasangan", { exact: true }).fill("Pasangan trial " + i);
    await page.getByRole("button", { name: "Simpan draf trial", exact: true }).click();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("menuju-akad:guest-trial:v2") ?? "null")?.used?.[
              "studio-drafts"
            ] ?? 0,
        ),
      )
      .toBe(i);
  }
  await page.reload();
  await page.getByRole("button", { name: "Form", exact: true }).click();
  await expect(page.getByLabel("Judul pasangan", { exact: true })).toHaveValue("Pasangan trial 5");
  await page.getByLabel("Judul pasangan", { exact: true }).fill("Draf keenam");
  await page.getByRole("button", { name: "Simpan draf trial", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Masuk untuk melanjutkan" })).toBeVisible();
  expect(writes).toEqual([]);
});

test("guest moodboard supports actual add edit delete", async ({ page }) => {
  await page.goto("/planner/moodboard");
  await page.getByRole("button", { name: "Tambah inspirasi" }).click();
  await page.getByLabel("Judul inspirasi").fill("Dekorasi pilihan");
  await page.getByRole("button", { name: "Simpan ke moodboard" }).click();
  await expect(page.getByRole("heading", { name: "Dekorasi pilihan" })).toBeVisible();
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Judul inspirasi").fill("Dekorasi revisi");
  await page.getByRole("button", { name: "Simpan ke moodboard" }).click();
  await expect(page.getByRole("heading", { name: "Dekorasi revisi" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dekorasi revisi" })).toBeVisible();
  await page.getByRole("button", { name: "Hapus", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Dekorasi revisi" })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dekorasi revisi" })).toHaveCount(0);
});

test("switching KUA edit target never copies another document title", async ({ page }) => {
  await page.goto("/planner/kua");
  const buttons = page.getByRole("button", { name: "Edit", exact: true });
  await expect.poll(() => buttons.count()).toBeGreaterThan(1);
  await buttons.nth(0).click();
  const field = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Simpan dokumen", exact: true }) })
    .getByLabel("Nama dokumen", { exact: true });
  const first = await field.inputValue();
  await buttons.nth(1).click();
  await expect(field).not.toHaveValue(first);
});

test("guest PDF exports five times and then requires login", async ({ page }) => {
  await page.goto("/planner/wedding-kit");
  const viewPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Buka dokumen cetak" }).click();
  const view = await viewPromise;
  await expect(view.locator("body")).toContainText("Rencana");
  await view.close();
  await expect(page.getByText("Sisa 5 dari 5 ekspor.", { exact: false })).toBeVisible();
  for (let i = 0; i < 5; i++) {
    const popup = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Cetak / simpan PDF" }).click();
    const doc = await popup;
    await expect(doc.locator("body")).toContainText("Rencana");
    await doc.close();
    await expect(page.getByText(`Sisa ${4 - i} dari 5 ekspor.`, { exact: false })).toBeVisible();
  }
  await page.getByRole("button", { name: "Cetak / simpan PDF" }).click();
  await expect(page.getByRole("dialog", { name: "Masuk untuk melanjutkan" })).toBeVisible();
});

test("published guest token accepts real RSVP and owner sees the change", async ({
  page,
  context,
  baseURL,
}) => {
  await customerSession(context, baseURL!, "real-rsvp");
  const token = crypto.randomUUID().replaceAll("-", "");
  const guest = {
    id: "rsvp-guest",
    name: "Tamu sebenarnya",
    personalToken: token,
    quota: 2,
    rsvpStatus: "PENDING",
    attendingCount: 0,
    waConsent: false,
    group: "Teman",
  };
  const send = async (kind: string, data: unknown[]) => {
    const current = await (await context.request.get("/api/workspace/resources/" + kind)).json();
    const result = await context.request.put("/api/workspace/resources/" + kind, {
      headers: { Origin: baseURL! },
      data: { revision: current.revision, data },
    });
    expect(result.ok()).toBe(true);
  };
  await send("guests", [guest]);
  await send("invitations", [
    { id: "actual-invite", title: "Acara kami", template: "basic", published: true },
  ]);
  await context.clearCookies();
  await page.goto("/i/" + token);
  await expect(page.getByRole("heading", { name: "Untuk Tamu sebenarnya" })).toBeVisible();
  await page.getByLabel("Konfirmasi kehadiran").selectOption("ATTENDING");
  await page.getByLabel("Jumlah hadir").fill("2");
  await page.getByRole("button", { name: "Simpan konfirmasi" }).click();
  await expect(page.getByText("Konfirmasi kehadiran tersimpan.")).toBeVisible();
  await customerSession(context, baseURL!, "real-rsvp");
  const result = await (await context.request.get("/api/workspace/resources/guests")).json();
  expect(result.data[0].attendingCount).toBe(2);
});
