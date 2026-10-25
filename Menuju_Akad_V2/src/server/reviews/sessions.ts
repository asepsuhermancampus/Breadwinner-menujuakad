import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { AdminAccount } from "./accounts";

export const SESSION_SECONDS = 8 * 60 * 60;
export const SESSION_COOKIE = "ma_superadmin_session";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export function createSession(db: DatabaseSync, adminId: string, now = Date.now()): string {
  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM review_sessions WHERE expires_at<=?").run(now);
  db.prepare("INSERT INTO review_sessions(token_hash,admin_id,expires_at) VALUES (?,?,?)").run(
    digest(token),
    adminId,
    now + SESSION_SECONDS * 1000,
  );
  return token;
}
export function findSession(
  db: DatabaseSync,
  token: string | undefined,
  now = Date.now(),
): AdminAccount | null {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return (
    (db
      .prepare(
        `SELECT a.id,a.email,a.role FROM review_admins a JOIN review_sessions s ON a.id=s.admin_id
    WHERE s.token_hash=? AND s.expires_at>? AND a.role='superadmin'`,
      )
      .get(digest(token), now) as AdminAccount | undefined) ?? null
  );
}
export function revokeSession(db: DatabaseSync, token: string) {
  db.prepare("DELETE FROM review_sessions WHERE token_hash=?").run(digest(token));
}
