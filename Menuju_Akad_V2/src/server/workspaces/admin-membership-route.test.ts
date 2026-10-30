import { expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import type { Session } from "next-auth";
import { Accounts } from "@/server/identity/accounts";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { MembershipService } from "./membership-service";
import { GET, POST } from "@/app/api/superadmin/workspace-memberships/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  accounts: null as Accounts | null,
  service: null as WorkspaceService | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/identity/runtime", () => ({ getAccounts: () => state.accounts! }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
const req = (body: object, origin = "http://localhost") =>
  new Request("http://localhost/api/superadmin/workspace-memberships", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
it("restricts membership inspection and audited revocation to superadmins", async () => {
  state.accounts = new Accounts(new DatabaseSync(":memory:"));
  state.accounts.db
    .prepare("INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)")
    .run("target", "a@example.test", "A", "customer", "partner");
  const database = new PaymentDatabase();
  state.service = new WorkspaceService(database.storage());
  const w = state.service.getOrCreateWorkspace("owner");
  database
    .storage()
    .prepare("INSERT INTO workspace_members VALUES(?,?,'partner')")
    .run(w.id, "partner");
  const get = () =>
    new Request("http://localhost/api/superadmin/workspace-memberships?account=target");
  const body = { workspaceId: w.id, target: "partner", revision: w.revision, reason: "Permintaan" };
  state.session = null;
  expect((await GET(get())).status).toBe(401);
  expect((await POST(req(body))).status).toBe(401);
  state.session = {
    user: { id: "root", email: "root@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  expect((await POST(req(body, "https://evil.example"))).status).toBe(403);
  expect((await (await GET(get())).json()).memberships).toMatchObject([
    { id: w.id, role: "partner" },
  ]);
  expect((await POST(req({ ...body, reason: "" }))).status).toBe(400);
  expect((await POST(req(body))).status).toBe(200);
  expect((await POST(req(body))).status).toBe(409);
  database.close();
});

it("requires superadmin and same origin to cancel a pending invitation", async () => {
  state.accounts = new Accounts(new DatabaseSync(":memory:"));
  state.accounts.db
    .prepare("INSERT INTO accounts(id,email,name,role,owner_key,active) VALUES(?,?,?,?,?,1)")
    .run("owner", "owner@example.test", "Owner", "customer", "owner");
  const database = new PaymentDatabase();
  state.service = new WorkspaceService(database.storage());
  const workspace = state.service.getOrCreateWorkspace("owner");
  new MembershipService(state.service).invitePartner("owner", workspace.id);
  state.session = {
    user: { id: "root", email: "root@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  const get = new Request("http://localhost/api/superadmin/workspace-memberships?account=owner");
  const listing = await (await GET(get)).json();
  const body = {
    action: "cancel_invite",
    workspaceId: workspace.id,
    invite: listing.memberships[0].invite,
    reason: "Permintaan",
  };
  expect((await POST(req(body, "https://evil.example"))).status).toBe(403);
  expect((await POST(req(body))).status).toBe(200);
  expect((await POST(req(body))).status).toBe(409);
  expect((await (await GET(get)).json()).history[0].action).toBe("cancel_invite");
  database.close();
});
