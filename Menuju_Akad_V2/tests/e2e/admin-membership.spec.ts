import { test, expect } from "@playwright/test";
import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";
import { encode } from "next-auth/jwt";
const baseURL = process.env.E2E_BASE_URL;
const authPath = process.env.E2E_SUPERADMIN_AUTH_DB;
const paymentPath = process.env.PAYMENT_DATABASE_PATH;
test.skip(
  !baseURL ||
    !authPath?.includes("isolated-superadmin-e2e-") ||
    !paymentPath?.includes("isolated-superadmin-e2e-") ||
    !process.env.AUTH_SECRET,
  "Requires isolated databases",
);
test("superadmin reviews and revokes partner membership with an audit reason", async ({
  browser,
}) => {
  const auth = new DatabaseSync(authPath!);
  auth.exec(`CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,owner_key TEXT UNIQUE NOT NULL,password_hash TEXT,active INTEGER NOT NULL DEFAULT 1,email_verified INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS account_sessions(token TEXT PRIMARY KEY,account_id TEXT NOT NULL,expires INTEGER NOT NULL);`);
  for (const [id, role] of [
    ["membership-root", "superadmin"],
    ["membership-owner", "customer"],
    ["membership-partner", "customer"],
  ]) {
    auth
      .prepare("INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)")
      .run(id!, `${id}@example.test`, id!, role!, id!);
    auth
      .prepare("INSERT INTO account_sessions(token,account_id,expires) VALUES(?,?,?)")
      .run(createHash("sha256").update(`${id}-session`).digest("hex"), id!, Date.now() + 600000);
  }
  auth.close();
  async function contextFor(id: string) {
    const context = await browser.newContext({ baseURL: baseURL! });
    const token = await encode({
      token: { sid: `${id}-session` },
      secret: process.env.AUTH_SECRET!,
      salt: "authjs.session-token",
      maxAge: 600,
    });
    await context.addCookies([
      { name: "authjs.session-token", value: token, url: baseURL!, httpOnly: true },
    ]);
    return context;
  }
  const root = await contextFor("membership-root");
  const owner = await contextFor("membership-owner");
  const partner = await contextFor("membership-partner");
  const workspace = (await (await owner.request.get("/api/workspace")).json()).workspace;
  const db = new DatabaseSync(paymentPath!);
  db.prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(
    workspace.id,
    "membership-partner",
  );
  db.close();
  expect(
    (
      await partner.request.get(`/api/workspace/resources/tasks?workspace=${workspace.id}`)
    ).status(),
  ).toBe(200);
  const page = await root.newPage();
  await page.goto("/superadmin/accounts?q=membership-owner");
  await page
    .getByRole("row", { name: /membership-owner@example.test/ })
    .getByRole("button", { name: "Keanggotaan" })
    .click();
  const dialog = page.getByRole("dialog", { name: "Keanggotaan workspace" });
  await expect(dialog.getByText("Pasangan: membership-partner@example.test")).toBeVisible();
  await dialog.getByRole("button", { name: "Cabut akses pasangan" }).click();
  await expect(dialog.getByRole("button", { name: "Konfirmasi pencabutan" })).toBeDisabled();
  await dialog.getByLabel("Alasan pencabutan").fill("Permintaan pemilik");
  await dialog.getByRole("button", { name: "Konfirmasi pencabutan" }).click();
  await expect(
    dialog.getByText("Akses pasangan dicabut. Data workspace tetap tersimpan."),
  ).toBeVisible();
  await expect(dialog.getByText(/Permintaan pemilik/)).toBeVisible();
  expect(
    (
      await partner.request.get(`/api/workspace/resources/tasks?workspace=${workspace.id}`)
    ).status(),
  ).toBe(404);
  expect(
    (await owner.request.get(`/api/workspace/resources/tasks?workspace=${workspace.id}`)).status(),
  ).toBe(200);
  const invitation = await owner.request.post("/api/workspace/partner", {
    headers: { origin: baseURL! },
    data: { action: "invite" },
  });
  expect(invitation.status()).toBe(200);
  const { token: inviteToken } = await invitation.json();
  await dialog.getByRole("button", { name: "Tutup dialog" }).click();
  await page
    .getByRole("row", { name: /membership-owner@example.test/ })
    .getByRole("button", { name: "Keanggotaan" })
    .click();
  await dialog.getByRole("button", { name: "Batalkan undangan pasangan" }).click();
  await dialog.getByLabel("Alasan pencabutan").fill("Undangan dibatalkan atas permintaan");
  await dialog.getByRole("button", { name: "Konfirmasi pembatalan undangan" }).click();
  await expect(dialog.getByText("Undangan pasangan dibatalkan.")).toBeVisible();
  expect((await partner.request.get(`/api/workspace/partner?token=${inviteToken}`)).status()).toBe(
    409,
  );
  await Promise.all([root, owner, partner].map((context) => context.close()));
});
