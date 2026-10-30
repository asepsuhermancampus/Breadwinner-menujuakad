import { expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import type { Session } from "next-auth";
import { Accounts } from "./accounts";
import { PATCH } from "@/app/api/superadmin/accounts/[id]/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  accounts: null as Accounts | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/identity/runtime", () => ({ getAccounts: () => state.accounts! }));
const context = { params: Promise.resolve({ id: "target" }) };
const request = (origin = "http://localhost", role = "admin") =>
  new Request("http://localhost/api/superadmin/accounts/target", {
    method: "PATCH",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({
      role,
      active: true,
      expected: { role: "customer", active: true, version: 0 },
      reason: "Tim bantuan",
    }),
  });
it("requires superadmin and same-origin and rejects invalid and stale changes", async () => {
  state.accounts = new Accounts(new DatabaseSync(":memory:"));
  const insert = state.accounts.db.prepare(
    "INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)",
  );
  insert.run("root", "root@example.test", "Root", "superadmin", "root-owner");
  insert.run("target", "target@example.test", "Target", "customer", "target-owner");
  state.session = null;
  expect((await PATCH(request(), context)).status).toBe(401);
  state.session = {
    user: { id: "target", email: "target@example.test", role: "customer" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request(), context)).status).toBe(401);
  state.session = {
    user: { id: "root", email: "root@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request("https://evil.example"), context)).status).toBe(403);
  expect((await PATCH(request("http://localhost", "superadmin"), context)).status).toBe(400);
  expect((await PATCH(request(), context)).status).toBe(200);
  expect((await PATCH(request(), context)).status).toBe(409);
});
