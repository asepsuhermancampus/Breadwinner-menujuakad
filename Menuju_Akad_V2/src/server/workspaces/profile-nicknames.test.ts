import { afterEach, expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { PaymentDatabase } from "@/server/payments/db";
import { initializeWorkspaceSchema } from "./schema";
import { WorkspaceService } from "./service";
vi.mock("server-only", () => ({}));
const dbs: { close(): void }[] = [];
afterEach(() => {
  dbs.forEach((db) => db.close());
  dbs.length = 0;
});
it("migrates an old workspace table idempotently without losing profile data", () => {
  const db = new DatabaseSync(":memory:");
  dbs.push(db);
  db.exec(
    "CREATE TABLE customer_workspaces(id TEXT PRIMARY KEY,owner TEXT NOT NULL UNIQUE,full_name TEXT NOT NULL DEFAULT '',partner_name TEXT,revision INTEGER NOT NULL DEFAULT 0); INSERT INTO customer_workspaces VALUES('w','owner','Risa','Andi',4)",
  );
  initializeWorkspaceSchema(db);
  initializeWorkspaceSchema(db);
  expect(db.prepare("SELECT * FROM customer_workspaces").get()).toMatchObject({
    full_name: "Risa",
    partner_name: "Andi",
    nickname: "",
    partner_nickname: null,
    revision: 4,
  });
});
it("trims and validates nicknames and preserves them for older clients", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const service = new WorkspaceService(db.storage());
  const workspace = service.getOrCreateWorkspace("owner");
  db.storage()
    .prepare("INSERT INTO workspace_members VALUES(?,?,'partner')")
    .run(workspace.id, "partner");
  const profile = {
    fullName: "Risa Lengkap",
    partnerName: "Andi Lengkap",
    nickname: "  Ica  ",
    partnerNickname: "  Andi  ",
  };
  expect(service.saveProfile("owner", profile).profile).toMatchObject({
    nickname: "Ica",
    partnerNickname: "Andi",
  });
  expect(
    service.saveProfile("owner", { fullName: "Nama Baru", partnerName: null }).profile,
  ).toMatchObject({ fullName: "Nama Baru", nickname: "Ica", partnerNickname: "Andi" });
  expect(() => service.saveProfile("owner", { ...profile, nickname: "x".repeat(61) })).toThrow(
    "Profil",
  );
  expect(() =>
    service.saveProfile("owner", { ...profile, partnerNickname: "x".repeat(61) }),
  ).toThrow("Profil");
  expect(
    service.saveProfile("owner", { ...profile, nickname: " ", partnerNickname: null }).profile,
  ).toMatchObject({ nickname: "", partnerNickname: null });
});
