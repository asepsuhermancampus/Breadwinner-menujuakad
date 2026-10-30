import { test, expect, type Browser } from "@playwright/test";
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

test("release targets use the owner's plan and workspace for both members", async ({ browser }) => {
  const auth = new DatabaseSync(authPath!);
  auth.exec(`CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,role TEXT NOT NULL,owner_key TEXT UNIQUE NOT NULL,password_hash TEXT,active INTEGER NOT NULL DEFAULT 1,email_verified INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS account_sessions(token TEXT PRIMARY KEY,account_id TEXT NOT NULL,expires INTEGER NOT NULL);`);
  for (const [id, role] of [
    ["release-root", "superadmin"],
    ["release-owner", "customer"],
    ["release-partner", "customer"],
    ["release-other", "customer"],
  ]) {
    auth
      .prepare("INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)")
      .run(id!, `${id}@example.test`, id!, role!, id!);
    auth
      .prepare("INSERT INTO account_sessions(token,account_id,expires) VALUES(?,?,?)")
      .run(createHash("sha256").update(`${id}-session`).digest("hex"), id!, Date.now() + 600000);
  }
  auth.close();
  async function session(id: string, instance: Browser) {
    const context = await instance.newContext({ baseURL: baseURL! });
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
  const [root, owner, partner, other] = await Promise.all(
    ["release-root", "release-owner", "release-partner", "release-other"].map((id) =>
      session(id, browser),
    ),
  );
  const ownerWorkspace = (await (await owner!.request.get("/api/workspace")).json()).workspace;
  const otherWorkspace = (await (await other!.request.get("/api/workspace")).json()).workspace;
  const db = new DatabaseSync(paymentPath!);
  db.exec("PRAGMA foreign_keys=OFF");
  db.prepare("INSERT INTO workspace_members(workspace_id,account,role) VALUES(?,?,'partner')").run(
    ownerWorkspace.id,
    "release-partner",
  );
  db.prepare(
    "INSERT INTO subscription_grants(id,order_id,owner,plan_id,granted_at,expires_at,capabilities) VALUES(?,?,?,?,?,?,?)",
  ).run(
    "release-grant",
    "release-order",
    "release-owner",
    "premium",
    new Date().toISOString(),
    null,
    "{}",
  );
  db.close();
  const partnerWorkspace = (await (await partner!.request.get("/api/workspace")).json()).workspace;
  expect(partnerWorkspace.id).toBe(ownerWorkspace.id);
  expect(partnerWorkspace.subscription.planId).toBe("premium");
  const post = (data: object) =>
    root!.request.post("/api/superadmin/feature-rollout", { headers: { origin: baseURL! }, data });
  const policy = {
    audiences: ["owner", "partner"],
    plans: ["premium"],
    workspaces: [ownerWorkspace.id],
  };
  expect(
    (
      await post({ action: "draft", feature: "tasks", revision: 0, policy, reason: "Uji sasaran" })
    ).status(),
  ).toBe(200);
  for (const [audience, plan, workspaceId, allowed] of [
    ["owner", "premium", ownerWorkspace.id, true],
    ["partner", "premium", ownerWorkspace.id, true],
    ["owner", "free", otherWorkspace.id, false],
    ["guest", "free", null, false],
  ] as const) {
    const preview = await post({
      action: "preview",
      feature: "tasks",
      audience,
      plan,
      workspaceId,
    });
    expect((await preview.json()).allowed).toBe(allowed);
  }
  expect(
    (await post({ action: "publish", feature: "tasks", revision: 1, scheduledAt: null })).status(),
  ).toBe(200);
  expect(
    (
      await post({ action: "draft", feature: "tasks", revision: 0, policy, reason: "Revisi lama" })
    ).status(),
  ).toBe(409);
  for (const context of [owner!, partner!]) {
    expect((await context.request.get("/api/workspace/resources/tasks")).status()).toBe(200);
    const page = await context.newPage();
    await page.goto("/planner/tasks");
    await expect(page.getByRole("heading", { name: "Tugas belum tersedia" })).toHaveCount(0);
  }
  expect((await other!.request.get("/api/workspace/resources/tasks")).status()).toBe(403);
  expect(
    (
      await other!.request.put("/api/workspace/resources/tasks", {
        headers: { origin: baseURL! },
        data: { revision: 0, data: [] },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await other!.request.get(`/api/workspace/resources/tasks?workspace=${ownerWorkspace.id}`)
    ).status(),
  ).toBe(404);
  const guest = await browser.newContext({ baseURL: baseURL! });
  expect((await (await guest.request.get("/api/workspace/task-status")).json()).status).toBe(
    "disabled",
  );
  await guest.close();
  const page = await other!.newPage();
  await page.goto("/planner/tasks");
  await expect(page.getByRole("heading", { name: "Tugas belum tersedia" })).toBeVisible();
  expect(
    (
      await post({
        action: "rollback",
        feature: "tasks",
        revision: 2,
        target: 0,
        reason: "Pulihkan",
      })
    ).status(),
  ).toBe(200);
  expect((await other!.request.get("/api/workspace/resources/tasks")).status()).toBe(200);
  await Promise.all([root!, owner!, partner!, other!].map((context) => context.close()));
});
