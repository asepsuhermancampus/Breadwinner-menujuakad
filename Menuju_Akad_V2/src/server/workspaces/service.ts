import "server-only";
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { CustomerWorkspace, CustomerProfile } from "@/features/customer-workspace/types";
import { initializeWorkspaceSchema } from "./schema";
import { readEntitlement } from "@/server/subscriptions/entitlement-query";
import { PaymentError } from "@/server/payments/errors";

export class WorkspaceService {
  constructor(readonly db: DatabaseSync) {
    initializeWorkspaceSchema(db);
  }

  getOrCreateWorkspace(account: string): CustomerWorkspace {
    if (!account.trim()) throw new PaymentError("Sesi diperlukan", 401);
    this.db
      .prepare("INSERT OR IGNORE INTO customer_workspaces(id,owner) VALUES(?,?)")
      .run(randomUUID(), account);
    const row = this.db.prepare("SELECT * FROM customer_workspaces WHERE owner=?").get(account)!;
    this.db
      .prepare(
        "INSERT OR IGNORE INTO workspace_members(workspace_id,account,role) VALUES(?,?,'owner')",
      )
      .run(String(row["id"]), account);
    return {
      role: "owner",
      id: String(row["id"]),
      profile: {
        fullName: String(row["full_name"]),
        partnerName: row["partner_name"] as string | null,
      },
      revision: Number(row["revision"]),
      subscription: readEntitlement(this.db, account),
    };
  }

  saveProfile(account: string, profile: CustomerProfile) {
    if (
      typeof profile.fullName !== "string" ||
      profile.fullName.length > 160 ||
      (profile.partnerName !== null &&
        (typeof profile.partnerName !== "string" || profile.partnerName.length > 160))
    )
      throw new PaymentError("Profil tidak valid", 400);
    this.getOrCreateWorkspace(account);
    this.db
      .prepare(
        "UPDATE customer_workspaces SET full_name=?,partner_name=?,revision=revision+1 WHERE owner=?",
      )
      .run(profile.fullName.trim(), profile.partnerName?.trim() ?? null, account);
    return this.getOrCreateWorkspace(account);
  }

  requireWorkspace(account: string, id?: string) {
    const own = this.getOrCreateWorkspace(account);
    if (!id || id === own.id) return own;
    const row = this.db
      .prepare(
        `SELECT w.owner FROM customer_workspaces w JOIN workspace_members m
      ON m.workspace_id=w.id WHERE w.id=? AND m.account=?`,
      )
      .get(id, account);
    if (!row) throw new PaymentError("Workspace tidak ditemukan", 404);
    return { ...this.getOrCreateWorkspace(String(row["owner"])), role: "partner" as const };
  }
}
