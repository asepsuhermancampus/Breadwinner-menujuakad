import "server-only";
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";

export type AdminAccount = { id: string; email: string; role: "superadmin" };
const DUMMY_SALT = "e83d64a12d947c7eff26bb706d463724";
const DUMMY_HASH = scryptSync("missing-account", DUMMY_SALT, 64);

export function provisionAccount(db: DatabaseSync, email: string, password: string): AdminAccount {
  const normalized = email.trim().toLowerCase();
  const existing = db
    .prepare("SELECT id,email,role FROM review_admins WHERE email=?")
    .get(normalized);
  if (existing) return existing as AdminAccount;
  if (password.length < 12 || password.length > 128)
    throw new Error("Password superadmin harus 12–128 karakter.");
  const salt = randomBytes(16).toString("hex");
  const hash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  const id = randomUUID();
  db.prepare(
    "INSERT OR IGNORE INTO review_admins(id,email,password_hash,role) VALUES (?,?,?,'superadmin')",
  ).run(id, normalized, hash);
  return db
    .prepare("SELECT id,email,role FROM review_admins WHERE email=?")
    .get(normalized) as AdminAccount;
}

export function verifyCredentials(
  db: DatabaseSync,
  email: string,
  password: string,
): AdminAccount | null {
  if (password.length > 128 || email.length > 254) return null;
  const row = db
    .prepare("SELECT id,email,role,password_hash FROM review_admins WHERE email=?")
    .get(email.trim().toLowerCase()) as (AdminAccount & { password_hash: string }) | undefined;
  const [salt, expected] = row?.password_hash.split(":") ?? [];
  const expectedBuffer = expected ? Buffer.from(expected, "hex") : DUMMY_HASH;
  const actual = scryptSync(password, salt || DUMMY_SALT, 64);
  if (expectedBuffer.length !== actual.length || !timingSafeEqual(actual, expectedBuffer) || !row)
    return null;
  return { id: row.id, email: row.email, role: row.role };
}
