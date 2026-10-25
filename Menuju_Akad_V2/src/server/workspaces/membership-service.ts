import "server-only";
import { randomBytes, createHash } from "node:crypto";
import type { WorkspaceService } from "./service";
import { PaymentError } from "@/server/payments/errors";
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
export class MembershipService {
  constructor(private readonly workspaces: WorkspaceService) {}
  listMemberships(account: string) {
    this.workspaces.getOrCreateWorkspace(account);
    return this.workspaces.db
      .prepare(
        "SELECT w.id,w.full_name,m.role FROM customer_workspaces w JOIN workspace_members m ON m.workspace_id=w.id WHERE m.account=? ORDER BY m.role,w.id",
      )
      .all(account)
      .map((row) => ({
        id: String(row["id"]),
        name: String(row["full_name"]) || "Ruang kalian",
        role: String(row["role"]),
      }));
  }
  invitePartner(owner: string) {
    const w = this.workspaces.getOrCreateWorkspace(owner),
      db = this.workspaces.db;
    if (
      Number(
        db.prepare("SELECT count(*) AS n FROM workspace_members WHERE workspace_id=?").get(w.id)?.[
          "n"
        ],
      ) >= 2
    )
      throw new PaymentError("Workspace sudah memiliki pasangan. Cabut akses lama dahulu.", 409);
    const token = randomBytes(32).toString("hex"),
      expires = Date.now() + 86400000;
    db.prepare("DELETE FROM workspace_invites WHERE workspace_id=?").run(w.id);
    db.prepare("INSERT INTO workspace_invites(hash,workspace_id,expires_at) VALUES(?,?,?)").run(
      hash(token),
      w.id,
      expires,
    );
    return { token, expiresAt: new Date(expires).toISOString() };
  }
  acceptPartnerInvite(account: string, token: string) {
    if (!/^[a-f0-9]{64}$/.test(token)) throw new PaymentError("Undangan tidak valid", 400);
    const db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    try {
      const invite = db
        .prepare(
          "SELECT * FROM workspace_invites WHERE hash=? AND accepted_by IS NULL AND expires_at>?",
        )
        .get(hash(token), Date.now());
      if (!invite) throw new PaymentError("Undangan sudah digunakan atau kedaluwarsa", 409);
      const id = String(invite["workspace_id"]);
      if (
        db
          .prepare("SELECT 1 FROM workspace_members WHERE workspace_id=? AND account=?")
          .get(id, account)
      )
        throw new PaymentError("Akun sudah menjadi anggota", 409);
      if (
        Number(
          db.prepare("SELECT count(*) AS n FROM workspace_members WHERE workspace_id=?").get(id)?.[
            "n"
          ],
        ) >= 2
      )
        throw new PaymentError("Workspace sudah penuh", 409);
      db.prepare(
        "INSERT INTO workspace_members(workspace_id,account,role) VALUES(?,?,'partner')",
      ).run(id, account);
      db.prepare("UPDATE workspace_invites SET accepted_by=? WHERE hash=?").run(
        account,
        hash(token),
      );
      db.exec("COMMIT");
      return { workspaceId: id };
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  revokePartner(owner: string) {
    const w = this.workspaces.getOrCreateWorkspace(owner),
      db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare("DELETE FROM workspace_members WHERE workspace_id=? AND role='partner'").run(w.id);
      db.prepare("DELETE FROM workspace_invites WHERE workspace_id=?").run(w.id);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}
