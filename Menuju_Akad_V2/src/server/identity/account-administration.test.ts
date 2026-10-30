import { expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { Accounts } from "./accounts";
import { changeAccountAccess } from "./account-administration";
vi.mock("server-only", () => ({}));
it("records role and status changes, revokes sessions and protects superadmins", () => {
  const accounts = new Accounts(new DatabaseSync(":memory:"));
  const db = accounts.db;
  const add = db.prepare(
    "INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)",
  );
  add.run("root", "root@example.test", "Root", "superadmin", "root-owner");
  add.run("customer", "customer@example.test", "Customer", "customer", "customer-owner");
  expect(() =>
    changeAccountAccess(
      db,
      "customer",
      "root",
      { role: "customer", active: false },
      { role: "superadmin", active: true, version: 0 },
      "no",
    ),
  ).toThrow();
  const token = accounts.createSession("customer");
  changeAccountAccess(
    db,
    "root",
    "customer",
    { role: "admin", active: true },
    { role: "customer", active: true, version: 0 },
    "Tim bantuan",
  );
  expect(accounts.session(token)).toBeNull();
  expect(accounts.byId("customer")?.role).toBe("admin");
  expect(() =>
    changeAccountAccess(
      db,
      "root",
      "customer",
      { role: "customer", active: false },
      { role: "customer", active: true, version: 0 },
      "stale",
    ),
  ).toThrow(/berubah/i);
  expect(() =>
    changeAccountAccess(
      db,
      "root",
      "root",
      { role: "customer", active: false },
      { role: "superadmin", active: true, version: 0 },
      "no",
    ),
  ).toThrow();
  changeAccountAccess(
    db,
    "root",
    "customer",
    { role: "customer", active: false },
    { role: "admin", active: true, version: 1 },
    "Akun ditangguhkan",
  );
  expect(accounts.byId("customer")).toBeUndefined();
  expect(
    db.prepare("SELECT actor,target,reason FROM account_access_audit ORDER BY id").all(),
  ).toEqual([
    expect.objectContaining({ actor: "root", target: "customer", reason: "Tim bantuan" }),
    expect.objectContaining({ actor: "root", target: "customer", reason: "Akun ditangguhkan" }),
  ]);
});

it("rejects a stale edit even when the role has changed back to its original value", () => {
  const accounts = new Accounts(new DatabaseSync(":memory:"));
  const add = accounts.db.prepare(
    "INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)",
  );
  add.run("root", "root@example.test", "Root", "superadmin", "root-owner");
  add.run("customer", "customer@example.test", "Customer", "customer", "customer-owner");
  changeAccountAccess(
    accounts.db,
    "root",
    "customer",
    { role: "admin", active: true },
    { role: "customer", active: true, version: 0 },
    "First change",
  );
  changeAccountAccess(
    accounts.db,
    "root",
    "customer",
    { role: "customer", active: true },
    { role: "admin", active: true, version: 1 },
    "Second change",
  );
  expect(() =>
    changeAccountAccess(
      accounts.db,
      "root",
      "customer",
      { role: "customer", active: false },
      { role: "customer", active: true, version: 0 },
      "Stale change",
    ),
  ).toThrow(/berubah/i);
});

it("blocks unused legacy Google sessions after access changes", () => {
  const accounts = new Accounts(new DatabaseSync(":memory:"));
  accounts.db
    .prepare("INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)")
    .run("root", "root@example.test", "Root", "superadmin", "root-owner");
  const user = accounts.google("google-sub", "user@example.test", "User", true);
  changeAccountAccess(
    accounts.db,
    "root",
    user.id,
    { role: "admin", active: true },
    { role: "customer", active: true, version: 0 },
    "Role changed",
  );
  expect(() =>
    accounts.google("google-sub", user.email, "User", true, false, undefined, true),
  ).toThrow("Sesi lama telah berakhir.");
  expect(accounts.google("google-sub", user.email, "User", true).id).toBe(user.id);
});
