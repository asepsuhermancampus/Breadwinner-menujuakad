import { createDocumentTemplate } from "@/features/kua-documents/domain/document-template";
import "server-only";
import type { WorkspaceService } from "./service";
import { validateResource, type ResourceKind } from "./resource-policy";
import { PaymentError } from "@/server/payments/errors";
export class ResourceService {
  constructor(private readonly workspaces: WorkspaceService) {}
  readResource(
    account: string,
    kind: ResourceKind,
    workspaceId?: string,
  ): { revision: number; data: unknown[] } {
    const workspace = this.workspaces.requireWorkspace(account, workspaceId);
    if (kind === "documents")
      this.workspaces.db
        .prepare(
          "INSERT OR IGNORE INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,0)",
        )
        .run(workspace.id, kind, JSON.stringify(createDocumentTemplate()));
    const row = this.workspaces.db
      .prepare("SELECT * FROM workspace_resources WHERE workspace_id=? AND kind=?")
      .get(workspace.id, kind);
    return row
      ? { revision: Number(row["revision"]), data: JSON.parse(String(row["data"])) as unknown[] }
      : { revision: 0, data: [] };
  }
  writeResource(
    account: string,
    kind: ResourceKind,
    expectedRevision: number,
    data: unknown,
    workspaceId?: string,
  ) {
    const db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    try {
      const workspace = this.workspaces.requireWorkspace(account, workspaceId);
      const items = validateResource(kind, data, workspace.subscription);
      if (
        kind === "guests" &&
        db
          .prepare(
            `SELECT 1 FROM workspace_resources r, json_each(r.data) existing
        JOIN json_each(?) incoming ON json_extract(existing.value,'$.personalToken')=json_extract(incoming.value,'$.personalToken')
        WHERE r.kind='guests' AND r.workspace_id<>? LIMIT 1`,
          )
          .get(JSON.stringify(items), workspace.id)
      )
        throw new PaymentError("Token tamu telah digunakan workspace lain", 400);
      const current = this.readResource(account, kind, workspaceId);
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision !== current.revision)
        throw new PaymentError("Data telah berubah. Muat ulang sebelum menyimpan.", 409);
      db.prepare(
        `INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,?)
        ON CONFLICT(workspace_id,kind) DO UPDATE SET data=excluded.data,revision=excluded.revision`,
      ).run(workspace.id, kind, JSON.stringify(items), expectedRevision + 1);
      db.exec("COMMIT");
      return { revision: expectedRevision + 1 };
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}
