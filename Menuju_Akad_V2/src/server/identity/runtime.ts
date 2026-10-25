import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { Accounts } from "./accounts";
import { getReviewRepository } from "@/server/reviews/runtime";
let instance: Accounts | undefined;
export function getAccounts() {
  if (instance) return instance;
  const file =
    process.env["AUTH_DATABASE_PATH"] || path.join(process.cwd(), ".data", "auth.sqlite");
  mkdirSync(path.dirname(file), { recursive: true });
  const accounts = new Accounts(new DatabaseSync(file));
  const admins = getReviewRepository()
    .db.prepare("SELECT id,email,password_hash FROM review_admins")
    .all();
  for (const admin of admins) {
    const conflict = accounts.byEmail(String(admin.email));
    if (conflict && conflict.id !== admin.id)
      throw new Error("Superadmin migration identity conflict");
    accounts.db
      .prepare(
        "INSERT OR IGNORE INTO accounts(id,email,name,owner_key,password_hash,role) VALUES (?,?,?,?,?,'superadmin')",
      )
      .run(
        String(admin.id),
        String(admin.email),
        "Superadmin",
        accounts.emailOwner(`admin:${admin.id}`),
        String(admin.password_hash),
      );
  }
  instance = accounts;
  return accounts;
}
