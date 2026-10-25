import "server-only";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";

export type Account = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "superadmin";
  owner_key: string;
  password_hash: string | null;
  active: number;
  email_verified: number;
};
export const passwordHash = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
};
export function passwordMatches(password: string, hash: string | null) {
  const [salt, value] = (hash ?? "dummy:00").split(":");
  const actual = scryptSync(password, salt!, 64),
    expected = Buffer.from(value!, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}
export class Accounts {
  constructor(readonly db: DatabaseSync) {
    db.exec(`PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin','superadmin')),owner_key TEXT UNIQUE NOT NULL,
      password_hash TEXT,active INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS identities(subject TEXT PRIMARY KEY,account_id TEXT NOT NULL REFERENCES accounts(id));
      CREATE TABLE IF NOT EXISTS account_sessions(token TEXT PRIMARY KEY,account_id TEXT NOT NULL REFERENCES accounts(id),expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS account_links(token TEXT PRIMARY KEY,account_id TEXT NOT NULL REFERENCES accounts(id),expires INTEGER NOT NULL);`);
    db.exec("CREATE TABLE IF NOT EXISTS legacy_migrations(jti TEXT PRIMARY KEY)");
    db.exec(
      "CREATE TABLE IF NOT EXISTS legacy_google(account_id TEXT PRIMARY KEY,blocked INTEGER NOT NULL DEFAULT 0)",
    );
    db.exec("CREATE TABLE IF NOT EXISTS legacy_revocations(account_id TEXT PRIMARY KEY)");
    if (
      !db
        .prepare("PRAGMA table_info(accounts)")
        .all()
        .some((column) => column.name === "email_verified")
    )
      db.exec("ALTER TABLE accounts ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0");
  }
  emailOwner(email: string) {
    return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
  }
  byId(id: string) {
    return this.db.prepare("SELECT * FROM accounts WHERE id=? AND active=1").get(id) as
      Account | undefined;
  }
  byEmail(email: string) {
    return this.db
      .prepare("SELECT * FROM accounts WHERE email=?")
      .get(email.trim().toLowerCase()) as Account | undefined;
  }
  register(name: string, email: string, password: string, confirmation: string) {
    email = email.trim().toLowerCase();
    name = name.trim();
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      name.length < 2 ||
      name.length > 100
    )
      throw new Error("Periksa nama dan alamat email.");
    if (password.length < 12 || password.length > 128 || password !== confirmation)
      throw new Error("Password harus 12–128 karakter dan konfirmasi harus sama.");
    if (this.byEmail(email))
      throw new Error("Email sudah terdaftar. Masuk menggunakan metode akun tersebut.");
    const id = randomUUID();
    this.db
      .prepare("INSERT INTO accounts(id,email,name,owner_key,password_hash) VALUES (?,?,?,?,?)")
      .run(id, email, name, this.emailOwner(`manual:${id}`), passwordHash(password));
    return this.byId(id)!;
  }
  authenticate(email: string, password: string) {
    if (email.length > 254 || password.length > 128) return null;
    const account = this.byEmail(email);
    return passwordMatches(password, account?.password_hash ?? null) && account?.active
      ? account
      : null;
  }
  google(
    subject: string,
    email: string,
    name: string,
    verified: boolean,
    admin = false,
    link?: string,
    legacy = false,
  ) {
    if (!verified || !subject || !email) throw new Error("Email Google harus terverifikasi.");
    email = email.trim().toLowerCase();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const existing = this.byEmail(email);
      const legacyAccount = existing
        ? this.db.prepare("SELECT blocked FROM legacy_google WHERE account_id=?").get(existing.id)
        : undefined;
      if (
        legacy &&
        (legacyAccount?.blocked ||
          (existing &&
            this.db
              .prepare("SELECT 1 FROM legacy_revocations WHERE account_id=?")
              .get(existing.id)))
      )
        throw new Error("Sesi lama telah berakhir.");
      const identity = this.db
        .prepare("SELECT account_id FROM identities WHERE subject=?")
        .get(subject) as { account_id: string } | undefined;
      let account = identity ? this.byId(identity.account_id) : undefined;
      if (identity && !account) throw new Error("Akun tidak aktif.");
      if (!identity) {
        account = this.byEmail(email);
        const proof = link
          ? (this.db
              .prepare("DELETE FROM account_links WHERE token=? AND expires>? RETURNING account_id")
              .get(this.emailOwner(link), Date.now()) as { account_id: string } | undefined)
          : undefined;
        if (account && (!proof || proof.account_id !== account.id) && !legacyAccount)
          throw new Error("Hubungkan Google dari pengaturan keamanan akun terlebih dahulu.");
        if (proof && (!account || proof.account_id !== account.id))
          throw new Error("Gunakan email Google yang sama dengan akun.");
        if (!account) {
          const id = randomUUID();
          this.db
            .prepare("INSERT INTO accounts(id,email,name,owner_key,role) VALUES (?,?,?,?,?)")
            .run(id, email, name || email, this.emailOwner(email), admin ? "admin" : "customer");
          account = this.byId(id)!;
        }
        if (!account.active) throw new Error("Akun tidak aktif.");
        this.db.prepare("INSERT INTO identities VALUES (?,?)").run(subject, account.id);
      }
      this.db.prepare("UPDATE accounts SET email_verified=1 WHERE id=?").run(account!.id);
      if (legacy)
        this.db
          .prepare("INSERT OR IGNORE INTO legacy_google(account_id) VALUES (?)")
          .run(account!.id);
      this.db.exec("COMMIT");
      return account!;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  createSession(id: string, token = randomBytes(32).toString("hex")) {
    this.db.prepare("DELETE FROM account_sessions WHERE expires<=?").run(Date.now());
    this.db
      .prepare("INSERT INTO account_sessions VALUES (?,?,?)")
      .run(this.emailOwner(token), id, Date.now() + 86400000);
    return token;
  }
  migrateSession(id: string, jti: string) {
    const token = this.emailOwner(`legacy-session:${jti}`);
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const inserted = this.db
        .prepare("INSERT OR IGNORE INTO legacy_migrations VALUES (?)")
        .run(this.emailOwner(jti));
      if (inserted.changes) this.createSession(id, token);
      this.db.exec("COMMIT");
      return token;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  session(token: string) {
    const row = this.db
      .prepare("SELECT account_id FROM account_sessions WHERE token=? AND expires>?")
      .get(this.emailOwner(token), Date.now()) as { account_id: string } | undefined;
    return row ? (this.byId(row.account_id) ?? null) : null;
  }
  revoke(token: string) {
    this.db.prepare("DELETE FROM account_sessions WHERE token=?").run(this.emailOwner(token));
  }
  revokeLegacy(jti: string) {
    this.db.prepare("INSERT OR IGNORE INTO legacy_migrations VALUES (?)").run(this.emailOwner(jti));
    this.revoke(this.emailOwner(`legacy-session:${jti}`));
  }
}
