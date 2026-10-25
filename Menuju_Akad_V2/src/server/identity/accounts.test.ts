import { describe, expect, it, vi } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
vi.mock("server-only", () => ({}));
import { Accounts } from "./accounts";

describe("canonical accounts", () => {
  it("persists credentials without granting email-based ownership or roles", () => {
    const accounts = new Accounts(new DatabaseSync(":memory:"));
    const user = accounts.register(
      "Nama Pengguna",
      "ADMIN@example.com",
      "correct horse battery",
      "correct horse battery",
    );
    expect(user.role).toBe("customer");
    expect(user.owner_key).not.toBe(accounts.emailOwner(user.email));
    expect(accounts.authenticate("admin@example.com", "wrong")).toBeNull();
    expect(accounts.authenticate("admin@example.com", "correct horse battery")?.id).toBe(user.id);
    expect(() =>
      accounts.register("Other", user.email, "correct horse battery", "correct horse battery"),
    ).toThrow();
    expect(() => accounts.google("subject", user.email, "Google User", false)).toThrow();
    expect(() => accounts.google("subject", user.email, "Google User", true)).toThrow("Hubungkan");
  });
  it("preserves verified Google ownership and revokes sessions", () => {
    const accounts = new Accounts(new DatabaseSync(":memory:"));
    const user = accounts.google("google-sub", "person@example.com", "Person", true);
    expect(user.owner_key).toBe(accounts.emailOwner(user.email));
    expect(accounts.google("google-sub", user.email, "Person", true).id).toBe(user.id);
    const token = accounts.createSession(user.id);
    expect(accounts.session(token)?.id).toBe(user.id);
    accounts.revoke(token);
    expect(accounts.session(token)).toBeNull();
  });
  it("persists credentials across database reopen", () => {
    const directory = mkdtempSync(path.join(os.tmpdir(), "ma-auth-unit-")),
      file = path.join(directory, "auth.sqlite");
    const first = new Accounts(new DatabaseSync(file));
    const user = first.register(
      "Persistent User",
      "persist@example.test",
      "persistent passphrase",
      "persistent passphrase",
    );
    first.db.close();
    const second = new Accounts(new DatabaseSync(file));
    expect(second.authenticate(user.email, "persistent passphrase")?.owner_key).toBe(
      user.owner_key,
    );
    second.db.close();
    rmSync(directory, { recursive: true });
  });
  it("requires a one-use matching account proof to link Google", () => {
    const accounts = new Accounts(new DatabaseSync(":memory:"));
    const user = accounts.register(
      "Manual User",
      "manual@example.test",
      "testing passphrase",
      "testing passphrase",
    );
    accounts.db
      .prepare("INSERT INTO account_links VALUES (?,?,?)")
      .run(accounts.emailOwner("proof"), user.id, Date.now() + 60000);
    const linked = accounts.google("google-sub", user.email, "Google User", true, true, "proof");
    expect(linked.id).toBe(user.id);
    expect(linked.role).toBe("customer");
    expect(linked.owner_key).toBe(user.owner_key);
    expect(accounts.db.prepare("SELECT * FROM account_links").all()).toHaveLength(0);
    expect(() => accounts.google("other-sub", user.email, "Other", true, false, "proof")).toThrow();
  });
  it("maps legacy generated subjects safely and blocks revoked legacy tokens", () => {
    const accounts = new Accounts(new DatabaseSync(":memory:"));
    const legacy = accounts.google(
      "old-generated-uuid",
      "legacy@example.test",
      "Legacy",
      true,
      false,
      undefined,
      true,
    );
    const current = accounts.google("real-google-sub", legacy.email, "Legacy", true);
    expect(current.id).toBe(legacy.id);
    const session = accounts.migrateSession(legacy.id, "old-jti");
    accounts.revoke(session);
    expect(accounts.session(accounts.migrateSession(legacy.id, "old-jti"))).toBeNull();
    accounts.revokeLegacy("unseen-jti");
    expect(accounts.session(accounts.migrateSession(legacy.id, "unseen-jti"))).toBeNull();
    accounts.db.prepare("UPDATE legacy_google SET blocked=1 WHERE account_id=?").run(legacy.id);
    expect(() =>
      accounts.google("old-generated-uuid", legacy.email, "Legacy", true, false, undefined, true),
    ).toThrow();
    expect(accounts.google("real-google-sub", legacy.email, "Legacy", true).id).toBe(legacy.id);
  });
  it("blocks unseen legacy tokens for canonical accounts without granting manual linking privileges", () => {
    const accounts = new Accounts(new DatabaseSync(":memory:"));
    const google = accounts.google("real-provider-sub", "google@example.test", "Google", true);
    accounts.db.prepare("INSERT INTO legacy_revocations VALUES (?)").run(google.id);
    expect(() =>
      accounts.google("real-provider-sub", google.email, "Google", true, false, undefined, true),
    ).toThrow();
    const manual = accounts.register(
      "Manual User",
      "unverified@example.test",
      "testing passphrase",
      "testing passphrase",
    );
    accounts.db.prepare("INSERT INTO legacy_revocations VALUES (?)").run(manual.id);
    expect(() => accounts.google("attacker-sub", manual.email, "Other", true)).toThrow("Hubungkan");
  });
});
