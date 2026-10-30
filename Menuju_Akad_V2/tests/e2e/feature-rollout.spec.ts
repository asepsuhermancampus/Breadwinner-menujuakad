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
test("a superadmin previews, publishes and rolls back a staged guest release", async ({
  context,
  page,
  browser,
}) => {
  test.setTimeout(90_000);
  const db = new DatabaseSync(dbPath!);
  db.exec(`CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,owner_key TEXT UNIQUE NOT NULL,password_hash TEXT,active INTEGER NOT NULL DEFAULT 1,email_verified INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS account_sessions(token TEXT PRIMARY KEY,account_id TEXT NOT NULL,expires INTEGER NOT NULL);`);
  db.prepare("INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)").run(
    "rollout-root",
    "rollout-root@example.test",
    "Root Uji",
    "superadmin",
    "rollout-root-owner",
  );
  const session = "rollout-superadmin-session";
  db.prepare("INSERT INTO account_sessions(token,account_id,expires) VALUES(?,?,?)").run(
    createHash("sha256").update(session).digest("hex"),
    "rollout-root",
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
  const panel = page.getByRole("region", { name: "Rilis fitur bertahap" });
  await panel.getByLabel("Alasan perubahan").fill("Uji rilis bertahap");
  await panel.getByRole("checkbox", { name: /tamu/i }).uncheck();
  await panel.getByRole("button", { name: "Simpan draf" }).click();
  await expect(panel.getByText("Perubahan rilis tersimpan.")).toBeVisible();
  await panel.getByRole("combobox", { name: "Kelompok", exact: true }).selectOption("guest");
  await panel.getByRole("button", { name: "Periksa pratinjau" }).click();
  await expect(panel.getByText("Sekarang: tersedia. Draf: dibatasi.")).toBeVisible();
  const guest = await browser.newContext({ baseURL: baseURL! });
  const guestPage = await guest.newPage();
  expect((await guestPage.request.get("/api/workspace/task-status")).status()).toBe(200);
  expect(
    (await (await guestPage.request.get("/api/workspace/task-status")).json()).status,
  ).not.toBe("disabled");
  const published = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/superadmin/feature-rollout") &&
      response.request().method() === "POST",
  );
  await panel.getByRole("button", { name: "Terbitkan sekarang" }).click();
  expect((await published).ok()).toBe(true);
  expect((await (await guestPage.request.get("/api/workspace/task-status")).json()).status).toBe(
    "disabled",
  );
  await guestPage.goto("/planner/tasks");
  await expect(guestPage.getByRole("heading", { name: "Tugas belum tersedia" })).toBeVisible();
  await panel.getByLabel("Alasan perubahan").fill("Pulihkan rilis awal");
  const restored = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/superadmin/feature-rollout") &&
      response.request().method() === "POST",
  );
  await panel.getByRole("button", { name: "Pulihkan sasaran awal" }).click();
  expect((await restored).ok()).toBe(true);
  expect(
    (await (await guestPage.request.get("/api/workspace/task-status")).json()).status,
  ).not.toBe("disabled");
  await panel.getByLabel("Alasan perubahan").fill("Rilis terjadwal");
  await panel.getByRole("checkbox", { name: /tamu/i }).uncheck();
  await panel.getByRole("button", { name: "Simpan draf" }).click();
  await expect(panel.getByRole("button", { name: "Terbitkan sekarang" })).toBeEnabled();
  await panel.getByLabel("Jadwal publikasi (opsional, waktu perangkat)").fill("2099-01-01T07:00");
  const scheduled = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/superadmin/feature-rollout") &&
      response.request().method() === "POST",
  );
  await panel.getByRole("button", { name: "Jadwalkan rilis" }).click();
  expect((await scheduled).ok()).toBe(true);
  expect(
    (await (await guestPage.request.get("/api/workspace/task-status")).json()).status,
  ).not.toBe("disabled");
  await guest.close();
});
