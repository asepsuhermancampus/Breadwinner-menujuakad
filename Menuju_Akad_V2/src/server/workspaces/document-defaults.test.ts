import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
vi.mock("server-only", () => ({}));
const dbs: PaymentDatabase[] = [];
afterEach(() => dbs.splice(0).forEach((d) => d.close()));
it("initializes ready documents once and respects deliberate empty and legacy lists", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const s = new ResourceService(new WorkspaceService(db.storage()));
  const first = s.readResource("a", "documents");
  expect(first.data.length).toBeGreaterThan(5);
  expect(s.readResource("a", "documents")).toEqual(first);
  s.writeResource("a", "documents", first.revision, []);
  expect(s.readResource("a", "documents").data).toEqual([]);
  s.writeResource("b", "documents", 0, [{ id: "old", title: "My document" }]);
  expect(s.readResource("b", "documents").data).toEqual([{ id: "old", title: "My document" }]);
});
