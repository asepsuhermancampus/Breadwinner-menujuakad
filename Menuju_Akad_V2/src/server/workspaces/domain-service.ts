import "server-only";
import { randomBytes } from "node:crypto";
import { resolveTxt } from "node:dns/promises";
import { PaymentError } from "@/server/payments/errors";
import type { WorkspaceService } from "./service";
import { readFeatureAvailability } from "./feature-availability";
export function validateDomain(value: string): string {
  const host = value.trim().toLowerCase();
  if (
    host.length > 253 ||
    !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host) ||
    /\.(?:localhost|localdomain|local|internal|test|invalid|example)$/.test(host)
  )
    throw new PaymentError("Gunakan nama domain publik yang valid", 400);
  return host;
}
export class DomainService {
  constructor(private readonly workspaces: WorkspaceService) {}
  get(owner: string) {
    const w = this.workspaces.getOrCreateWorkspace(owner);
    if (!readFeatureAvailability(this.workspaces.db, "domain", w.role, w).available)
      throw new PaymentError("Custom domain belum tersedia untuk akun ini.", 403);
    if (!w.subscription.capabilities.includes("custom-domain"))
      throw new PaymentError("Custom domain tersedia pada Lifetime", 403);
    const row = this.workspaces.db
      .prepare(
        "SELECT hostname,challenge,state,checked_at FROM workspace_domains WHERE workspace_id=?",
      )
      .get(w.id);
    return row
      ? {
          hostname: String(row["hostname"]),
          challenge: String(row["challenge"]),
          state: String(row["state"]),
          checkedAt: row["checked_at"] as string | null,
        }
      : null;
  }
  requestDomain(owner: string, hostname: string) {
    this.get(owner);
    const host = validateDomain(hostname);
    const db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    try {
      const current = this.get(owner);
      const w = this.workspaces.getOrCreateWorkspace(owner);
      if (current?.hostname === host) {
        db.exec("COMMIT");
        return current;
      }
      if (
        db
          .prepare("SELECT 1 FROM workspace_domains WHERE hostname=? AND workspace_id<>?")
          .get(host, w.id)
      )
        throw new PaymentError("Domain sudah terdaftar pada workspace lain", 409);
      db.prepare(
        `INSERT INTO workspace_domains(workspace_id,hostname,challenge,state) VALUES(?,?,?,'pending-dns')
      ON CONFLICT(workspace_id) DO UPDATE SET hostname=excluded.hostname,challenge=excluded.challenge,state='pending-dns',checked_at=NULL`,
      ).run(w.id, host, randomBytes(24).toString("hex"));
      const result = this.get(owner);
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  async verifyDomain(owner: string, lookup = resolveTxt) {
    const db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    let current: NonNullable<ReturnType<DomainService["get"]>>;
    let revision: number;
    let workspaceId: string;
    try {
      const domain = this.get(owner);
      if (!domain) throw new PaymentError("Daftarkan domain dahulu", 400);
      current = domain;
      workspaceId = this.workspaces.getOrCreateWorkspace(owner).id;
      const row = db
        .prepare(
          `INSERT INTO workspace_domain_verifications(workspace_id,revision) VALUES(?,1)
        ON CONFLICT(workspace_id) DO UPDATE SET revision=revision+1 RETURNING revision`,
        )
        .get(workspaceId)!;
      revision = Number(row["revision"]);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    let matches = false;
    try {
      const records = await lookup(`_menuju-akad.${current.hostname}`);
      matches = records.some((row) => row.join("") === current.challenge);
    } catch {
      /* missing DNS remains pending */
    }
    db.exec("BEGIN IMMEDIATE");
    try {
      const latest = this.get(owner);
      if (!latest || latest.hostname !== current.hostname || latest.challenge !== current.challenge)
        throw new PaymentError("Domain berubah. Periksa data terbaru sebelum memverifikasi.", 409);
      const marker = db
        .prepare("SELECT revision FROM workspace_domain_verifications WHERE workspace_id=?")
        .get(workspaceId);
      if (Number(marker?.["revision"]) !== revision)
        throw new PaymentError(
          "Ada pemeriksaan domain yang lebih baru. Periksa status terbaru.",
          409,
        );
      const w = this.workspaces.getOrCreateWorkspace(owner);
      // Local hosting cannot provision routing/TLS. DNS proof alone never means active.
      db.prepare("UPDATE workspace_domains SET state=?,checked_at=? WHERE workspace_id=?").run(
        matches ? "pending-hosting" : "pending-dns",
        new Date().toISOString(),
        w.id,
      );
      const result = this.get(owner);
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}
