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
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5 AND typeof(rating)='integer'),
      comment TEXT NOT NULL CHECK(length(comment) BETWEEN 10 AND 2000),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','published','hidden')),
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
      moderated_at TEXT, moderated_by TEXT, seed INTEGER NOT NULL DEFAULT 0
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
  return db;
}
