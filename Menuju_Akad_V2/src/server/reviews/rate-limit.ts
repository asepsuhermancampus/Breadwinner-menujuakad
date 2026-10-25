import "server-only";
import { createHash } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";

export function consumeLimit(
  db: DatabaseSync,
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now(),
): boolean {
  db.prepare("DELETE FROM review_limits WHERE expires_at<=?").run(now);
  const hashed = createHash("sha256").update(key).digest("hex");
  const row = db
    .prepare(
      `INSERT INTO review_limits(key,count,expires_at) VALUES (?,1,?)
    ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count`,
    )
    .get(hashed, now + windowMs) as { count: number };
  return row.count <= limit;
}
