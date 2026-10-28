import { afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import {
  applyDocumentTemplate,
  removeDocument,
  releaseDocumentTemplates,
} from "@/features/kua-documents/domain/document-template";
vi.mock("server-only", () => ({}));
const dbs: PaymentDatabase[] = [];
afterEach(() => dbs.splice(0).forEach((d) => d.close()));
it("starts empty for template consent and respects deliberate empty and legacy lists", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const s = new ResourceService(new WorkspaceService(db.storage()));
  const first = s.readResource("a", "documents");
  expect(first.data).toEqual([]);
  expect(s.readResource("a", "documents")).toEqual(first);
  s.writeResource("a", "documents", first.revision, []);
  expect(s.readResource("a", "documents").data).toEqual([]);
  s.writeResource("b", "documents", 0, [{ id: "old", title: "My document" }]);
  expect(s.readResource("b", "documents").data).toEqual([{ id: "old", title: "My document" }]);
});
it("round-trips template history and prevents changing or removing main documents", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const service = new ResourceService(new WorkspaceService(db.storage()));
  const items = applyDocumentTemplate(applyDocumentTemplate([], "main"), "outside");
  service.writeResource("templates", "documents", 0, items);
  expect(service.readResource("templates", "documents").data).toEqual(items);
  expect(() => service.writeResource("templates", "documents", 1, items.slice(1))).toThrow(
    "Berkas utama",
  );
  const removed = removeDocument(items, items.at(-1)!.id);
  service.writeResource("templates", "documents", 1, removed);
  expect(service.readResource("templates", "documents").data).toEqual(removed);
  const released = releaseDocumentTemplates(removed, "main");
  service.writeResource("templates", "documents", 2, released);
  expect(service.readResource("templates", "documents").data).toEqual(released);
  service.writeResource("templates", "documents", 3, []);
  expect(service.readResource("templates", "documents").data).toEqual([]);
  service.writeResource("templates", "documents", 4, applyDocumentTemplate([], "main"));
  expect(service.readResource("templates", "documents").data).toHaveLength(11);
});
it("migrates saved automatic samples once and preserves templates explicitly selected afterward", () => {
  const db = new PaymentDatabase();
  dbs.push(db);
  const workspaces = new WorkspaceService(db.storage()),
    service = new ResourceService(workspaces);
  for (const role of ["customer", "admin", "superadmin", "partner"]) {
    for (const plan of ["free", "premium", "lifetime"]) {
      const account = `${role}-${plan}`,
        workspace = workspaces.getOrCreateWorkspace(account);
      const chosen = applyDocumentTemplate([], "outside");
      const old = [
        {
          id: "kua-template-1",
          title: "Identitas calon pasangan",
          completed: false,
          notes: "Sesuaikan kebutuhan dan format dengan KUA setempat.",
        },
        ...chosen,
      ];
      db.storage()
        .prepare(
          "INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,'documents',?,7)",
        )
        .run(workspace.id, JSON.stringify(old));
      const migrated = service.readResource(account, "documents");
      expect(migrated).toEqual({ revision: 8, data: chosen });
      expect(service.readResource(account, "documents")).toEqual(migrated);
      expect(
        JSON.parse(
          String(
            db
              .storage()
              .prepare(
                "SELECT data FROM workspace_resources WHERE workspace_id=? AND kind='documents'",
              )
              .get(workspace.id)!["data"],
          ),
        ),
      ).toEqual(chosen);
      expect(() => service.writeResource(account, "documents", 7, [])).toThrow(
        "Data telah berubah",
      );
    }
  }
});
