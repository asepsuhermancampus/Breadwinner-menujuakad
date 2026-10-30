import { expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import type { Session } from "next-auth";
import { Accounts } from "./accounts";
import { GET } from "@/app/api/superadmin/accounts/route";
import { listAccountDirectory } from "./account-directory";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  accounts: null as Accounts | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/identity/runtime", () => ({ getAccounts: () => state.accounts! }));
it("allows only superadmin to search accounts without exposing credentials or ownership keys", async () => {
  state.accounts = new Accounts(new DatabaseSync(":memory:"));
  state.accounts.db
    .prepare(
      "INSERT INTO accounts(id,email,name,role,owner_key,password_hash,active) VALUES(?,?,?,?,?,?,?)",
    )
    .run("one", "one@example.test", "Maya", "customer", "secret-owner", "secret-hash", 1);
  const request = new Request("http://localhost/api/superadmin/accounts?q=maya");
  state.session = null;
  expect((await GET(request)).status).toBe(401);
  state.session = {
    user: { id: "other", email: "admin@example.test", role: "admin" },
    expires: "2099-01-01",
  };
  expect((await GET(request)).status).toBe(401);
  state.session = {
    user: { id: "root", email: "root@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  const result = await GET(request);
  expect(result.status).toBe(200);
  expect(await result.json()).toEqual({
    accounts: [
      {
        id: "one",
        email: "one@example.test",
        name: "Maya",
        role: "customer",
        active: true,
        version: 0,
      },
    ],
    hasMore: false,
  });
  const wildcard = await GET(new Request("http://localhost/api/superadmin/accounts?q=%25"));
  expect((await wildcard.json()).accounts).toEqual([]);
});

it("paginates results and treats wildcard characters as literal search text", () => {
  const db = new DatabaseSync(":memory:");
  new Accounts(db);
  const insert = db.prepare(
    "INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,?)",
  );
  for (let i = 0; i < 51; i++)
    insert.run(
      `id-${i}`,
      `user${i}@example.test`,
      `User ${i}`,
      "customer",
      `owner-${i}`,
      i === 0 ? 0 : 1,
    );
  expect(listAccountDirectory(db, "User", 1).accounts).toHaveLength(50);
  expect(listAccountDirectory(db, "User", 1).hasMore).toBe(true);
  expect(listAccountDirectory(db, "User", 2).accounts).toHaveLength(1);
  expect(listAccountDirectory(db, "_", 1).accounts).toHaveLength(0);
  expect(listAccountDirectory(db, "user0@example.test", 1).accounts[0]?.active).toBe(false);
});
