import "server-only";
import type { DatabaseSync } from "node:sqlite";
export function initializeWorkspaceSchema(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS customer_workspaces (
    id TEXT PRIMARY KEY, owner TEXT NOT NULL UNIQUE, full_name TEXT NOT NULL DEFAULT '',
    partner_name TEXT, revision INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS workspace_members (
      workspace_id TEXT NOT NULL REFERENCES customer_workspaces(id), account TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('owner','partner')), PRIMARY KEY(workspace_id,account));
    CREATE TABLE IF NOT EXISTS workspace_invites (
      hash TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, expires_at INTEGER NOT NULL, accepted_by TEXT);
    CREATE TABLE IF NOT EXISTS workspace_resources (
      workspace_id TEXT NOT NULL, kind TEXT NOT NULL, data TEXT NOT NULL, revision INTEGER NOT NULL,
      PRIMARY KEY(workspace_id,kind));
    CREATE TABLE IF NOT EXISTS customer_support (
      id TEXT PRIMARY KEY, owner TEXT NOT NULL, message TEXT NOT NULL, priority TEXT NOT NULL,
      created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS workspace_domains (
      workspace_id TEXT PRIMARY KEY, hostname TEXT NOT NULL UNIQUE, challenge TEXT NOT NULL,
      state TEXT NOT NULL, checked_at TEXT);
  `);
}
