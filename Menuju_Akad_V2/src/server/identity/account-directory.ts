import "server-only";
import type { DatabaseSync } from "node:sqlite";

export function listAccountDirectory(db: DatabaseSync, query: string, page: number) {
  const search = query.trim().slice(0, 100).replace(/[\%_]/g, "\$&");
  const safePage = Number.isSafeInteger(page) ? Math.min(10000, Math.max(1, page)) : 1;
  const rows = db
    .prepare(
      `SELECT id,email,name,role,active,access_revision FROM accounts
    WHERE name LIKE ? ESCAPE '\' OR email LIKE ? ESCAPE '\'
    ORDER BY name COLLATE NOCASE, id LIMIT 51 OFFSET ?`,
    )
    .all(`%${search}%`, `%${search}%`, (safePage - 1) * 50);
  return {
    accounts: rows.slice(0, 50).map((row) => ({
      id: String(row.id),
      email: String(row.email),
      name: String(row.name),
      role: String(row.role),
      active: row.active === 1,
      version: Number(row.access_revision),
    })),
    hasMore: rows.length > 50,
  };
}
