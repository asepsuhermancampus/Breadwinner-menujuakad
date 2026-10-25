import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
vi.mock("server-only", () => ({}));
const dbs: PaymentDatabase[] = [];
afterEach(() => dbs.splice(0).forEach((db) => db.close()));
it("creates empty isolated accounts without requiring a profile", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const service = new WorkspaceService(db.storage());
  const a = service.getOrCreateWorkspace("a"),
    b = service.getOrCreateWorkspace("b");
  expect(a.id).not.toBe(b.id);
  expect(a.profile.fullName).toBe("");
  expect(a.subscription.planId).toBe("free");
  expect(JSON.stringify(a)).not.toMatch(/Andi|Risa|premium/);
  service.saveProfile("a", { fullName: "Asep", partnerName: null });
  expect(service.getOrCreateWorkspace("b").profile.fullName).toBe("");
  expect(service.getOrCreateWorkspace("a").profile.fullName).toBe("Asep");
});
