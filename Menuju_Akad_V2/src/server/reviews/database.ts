import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";

export function openReviewDatabase(file: string) {
  if (file !== ":memory:") mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA foreign_keys=ON;
    PRAGMA busy_timeout=5000;
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS review_admins (
      id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL, role TEXT NOT NULL CHECK(role='superadmin')
    );
    CREATE TABLE IF NOT EXISTS review_sessions (
      token_hash TEXT PRIMARY KEY, admin_id TEXT NOT NULL REFERENCES review_admins(id),
      expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS website_reviews (
      id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
      rating REAL NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL CHECK(length(comment) BETWEEN 10 AND 2000),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','hidden')),
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
      moderated_at TEXT, moderated_by TEXT, seed INTEGER NOT NULL DEFAULT 0,
      tier TEXT NOT NULL DEFAULT 'free',
      account_id TEXT,
      user_email TEXT
    );
    CREATE INDEX IF NOT EXISTS website_reviews_status ON website_reviews(status,created_at DESC,id DESC);
    CREATE TABLE IF NOT EXISTS review_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS review_limits (
      key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS review_visitors (
      token_hash TEXT PRIMARY KEY, expires_at INTEGER NOT NULL
    );
  `);
  try {
    const tableSql = db
      .prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='website_reviews'")
      .get() as { sql?: string } | undefined;
    if (tableSql?.sql && tableSql.sql.includes("typeof(rating)='integer'")) {
      db.exec(`
        PRAGMA foreign_keys=OFF;
        CREATE TABLE website_reviews_new (
          id TEXT PRIMARY KEY, name TEXT NOT NULL CHECK(length(name) BETWEEN 2 AND 80),
          rating REAL NOT NULL CHECK(rating >= 1 AND rating <= 5),
          comment TEXT NOT NULL CHECK(length(comment) BETWEEN 10 AND 2000),
          status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','hidden')),
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
          moderated_at TEXT, moderated_by TEXT, seed INTEGER NOT NULL DEFAULT 0,
          tier TEXT NOT NULL DEFAULT 'free',
          account_id TEXT,
          user_email TEXT
        );
        INSERT INTO website_reviews_new (id,name,rating,comment,status,created_at,updated_at,moderated_at,moderated_by,seed,tier,account_id,user_email)
        SELECT id,name,rating,comment,status,created_at,updated_at,moderated_at,moderated_by,seed,
               COALESCE(tier, 'free'), account_id, user_email FROM website_reviews;
        DROP TABLE website_reviews;
        ALTER TABLE website_reviews_new RENAME TO website_reviews;
        CREATE INDEX IF NOT EXISTS website_reviews_status ON website_reviews(status,created_at DESC,id DESC);
        PRAGMA foreign_keys=ON;
      `);
    }
  } catch {}
  try { db.exec("ALTER TABLE website_reviews ADD COLUMN tier TEXT NOT NULL DEFAULT 'free'"); } catch {}
  try { db.exec("ALTER TABLE website_reviews ADD COLUMN account_id TEXT"); } catch {}
  try { db.exec("ALTER TABLE website_reviews ADD COLUMN user_email TEXT"); } catch {}
  return db;
}
