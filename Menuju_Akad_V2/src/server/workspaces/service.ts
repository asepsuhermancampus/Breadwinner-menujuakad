import "server-only";
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { CustomerWorkspace, CustomerProfile } from "@/features/customer-workspace/types";
import { initializeWorkspaceSchema } from "./schema";
import { readEntitlement } from "@/server/subscriptions/entitlement-query";
import { PaymentError } from "@/server/payments/errors";
import { workspaceOwnerSide } from "./couple-side";
import { partnerAccess } from "./partner-access";
import { profilePhotoUrls } from "./profile-photo-storage";

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
    const access = partnerAccess(this.db, String(row["id"]));
    return {
      partnerAccess: access,
      role: "owner",
      ownerSide: workspaceOwnerSide(this.db, String(row["id"]), account),
      id: String(row["id"]),
      profile: {
        ...profilePhotoUrls(this.db, String(row["id"])),
        fullName: String(row["full_name"]),
        partnerName: access.state === "connected" ? (row["partner_name"] as string | null) : null,
        nickname: String(row["nickname"]),
        partnerNickname:
          access.state === "connected" ? (row["partner_nickname"] as string | null) : null,
        ...(access.state !== "connected" ? { partnerPhotoUrl: null } : {}),
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
        (typeof profile.partnerName !== "string" || profile.partnerName.length > 160)) ||
      (profile.nickname !== undefined &&
        (typeof profile.nickname !== "string" || profile.nickname.trim().length > 60)) ||
      (profile.partnerNickname !== undefined &&
        profile.partnerNickname !== null &&
        (typeof profile.partnerNickname !== "string" || profile.partnerNickname.trim().length > 60))
    )
      throw new PaymentError("Profil tidak valid", 400);
    this.getOrCreateWorkspace(account);
    const previous = this.db
      .prepare("SELECT nickname,partner_nickname FROM customer_workspaces WHERE owner=?")
      .get(account)!;
    this.db
      .prepare(
        "UPDATE customer_workspaces SET full_name=?,partner_name=?,nickname=?,partner_nickname=?,revision=revision+1 WHERE owner=?",
      )
      .run(
        profile.fullName.trim(),
        profile.partnerName?.trim() ?? null,
        profile.nickname === undefined
          ? String(previous["nickname"] ?? "")
          : profile.nickname.trim(),
        profile.partnerNickname === undefined
          ? (previous["partner_nickname"] as string | null)
          : (profile.partnerNickname?.trim() ?? null),
        account,
      );
    return this.getOrCreateWorkspace(account);
  }

  requireWorkspace(account: string, id?: string) {
    const own = this.getOrCreateWorkspace(account);
    if (!id) {
      const linked = this.db
        .prepare(
          "SELECT workspace_id FROM workspace_members WHERE account=? AND role='partner' ORDER BY rowid DESC LIMIT 1",
        )
        .get(account);
      if (linked) id = String(linked["workspace_id"]);
    }
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
