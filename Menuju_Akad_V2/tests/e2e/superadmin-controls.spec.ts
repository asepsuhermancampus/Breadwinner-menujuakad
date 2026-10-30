import { test, expect } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { encode } from "next-auth/jwt";

const dbPath = process.env.E2E_SUPERADMIN_AUTH_DB;
const baseURL = process.env.E2E_BASE_URL;
test.skip(
  !dbPath?.includes("isolated-superadmin-e2e-") || !baseURL || !process.env.AUTH_SECRET,
  "Requires isolated superadmin test databases",
);

test("superadmin manages dashboard cards and account access in an isolated database", async ({
  context,
  page,
  browser,
}) => {
  test.setTimeout(300_000);
  const db = new DatabaseSync(dbPath!);
  db.exec(`CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,owner_key TEXT UNIQUE NOT NULL,password_hash TEXT,active INTEGER NOT NULL DEFAULT 1,email_verified INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS account_sessions(token TEXT PRIMARY KEY,account_id TEXT NOT NULL,expires INTEGER NOT NULL);`);
  const insert = db.prepare(
    "INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)",
  );
  insert.run("e2e-root", "root-e2e@example.test", "Root Uji", "superadmin", "root-e2e-owner");
  insert.run(
    "e2e-customer",
    "customer-e2e@example.test",
    "Pelanggan Uji",
    "customer",
    "customer-e2e-owner",
  );
  const session = "e2e-superadmin-session";
  db.prepare("INSERT INTO account_sessions(token,account_id,expires) VALUES(?,?,?)").run(
    createHash("sha256").update(session).digest("hex"),
    "e2e-root",
    Date.now() + 600000,
  );
  db.close();
  const token = await encode({
    token: { sid: session },
    secret: process.env.AUTH_SECRET!,
    salt: "authjs.session-token",
    maxAge: 600,
  });
  await context.addCookies([
    { name: "authjs.session-token", value: token, url: baseURL!, httpOnly: true },
  ]);
  await page.goto("/superadmin/features");
  const availability = page.getByRole("region", { name: "Ketersediaan fitur per kelompok" });
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Uji pembatasan tugas");
  await availability.getByRole("button", { name: "Batasi Tugas" }).click();
  await expect(availability.getByRole("button", { name: "Sediakan Tugas" })).toBeVisible();
  await page.goto("/planner/tasks");
  await expect(page.getByRole("heading", { name: "Tugas belum tersedia" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Checklist & Tugas" })).toHaveCount(0);
  expect((await page.request.get("/api/workspace/resources/tasks")).status()).toBe(403);
  await page.goto("/dashboard");
  await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Janji berikutnya" })).toBeVisible();
  await page.goto("/planner/wedding-kit");
  await expect(page.locator("#feature-pdf")).not.toContainText("Tugas & persiapan");
  await page.goto("/superadmin/features");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan tugas");
  await availability.getByRole("button", { name: "Sediakan Tugas" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Tugas" })).toBeVisible({
    timeout: 20000,
  });
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("emergency");
  await availability.getByLabel("Alasan perubahan").fill("Uji perlengkapan");
  await availability.getByRole("button", { name: "Batasi Perlengkapan darurat" }).click();
  await expect(
    availability.getByRole("button", { name: "Sediakan Perlengkapan darurat" }),
  ).toBeVisible();
  await page.goto("/planner/emergency");
  await expect(
    page.getByRole("heading", { name: "Perlengkapan darurat belum tersedia" }),
  ).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/emergency")).status()).toBe(403);
  await expect(page.getByRole("link", { name: "Perlengkapan Darurat", exact: true })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Cari halaman, Ctrl atau Command K" }).click();
  await page.getByLabel("Cari halaman", { exact: true }).fill("darurat");
  await expect(page.getByRole("navigation", { name: "Hasil pencarian" })).not.toContainText(
    "Perlengkapan darurat",
  );
  await expect(page.getByText("Belum ada halaman yang cocok.")).toBeVisible();
  await page.goto("/superadmin/features");
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("emergency");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan perlengkapan");
  await availability.getByRole("button", { name: "Sediakan Perlengkapan darurat" }).click();
  await expect(
    availability.getByRole("button", { name: "Batasi Perlengkapan darurat" }),
  ).toBeVisible();
  const openDashboard = await context.newPage();
  await openDashboard.goto("/dashboard");
  await expect(openDashboard.getByRole("heading", { name: "Janji berikutnya" })).toBeVisible();
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("calendar");
  await availability.getByLabel("Alasan perubahan").fill("Uji kalender");
  await availability.getByRole("button", { name: "Batasi Kalender koordinasi" }).click();
  await expect(
    availability.getByRole("button", { name: "Sediakan Kalender koordinasi" }),
  ).toBeVisible();
  await expect(openDashboard.getByRole("heading", { name: "Janji berikutnya" })).toHaveCount(0, {
    timeout: 25000,
  });
  await expect(
    openDashboard.getByRole("link", { name: "Kalender Koordinasi", exact: true }),
  ).toHaveCount(0);
  await expect(openDashboard.getByRole("heading", { name: "Fokus kecil hari ini" })).toBeVisible();
  await openDashboard.close();
  await page.goto("/planner/calendar");
  await expect(
    page.getByRole("heading", { name: "Kalender koordinasi belum tersedia" }),
  ).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/calendar")).status()).toBe(403);
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Fokus kecil hari ini" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Janji berikutnya" })).toHaveCount(0);
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("calendar");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan kalender");
  await availability.getByRole("button", { name: "Sediakan Kalender koordinasi" }).click();
  await expect(
    availability.getByRole("button", { name: "Batasi Kalender koordinasi" }),
  ).toBeVisible();
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("moodboard");
  const openMoodboard = await context.newPage();
  await openMoodboard.goto("/planner/moodboard");
  await expect(
    openMoodboard.getByRole("heading", { name: "Inspirasi & moodboard belum tersedia" }),
  ).toHaveCount(0);
  await availability.getByLabel("Alasan perubahan").fill("Uji inspirasi");
  await availability.getByRole("button", { name: "Batasi Inspirasi & moodboard" }).click();
  await expect(
    availability.getByRole("button", { name: "Sediakan Inspirasi & moodboard" }),
  ).toBeVisible();
  await expect(
    openMoodboard.getByRole("heading", { name: "Inspirasi & moodboard belum tersedia" }),
  ).toBeVisible({ timeout: 25000 });
  await page.goto("/planner/moodboard");
  await expect(
    page.getByRole("heading", { name: "Inspirasi & moodboard belum tersedia" }),
  ).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/moodboard")).status()).toBe(403);
  await page.goto("/superadmin/features");
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("moodboard");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan inspirasi");
  await availability.getByRole("button", { name: "Sediakan Inspirasi & moodboard" }).click();
  await expect(
    availability.getByRole("button", { name: "Batasi Inspirasi & moodboard" }),
  ).toBeVisible();
  await expect(
    openMoodboard.getByRole("heading", { name: "Inspirasi & moodboard belum tersedia" }),
  ).toHaveCount(0, { timeout: 25000 });
  await openMoodboard.close();
  const trialContext = await browser.newContext({ baseURL: baseURL! });
  const trialPage = await trialContext.newPage();
  await trialPage.goto("/planner/moodboard");
  await trialPage.getByRole("button", { name: "Tambah inspirasi" }).click();
  await trialPage.getByLabel("Judul inspirasi").fill("Draf yang belum disimpan");
  await availability.getByLabel("Kelompok pengguna").selectOption("guest");
  await availability.getByLabel("Alasan perubahan").fill("Batasi percobaan");
  await availability.getByRole("button", { name: "Batasi Inspirasi & moodboard" }).click();
  await expect(
    trialPage.getByRole("heading", { name: "Inspirasi & moodboard belum tersedia" }),
  ).toBeVisible({ timeout: 25000 });
  await expect(
    trialPage.getByRole("dialog", { name: "Simpan inspirasi & catatan vendor" }),
  ).not.toBeVisible();
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan percobaan");
  await availability.getByRole("button", { name: "Sediakan Inspirasi & moodboard" }).click();
  await expect(trialPage.getByLabel("Judul inspirasi")).toHaveValue("Draf yang belum disimpan", {
    timeout: 25000,
  });
  await trialContext.close();
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("documents");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  const pendingDocsPage = await context.newPage();
  let releaseDocuments!: () => void;
  let markDocumentsRequested!: () => void;
  const documentsHeld = new Promise<void>((resolve) => {
    releaseDocuments = resolve;
  });
  const documentsRequested = new Promise<void>((resolve) => {
    markDocumentsRequested = resolve;
  });
  await pendingDocsPage.route(/\/api\/workspace\/resources\/documents(?:\?|$)/, async (route) => {
    markDocumentsRequested();
    await documentsHeld;
    await route.continue().catch(() => {});
  });
  await pendingDocsPage.goto("/dashboard", { waitUntil: "domcontentloaded" });
  await documentsRequested;
  const openKit = await context.newPage();
  await openKit.goto("/planner/wedding-kit");
  await expect(openKit.locator("#feature-pdf")).toContainText("Ringkasan dokumen");
  await availability.getByLabel("Alasan perubahan").fill("Uji dokumen");
  await availability.getByRole("button", { name: "Batasi Dokumen KUA" }).click();
  await expect(availability.getByRole("button", { name: "Sediakan Dokumen KUA" })).toBeVisible();
  await expect(pendingDocsPage.getByRole("heading", { name: /Selamat datang/ })).toBeVisible({
    timeout: 25000,
  });
  await expect(openKit.locator("#feature-pdf")).not.toContainText("Ringkasan dokumen", {
    timeout: 25000,
  });
  releaseDocuments();
  await pendingDocsPage.close();
  await page.goto("/planner/kua");
  await expect(page.getByRole("heading", { name: "Dokumen KUA belum tersedia" })).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/documents")).status()).toBe(403);
  await page.goto("/dashboard");
  await expect(
    page
      .getByRole("region", { name: "Metrik perencanaan" })
      .getByText("Dokumen KUA", { exact: true }),
  ).toHaveCount(0);
  await page.goto("/planner/wedding-kit");
  await expect(page.locator("#feature-pdf")).not.toContainText("Ringkasan dokumen");
  await page.goto("/superadmin/features");
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("documents");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan dokumen");
  await availability.getByRole("button", { name: "Sediakan Dokumen KUA" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Dokumen KUA" })).toBeVisible();
  await expect(openKit.locator("#feature-pdf")).toContainText("Ringkasan dokumen", {
    timeout: 25000,
  });
  await openKit.close();
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("rundown");
  await availability.getByLabel("Alasan perubahan").fill("Uji rundown");
  await availability.getByRole("button", { name: "Batasi Rundown acara" }).click();
  await expect(availability.getByRole("button", { name: "Sediakan Rundown acara" })).toBeVisible();
  await page.goto("/planner/rundown");
  await expect(page.getByRole("heading", { name: "Rundown acara belum tersedia" })).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/rundown")).status()).toBe(403);
  await expect(
    page.getByRole("link", { name: "Jadwal & hari acara", exact: true }),
  ).toHaveAttribute("href", "/planner/calendar");
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("rundown");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan rundown");
  await availability.getByRole("button", { name: "Sediakan Rundown acara" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Rundown acara" })).toBeVisible();
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("pdf");
  await availability.getByLabel("Alasan perubahan").fill("Uji ringkasan cetak");
  await availability.getByRole("button", { name: "Batasi Ringkasan cetak" }).click();
  await expect(
    availability.getByRole("button", { name: "Sediakan Ringkasan cetak" }),
  ).toBeVisible();
  await page.goto("/planner/wedding-kit");
  await expect(page.getByRole("heading", { name: "Ringkasan cetak belum tersedia" })).toBeVisible();
  expect((await page.request.get("/api/workspace/export")).status()).toBe(403);
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("pdf");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan ringkasan cetak");
  await availability.getByRole("button", { name: "Sediakan Ringkasan cetak" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Ringkasan cetak" })).toBeVisible();
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("invitations");
  await availability.getByLabel("Alasan perubahan").fill("Uji editor undangan");
  await availability.getByRole("button", { name: "Batasi Editor undangan" }).click();
  await expect(
    availability.getByRole("button", { name: "Sediakan Editor undangan" }),
  ).toBeVisible();
  await page.goto("/planner/invitations");
  await expect(page.getByRole("heading", { name: "Editor undangan belum tersedia" })).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/invitations")).status()).toBe(403);
  await expect(page.getByRole("link", { name: "Undangan digital", exact: true })).toHaveAttribute(
    "href",
    "/planner/invitations/studio",
  );
  await page.goto("/planner/invitations/studio");
  await expect(
    page
      .getByRole("navigation", { name: "Bagian Undangan digital" })
      .getByRole("link", { name: "Undangan", exact: true }),
  ).toHaveCount(0);
  await page.goto("/superadmin/features");
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("invitations");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan editor undangan");
  await availability.getByRole("button", { name: "Sediakan Editor undangan" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Editor undangan" })).toBeVisible();
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("studio-drafts");
  await availability.getByLabel("Alasan perubahan").fill("Uji studio");
  await availability.getByRole("button", { name: "Batasi Studio visual" }).click();
  await expect(availability.getByRole("button", { name: "Sediakan Studio visual" })).toBeVisible();
  await page.goto("/planner/invitations/studio");
  await expect(page.getByRole("heading", { name: "Studio visual belum tersedia" })).toBeVisible();
  await expect(
    page.getByRole("status").getByRole("link", { name: "Kembali ke undangan" }),
  ).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/studio-drafts")).status()).toBe(403);
  await page.goto("/superadmin/features");
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("studio-drafts");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan studio");
  await availability.getByRole("button", { name: "Sediakan Studio visual" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Studio visual" })).toBeVisible();
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("guests");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Uji pengelolaan tamu");
  await availability.getByRole("button", { name: "Batasi Pengelolaan tamu" }).click();
  await expect(
    availability.getByRole("button", { name: "Sediakan Pengelolaan tamu" }),
  ).toBeVisible();
  await page.goto("/planner/guests");
  await expect(
    page.getByRole("heading", { name: "Pengelolaan tamu belum tersedia" }),
  ).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/guests")).status()).toBe(403);
  await page.goto("/checkin");
  await expect(
    page.getByRole("heading", { name: "Pengelolaan tamu belum tersedia" }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByRole("link", { name: "Daftar tamu & RSVP" })).toHaveCount(0);
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("guests");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan pengelolaan tamu");
  await availability.getByRole("button", { name: "Sediakan Pengelolaan tamu" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Pengelolaan tamu" })).toBeVisible();
  await availability.getByLabel("Kelompok pengguna").selectOption("guest");
  await availability.getByLabel("Alasan perubahan").fill("Uji tamu percobaan");
  await availability.getByRole("button", { name: "Batasi Pengelolaan tamu" }).click();
  const guestManagementContext = await browser.newContext({ baseURL: baseURL! });
  const guestManagementPage = await guestManagementContext.newPage();
  await guestManagementPage.goto("/checkin");
  await expect(
    guestManagementPage.getByRole("heading", { name: "Pengelolaan tamu belum tersedia" }),
  ).toBeVisible();
  expect(
    (await guestManagementPage.request.get("/api/workspace/feature-status/guests")).status(),
  ).toBe(200);
  expect(
    (await (await guestManagementPage.request.get("/api/workspace/feature-status/guests")).json())
      .status,
  ).toBe("disabled");
  await guestManagementContext.close();
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan tamu percobaan");
  await availability.getByRole("button", { name: "Sediakan Pengelolaan tamu" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Pengelolaan tamu" })).toBeVisible();
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("finance");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Uji keuangan");
  await availability.getByRole("button", { name: "Batasi Keuangan" }).click();
  await expect(availability.getByRole("button", { name: "Sediakan Keuangan" })).toBeVisible();
  await page.goto("/planner/finance");
  await expect(page.getByRole("heading", { name: "Keuangan belum tersedia" })).toBeVisible();
  expect((await page.request.get("/api/workspace/finance")).status()).toBe(403);
  expect((await page.request.get("/api/workspace/resources/finance")).status()).toBe(403);
  await page.goto("/dashboard");
  await expect(page.getByText("Anggaran acara", { exact: true })).toHaveCount(0);
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("finance");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan keuangan");
  await availability.getByRole("button", { name: "Sediakan Keuangan" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Keuangan" })).toBeVisible();
  await availability.getByLabel("Kelompok pengguna").selectOption("guest");
  await availability.getByLabel("Alasan perubahan").fill("Uji keuangan percobaan");
  await availability.getByRole("button", { name: "Batasi Keuangan" }).click();
  const financeGuestContext = await browser.newContext({ baseURL: baseURL! });
  const financeGuestPage = await financeGuestContext.newPage();
  await financeGuestPage.goto("/planner/finance");
  await expect(
    financeGuestPage.getByRole("heading", { name: "Keuangan belum tersedia" }),
  ).toBeVisible();
  await financeGuestContext.close();
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan keuangan percobaan");
  await availability.getByRole("button", { name: "Sediakan Keuangan" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Keuangan" })).toBeVisible();
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("support");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Uji bantuan");
  await availability.getByRole("button", { name: "Batasi Bantuan" }).click();
  await page.goto("/account/support");
  await expect(
    page.getByRole("status").filter({ hasText: "Bantuan belum tersedia" }),
  ).toBeVisible();
  const supportResponse = await page.request.post("/api/workspace/support", {
    headers: { origin: baseURL! },
    data: { message: "Pesan uji bantuan" },
  });
  expect(supportResponse.status()).toBe(403);
  await page.goto("/account");
  await expect(
    page
      .getByRole("navigation", { name: "Pengaturan akun" })
      .getByRole("link", { name: "Bantuan" }),
  ).toHaveCount(0);
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("support");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan bantuan");
  await availability.getByRole("button", { name: "Sediakan Bantuan" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Bantuan" })).toBeVisible();
  const createdVendor = await page.request.post("/api/marketplace/vendors", {
    headers: { origin: baseURL! },
    data: { name: "Vendor uji", category: "Dekorasi", description: "Uji", price: 1000 },
  });
  expect(createdVendor.status()).toBe(200);
  const vendorId = (await createdVendor.json()).vendor.id as string;
  const createdOrder = await page.request.post("/api/marketplace/requests", {
    headers: { origin: baseURL! },
    data: { vendorIds: [vendorId], message: "Pesanan uji" },
  });
  expect(createdOrder.status()).toBe(200);
  const orderId = (await createdOrder.json()).order.id as string;
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("vendors");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Uji vendor");
  await availability.getByRole("button", { name: "Batasi Vendor" }).click();
  await page.goto("/marketplace");
  await expect(page.getByRole("status").filter({ hasText: "Vendor belum tersedia" })).toBeVisible();
  expect((await page.request.get("/api/workspace/resources/vendor-favorites")).status()).toBe(403);
  expect(
    (
      await page.request.post("/api/marketplace/requests", {
        headers: { origin: baseURL! },
        data: { vendorIds: [vendorId], message: "Uji" },
      })
    ).status(),
  ).toBe(403);
  await page.goto(`/orders/${orderId}`);
  await expect(page.getByRole("heading", { name: "Permintaan penawaran diterima" })).toBeVisible();
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("vendors");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan vendor");
  await availability.getByRole("button", { name: "Sediakan Vendor" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Vendor" })).toBeVisible();
  await availability.getByLabel("Kelompok pengguna").selectOption("guest");
  await availability.getByLabel("Alasan perubahan").fill("Uji vendor percobaan");
  await availability.getByRole("button", { name: "Batasi Vendor" }).click();
  const vendorGuestContext = await browser.newContext({ baseURL: baseURL! });
  const vendorGuestPage = await vendorGuestContext.newPage();
  await vendorGuestPage.goto("/marketplace/favorites");
  await expect(
    vendorGuestPage.getByRole("status").filter({ hasText: "Vendor belum tersedia" }),
  ).toBeVisible();
  expect(
    (await (await vendorGuestPage.request.get("/api/workspace/feature-status/vendors")).json())
      .status,
  ).toBe("disabled");
  await vendorGuestContext.close();
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan vendor percobaan");
  await availability.getByRole("button", { name: "Sediakan Vendor" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Vendor" })).toBeVisible();
  for (const [feature, label, item] of [
    [
      "seserahan",
      "Seserahan",
      { id: "gift-e2e", title: "Hadiah E2E", quantity: 1, unitCost: 10000 },
    ],
    [
      "catering",
      "Katering",
      {
        id: "menu-e2e",
        title: "Menu E2E",
        portions: 10,
        unitCost: 1000,
        mode: "unit",
        category: "buffet",
      },
    ],
  ] as const) {
    const origin = { origin: baseURL! };
    const existing = await (await page.request.get(`/api/workspace/resources/${feature}`)).json();
    const saved = await page.request.put(`/api/workspace/resources/${feature}`, {
      headers: origin,
      data: { revision: existing.revision, data: [...existing.data, item] },
    });
    expect(saved.status()).toBe(200);
    await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption(feature);
    await availability.getByLabel("Kelompok pengguna").selectOption("owner");
    await availability.getByLabel("Alasan perubahan").fill(`Uji ${label}`);
    await availability.getByRole("button", { name: `Batasi ${label}` }).click();
    await expect(availability.getByRole("button", { name: `Sediakan ${label}` })).toBeVisible();
    expect((await page.request.get(`/api/workspace/resources/${feature}`)).status()).toBe(403);
    if (feature === "catering")
      expect((await page.request.get("/api/workspace/resources/catering-settings")).status()).toBe(
        403,
      );
    const snapshot = await page.request.get("/api/workspace/finance");
    expect(snapshot.status()).toBe(200);
    expect(JSON.stringify(await snapshot.json())).not.toContain(item.title);
    await page.goto(`/planner/${feature}`);
    await expect(page.getByRole("heading", { name: `${label} belum tersedia` })).toBeVisible();
    await page.goto("/superadmin/features");
    await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption(feature);
    await availability.getByLabel("Kelompok pengguna").selectOption("owner");
    await availability.getByLabel("Alasan perubahan").fill(`Pulihkan ${label}`);
    await availability.getByRole("button", { name: `Sediakan ${label}` }).click();
    await expect(availability.getByRole("button", { name: `Batasi ${label}` })).toBeVisible();
    expect(
      JSON.stringify(await (await page.request.get(`/api/workspace/resources/${feature}`)).json()),
    ).toContain(item.title);
    await availability.getByLabel("Kelompok pengguna").selectOption("guest");
    await availability.getByLabel("Alasan perubahan").fill(`Uji ${label} percobaan`);
    await availability.getByRole("button", { name: `Batasi ${label}` }).click();
    const trialContext = await browser.newContext({ baseURL: baseURL! });
    const trialPage = await trialContext.newPage();
    await trialPage.goto(`/planner/${feature}`);
    await expect(trialPage.getByRole("heading", { name: `${label} belum tersedia` })).toBeVisible();
    expect(
      (await (await trialPage.request.get(`/api/workspace/feature-status/${feature}`)).json())
        .status,
    ).toBe("disabled");
    await trialContext.close();
    await availability.getByLabel("Alasan perubahan").fill(`Pulihkan ${label} percobaan`);
    await availability.getByRole("button", { name: `Sediakan ${label}` }).click();
    await expect(availability.getByRole("button", { name: `Batasi ${label}` })).toBeVisible();
  }
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("domain");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Uji domain");
  await availability.getByRole("button", { name: "Batasi Custom domain" }).click();
  await page.goto("/account/domain");
  await expect(
    page.getByRole("status").filter({ hasText: "Custom domain belum tersedia" }),
  ).toBeVisible();
  expect((await page.request.get("/api/workspace/domain")).status()).toBe(403);
  await page.goto("/account");
  await expect(
    page
      .getByRole("navigation", { name: "Pengaturan akun" })
      .getByRole("link", { name: "Custom domain" }),
  ).toHaveCount(0);
  await page.goto("/superadmin/features");
  await availability.getByRole("combobox", { name: "Fitur", exact: true }).selectOption("domain");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan domain");
  await availability.getByRole("button", { name: "Sediakan Custom domain" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Custom domain" })).toBeVisible();
  await availability
    .getByRole("combobox", { name: "Fitur", exact: true })
    .selectOption("studio-drafts");
  await availability.getByLabel("Kelompok pengguna").selectOption("owner");
  await availability.getByLabel("Kelompok pengguna").selectOption("guest");
  await availability.getByLabel("Alasan perubahan").fill("Uji studio percobaan");
  await availability.getByRole("button", { name: "Batasi Studio visual" }).click();
  await expect(availability.getByRole("button", { name: "Sediakan Studio visual" })).toBeVisible();
  const guestContext = await browser.newContext({ baseURL: baseURL! });
  const guestPage = await guestContext.newPage();
  await guestPage.goto("/planner/invitations");
  await expect(guestPage.getByRole("link", { name: /Buka studio visual/i })).toHaveCount(0);
  await guestPage.getByRole("button", { name: "Tambah undangan", exact: true }).click();
  await guestPage.getByLabel("Judul undangan").fill("Undangan uji");
  await guestPage.getByRole("button", { name: "Simpan undangan" }).click();
  await expect(
    guestPage.getByRole("button", { name: "Kelola undangan", exact: true }),
  ).toBeVisible();
  await expect(guestPage.getByRole("link", { name: /Buka studio visual/i })).toHaveCount(0);
  await guestContext.close();
  await availability.getByLabel("Alasan perubahan").fill("Pulihkan studio percobaan");
  await availability.getByRole("button", { name: "Sediakan Studio visual" }).click();
  await expect(availability.getByRole("button", { name: "Batasi Studio visual" })).toBeVisible();
  const cards = page.getByRole("region", { name: "Card dan bagian dashboard" });
  await cards.getByLabel("Kelompok pengguna").selectOption("owner");
  await cards.getByLabel("Alasan perubahan").fill("Uji tampilan dashboard");
  await cards.getByRole("button", { name: "Sembunyikan Tugas" }).click();
  await expect(cards.getByRole("button", { name: "Tampilkan Tugas" })).toBeVisible();
  await cards.getByLabel("Alasan perubahan").fill("Uji bagian dashboard");
  await cards.getByRole("button", { name: "Sembunyikan Langkah perencanaan" }).click();
  await expect(cards.getByRole("button", { name: "Tampilkan Langkah perencanaan" })).toBeVisible();
  const catering = page.getByRole("region", { name: "Pengaturan Katering" });
  await catering.getByLabel("Alasan perubahan").fill("Uji pemeliharaan katering");
  await catering.getByRole("button", { name: "Mulai pemeliharaan" }).click();
  await expect(catering.getByRole("button", { name: "Aktifkan kembali" })).toBeVisible();
  await page.goto("/planner/catering");
  await expect(
    page.getByRole("heading", { level: 1, name: "Katering sedang dalam pemeliharaan" }),
  ).toBeVisible();
  await page.goto("/superadmin/features");
  const studio = page.getByRole("region", { name: "Pengaturan Studio undangan" });
  await studio.getByLabel("Alasan perubahan").fill("Uji pemeliharaan studio");
  await studio.getByRole("button", { name: "Mulai pemeliharaan" }).click();
  await expect(studio.getByRole("button", { name: "Aktifkan kembali" })).toBeVisible();
  await page.goto("/planner/invitations/studio");
  await expect(
    page.getByRole("heading", { level: 1, name: "Studio undangan sedang dalam pemeliharaan" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Kembali ke undangan" })).toBeVisible();
  await page.goto("/superadmin/features");
  const finance = page.getByRole("region", { name: "Pengaturan Keuangan" });
  await finance.getByLabel("Alasan perubahan").fill("Uji pemeliharaan keuangan");
  await finance.getByRole("button", { name: "Mulai pemeliharaan" }).click();
  await expect(finance.getByRole("button", { name: "Aktifkan kembali" })).toBeVisible();
  await page.goto("/planner/finance");
  await expect(
    page.getByRole("heading", { level: 1, name: "Keuangan sedang dalam pemeliharaan" }),
  ).toBeVisible();
  await page.goto("/dashboard");
  await expect(
    page
      .getByRole("region", { name: "Metrik perencanaan" })
      .getByText("Checklist tugas", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Langkah perencanaan berikutnya" })).toHaveCount(0);
  await page.goto("/superadmin/accounts?q=customer-e2e");
  await page.getByRole("button", { name: "Atur akses" }).click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toHaveAccessibleName("Atur akses akun");
  await dialog.getByRole("combobox", { name: "Role", exact: true }).selectOption("admin");
  await dialog.getByLabel("Alasan perubahan").fill("Uji akses tim");
  await dialog.getByRole("button", { name: "Simpan perubahan akses" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("row").filter({ hasText: "customer-e2e@example.test" }),
  ).toContainText("admin");
  await expect(page.getByText("Uji akses tim", { exact: true })).toBeVisible();
});
