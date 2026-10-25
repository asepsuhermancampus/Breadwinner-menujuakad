import "server-only";
import { randomBytes } from "node:crypto";
import { resolveTxt } from "node:dns/promises";
import { PaymentError } from "@/server/payments/errors";
import type { WorkspaceService } from "./service";
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
    const host = validateDomain(hostname),
      w = this.workspaces.getOrCreateWorkspace(owner);
    const current = this.get(owner);
    if (current?.hostname === host) return current;
    if (
      this.workspaces.db
        .prepare("SELECT 1 FROM workspace_domains WHERE hostname=? AND workspace_id<>?")
        .get(host, w.id)
    )
      throw new PaymentError("Domain sudah terdaftar pada workspace lain", 409);
    this.workspaces.db
      .prepare(
        `INSERT INTO workspace_domains(workspace_id,hostname,challenge,state) VALUES(?,?,?,'pending-dns')
      ON CONFLICT(workspace_id) DO UPDATE SET hostname=excluded.hostname,challenge=excluded.challenge,state='pending-dns',checked_at=NULL`,
      )
      .run(w.id, host, randomBytes(24).toString("hex"));
    return this.get(owner);
  }
  async verifyDomain(owner: string, lookup = resolveTxt) {
    const current = this.get(owner);
    if (!current) throw new PaymentError("Daftarkan domain dahulu", 400);
    let matches = false;
    try {
      const records = await lookup(`_menuju-akad.${current.hostname}`);
      matches = records.some((row) => row.join("") === current.challenge);
    } catch {
      /* missing DNS remains pending */
    }
    const w = this.workspaces.getOrCreateWorkspace(owner);
    // Local hosting cannot provision routing/TLS. DNS proof alone never means active.
    this.workspaces.db
      .prepare("UPDATE workspace_domains SET state=?,checked_at=? WHERE workspace_id=?")
      .run(matches ? "pending-hosting" : "pending-dns", new Date().toISOString(), w.id);
    return this.get(owner);
  }
}
